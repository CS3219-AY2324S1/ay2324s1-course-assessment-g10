import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import * as random from "lib0/random";
import { Question } from "../models/Question.model";
import { useSelector } from "react-redux";
import { User, selectUser } from "../reducers/authSlice";
import { useMatchmake } from "./matchmake.context";
import { Navigate, useLoaderData } from "react-router-dom";
import { Buffer } from "buffer";
import data from "../data/lang_temps.json";
import { ToastId, useToast } from "@chakra-ui/react";
import { wsCollabUrl } from "../api/gateway";
import { getExecutionResult, submitCodeForExecution } from "../api/code";
import { getProfilePicUrl } from "../api/user";

export type language = keyof typeof data;

export const langList = Object.keys(data) as language[];
export const LangDataMap = data;

export type chatRecord = {
  nickname: string;
  msg: string;
  avatar?: string;
};

type executionResult =
  | "Accepted"
  | "TLE"
  | "MLE"
  | "WA"
  | "Compile Error"
  | "Runtime Error"
  | "Unknown";

export type SubmissionResult = {
  evaluated: number;
  total: number;
  verdict: string;
  completed: boolean;
};

export type submissionRecord = {
  time: number;
  user: string;
  qn_id: string;
  code: string;
  lang: language;
  result: executionResult;
};

const usercolors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

// select a random color for this user
export const userColor = usercolors[random.uint32() % usercolors.length];

const CHAT_KEY = "peerprepchat";
const SUBMISSION_HISTORY_KEY = "peerprepsubmissions";

const STATES_KEY = "peerprepstates";
const SUBMISSION_STATE = "code_being_eval";
const CURR_LANG_STATE = "peerpreplang";
const CODE_STATE = "peerprepcode";
const TOKEN_STATE = "peerpreptoken";
const SUBMISSION_RESULT_STATE = "peerprepsubmission";

interface SharedEditorInterface {
  lang?: language;
  provider?: WebrtcProvider;
  ycode?: Y.Text;
  codeUndo?: Y.UndoManager;
  chat: chatRecord[];
  submissions: submissionRecord[];
  submissionLoading?: boolean;
  qn?: Question;
  currSubmission?: submissionRecord;
  submissionResult?: SubmissionResult;

  replaceCode: (s: string) => void;
  sendToChat: (s: string) => void;
  submitCode: () => void;
  changeLang: (s: language) => void;
  clearCode: () => void;
}

export const SharedEditorContext = createContext<SharedEditorInterface>({
  chat: [],
  submissions: [],
  submissionLoading: true,

  replaceCode: () => {},
  sendToChat: () => {},
  submitCode: () => {},
  changeLang: () => {},
  clearCode: () => {},
});

export const SharedEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const toast = useToast();
  const qn = useLoaderData() as Question | undefined;
  const user = useSelector(selectUser) as User; // null check should be done before this

  // exposed variables
  const { matchedRoom, disconnectRoom } = useMatchmake();
  const [lang, setLang] = useState<language>();
  const [codeUndo, setCodeUndo] = useState<Y.UndoManager>();
  const [ycode, setycode] = useState<Y.Text>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [submissions, setSubmissions] = useState<submissionRecord[]>([]);
  const [submissionLoading, setSubmissionLoading] = useState<boolean>(true);
  const [chat, setChat] = useState<chatRecord[]>([]);
  const [currSubmission, setCurrSubmission] = useState<submissionRecord>();
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>();

  // internal variables
  const [_chat, _setChat] = useState<Y.Array<chatRecord>>();

  // state variables that are accessed internally to track states
  const lastSubmissionToastId = useRef<ToastId | undefined>();
  const lastLangSelected = useRef<language | undefined>();
  const lastCode = useRef<string | undefined>();
  const cachedPastSubmissions = useRef<submissionRecord[]>([]);
  const _states = useRef<Y.Map<any> | undefined>();
  const _submissions = useRef<Y.Array<any> | undefined>();
  const _poll_interval = useRef<NodeJS.Timeout | undefined>();

  const myAvatar = getProfilePicUrl(user.profilePic);

  const submitToServer = async (submission: submissionRecord) => {
    // curr submission and currsubmission in state should alr be submitted
    console.log("submitting answer to server");
    const res = await submitCodeForExecution({
      lang: submission.lang,
      source_code: submission.code,
      qn__id: submission.qn_id,
      uid: submission.user,
    })

    const token = res.data.token as string;

    _states.current?.set(TOKEN_STATE, token);
    _poll_interval.current = setInterval(async () => {
      const res = await getExecutionResult(token);
      const result = res.data as SubmissionResult;
      _states.current?.set(SUBMISSION_RESULT_STATE, result);
      if (result.completed) {
        console.log(result);
        clearInterval(_poll_interval.current);
        _poll_interval.current = undefined;
        const newSubmission = {
          ...submission,
          result: result.verdict as executionResult,
        };
        _submissions.current?.push([newSubmission]);
        setCurrSubmission(undefined);
        _states.current?.delete(SUBMISSION_STATE);
        _states.current?.delete(TOKEN_STATE);
        _states.current?.delete(SUBMISSION_RESULT_STATE);
      }
    }, 1000);
  };

  const sendToChat = (s: string) => {
    if (!_chat) return;
    _chat.push([
      {
        msg: s,
        nickname: user.username,
        avatar: myAvatar,
      },
    ]);
    setChat(_chat.toArray());
  };

  const submitCode = () => {
    const state = _states.current;
    if (!state || currSubmission || !lang || !ycode) return;
    const tmp: submissionRecord = {
      time: Date.now(),
      user: user.username,
      code: ycode.toString(),
      lang: lang,
      qn_id: qn?._id ?? "-1", // in case we implement a sandbox code editor
      result: "Unknown",
    };
    state.set(SUBMISSION_STATE, tmp);
    setCurrSubmission(tmp);
    if (lastSubmissionToastId.current) {
      toast.close(lastSubmissionToastId.current);
    }
    lastSubmissionToastId.current = toast({
      title: "You have submitted a solution",
      status: "info",
      duration: 3000,
      isClosable: true,
    });

    if (!matchedRoom || matchedRoom.isMaster) {
      submitToServer(tmp);
    }
  };

  const clearCode = () => {
    ycode?.delete(0, ycode.length);
  };

  const changeLang = (newLang: language) => {
    if (newLang == lang) return;
    _states.current?.set(CURR_LANG_STATE, newLang);
    replaceCode(LangDataMap[newLang]?.default ?? "");
    lastLangSelected.current = newLang;
    setLang(newLang);
  };

  const replaceCode = (s: string) => {
    clearCode();
    ycode?.insert(0, s);
  };

  const initCode = (ycode: Y.Text) => {
    setycode(ycode);
    let undoManager = new Y.UndoManager(ycode);
    setCodeUndo(undoManager);
  };

  useEffect(() => {
    // disconnect socket on page change
    return () => {
      disconnectRoom();
    };
  }, []);

  useEffect(() => {
    const doc = new Y.Doc();
    const ychat = doc.getArray<chatRecord>(CHAT_KEY);
    _setChat(ychat);
    const ysubmissions = doc.getArray<submissionRecord>(SUBMISSION_HISTORY_KEY);
    _submissions.current = ysubmissions;
    const ystates = doc.getMap<any>(STATES_KEY);
    _states.current = ystates;

    let ycode: Y.Text | null = null;

    const stateEventObserver = (
      mapEvent: Y.YMapEvent<any>,
      t: Y.Transaction
    ) => {
      const keyschanged = mapEvent.keysChanged;
      if (keyschanged.has(SUBMISSION_STATE) && !t.local) {
        const newSubmission =
          (ystates.get(SUBMISSION_STATE) as submissionRecord) ?? null;
        setCurrSubmission(newSubmission); // if react changes are propageted in the next cycle.

        if (newSubmission && newSubmission.user !== user.username) {
          if (!matchedRoom || matchedRoom.isMaster) {
            // if a master receive it
            if (!currSubmission) {
              // if there are no current submission
              submitToServer(newSubmission);
            }
          } else if (currSubmission) {
            if (lastSubmissionToastId.current) {
              toast.close(lastSubmissionToastId.current);
            }
            lastSubmissionToastId.current = toast({
              title: "Your partner has already submitted a solution",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          } else {
            if (lastSubmissionToastId.current) {
              toast.close(lastSubmissionToastId.current);
            }
            lastSubmissionToastId.current = toast({
              title: "Your partner has submitted a solution",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }

      const newLang = ystates.get(CURR_LANG_STATE) as language;
      if (newLang && newLang != lang) {
        setLang(newLang);
        lastLangSelected.current = newLang;
      }

      setSubmissionResult(ystates.get(SUBMISSION_RESULT_STATE));

      if (mapEvent.keysChanged.has(CODE_STATE) && !t.local) {
        ycode = ystates.get(CODE_STATE) as Y.Text;

        if (!matchedRoom || matchedRoom.init) {
          // this the init user accessed this page from another account. ...
          toast({
            title:
              "Your account accessed this page from another tab/device/browser",
            description: "Please change your password if you did not do so.",
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title:
              "Your partner modifed the page from another tab/device/browser",
            status: "info",
            duration: 5000,
            isClosable: true,
          });
        }
        initCode(ycode);
      }
    };

    const initStates = () => {
      if (!ycode) return;
      initCode(ycode);
      // init lang
      const randLang =
        lastLangSelected.current ?? langList[random.uint32() % langList.length];
      setLang(randLang);
      lastLangSelected.current = randLang;
      ystates.set(CURR_LANG_STATE, randLang);
      ycode.insert(0, lastCode.current ?? LangDataMap[randLang]?.default ?? "");
      ystates.set("SYNCEVENT", user.id + random.uint32().toString());
    };

    const setCodeFromMap = () => {
      ycode = ystates.get(CODE_STATE) as Y.Text;
      initCode(ycode);

      // get lang
      const newlang = ystates.get(CURR_LANG_STATE) as language | undefined;
      if (newlang && newlang != lang) {
        setLang(newlang);
        lastLangSelected.current = newlang;
      }
    };

    const roomvalue = matchedRoom
      ? matchedRoom.room
      : Buffer.from(`${user.id}/${user.username}/${qn?._id ?? ""}`).toString(
          "base64"
        );

    const _provider = new WebrtcProvider(roomvalue, doc, {
      signaling: [wsCollabUrl],
      filterBcConns: true,
    });
    setProvider(_provider);

    _provider.awareness.setLocalStateField("user", {
      name: user.username,
      color: userColor.color,
      colorLight: userColor.light,
    });

    const waitForInit = (e: Y.YMapEvent<any>, t: Y.Transaction) => {
      // the initer have not initialized the code => wait for him to do so
      if (!ystates.has(CODE_STATE)) return;
      setCodeFromMap();
      ystates.unobserve(waitForInit); // remove this method from observer
      ystates.observe(stateEventObserver);
    };

    const observeDocLoad = (e: Y.YMapEvent<any>, t: Y.Transaction) => {
      if (t.local) return; // wait for our local change to propagaate back to us
      if (ystates.has(CODE_STATE)) {
        setCodeFromMap();
      }
      ystates.unobserve(observeDocLoad);
      ystates.observe(stateEventObserver);
    };

    if (!matchedRoom || matchedRoom.init || lastCode.current) {
      // this is for single player mode or when disconnecct
      ystates.observe(observeDocLoad);
      ycode = new Y.Text();
      ystates.set(CODE_STATE, ycode);
      initStates();
    } else {
      ystates.observe(waitForInit);
    }

    (async () => {
      if (qn) {
        console.log("fetching submissions");
        if (cachedPastSubmissions.current.length) {
          setSubmissions(
            cachedPastSubmissions.current.concat(ysubmissions.toArray())
          );
          setSubmissionLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 6000)); // simulate fetching submission history
        cachedPastSubmissions.current = [
          {
            time: Date.now(),
            user: user.username,
            code: "lorem ipsum",
            lang: "c++17",
            qn_id: "1",
            result: "TLE",
          },
        ];
        setSubmissions(
          cachedPastSubmissions.current.concat(ysubmissions.toArray())
        ); // updates submission array
        setSubmissionLoading(false);
      }
    })();

    ysubmissions.observe(() => {
      setSubmissions(
        cachedPastSubmissions.current.concat(ysubmissions.toArray())
      ); // updates submission array
    });

    ychat.observe(() => {
      setChat(ychat.toArray()); // update chat log
    });

    return () => {
      console.log("destroying provider");
      lastCode.current = ycode?.toString();
      _states.current = undefined;
      cachedPastSubmissions.current = cachedPastSubmissions.current.concat(
        ysubmissions.toArray()
      );
      _provider.destroy();
      doc.destroy();

      setProvider(undefined);
      setCodeUndo(undefined);
      setycode(undefined);
    };
  }, [matchedRoom, user, qn]);

  const memo = useMemo(() => {
    return {
      lang,
      provider,
      ycode,
      codeUndo,
      chat,
      submissions,
      qn,
      currSubmission,
      submissionLoading,
      submissionResult,
      replaceCode,
      sendToChat,
      submitCode,
      changeLang,
      clearCode,
    };
  }, [
    qn,
    matchedRoom,
    user,
    provider,
    submissions,
    lang,
    currSubmission,
    chat,
    ycode,
    submissionLoading,
    submissionResult,
  ]);

  if (matchedRoom && matchedRoom.questionId != qn?._id) {
    return <Navigate to={`/view/${matchedRoom.questionId}`} />;
  }

  return (
    <SharedEditorContext.Provider value={memo}>
      {children}
    </SharedEditorContext.Provider>
  );
};

export const useSharedEditor = () => useContext(SharedEditorContext);
