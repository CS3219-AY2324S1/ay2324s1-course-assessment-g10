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
import { executionServiceClient } from "../api/server";

export type language = keyof typeof data;

export const langList = Object.keys(data) as language[];
export const LangDataMap = data;

export type chatRecord = {
  nickname: string;
  msg: string;
};

type executionResult =
  | "Accepted"
  | "TLE"
  | "MLE"
  | "WA"
  | "Compile Error"
  | "Runtime Error"
  | "Unknown";

type submissionResult = {
  evaluated: number;
  total: number;
  verdict:
    | "Accepted"
    | "TLE"
    | "MLE"
    | "WA"
    | "Compile Error"
    | "Runtime Error"
    | "Unknown";
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

interface SharedEditorInterface {
  lang?: language;
  provider?: WebrtcProvider;
  ycode?: Y.Text;
  codeUndo?: Y.UndoManager;
  chat: chatRecord[];
  submissions: submissionRecord[];
  submissionLoading?: boolean;
  qn?: Question;
  currSubmission: submissionRecord | null;

  replaceCode: (s: string) => void;
  sendToChat: (s: string) => void;
  submitCode: () => void;
  changeLang: (s: language) => void;
  clearCode: () => void;
}

export const SharedEditorContext = createContext<SharedEditorInterface>({
  chat: [],
  submissions: [],
  currSubmission: null,
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
  const { matchedRoom } = useMatchmake();
  const [lang, setLang] = useState<language>();
  const [codeUndo, setCodeUndo] = useState<Y.UndoManager>();
  const [ycode, setycode] = useState<Y.Text>();
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [submissions, setSubmissions] = useState<submissionRecord[]>([]);
  const [submissionLoading, setSubmissionLoading] = useState<boolean>(true);
  const [chat, setChat] = useState<chatRecord[]>([]);
  const [currSubmission, setCurrSubmission] = useState<submissionRecord | null>(
    null
  );

  // internal variables
  const [_chat, _setChat] = useState<Y.Array<chatRecord>>();

  // state variables that are accessed internally to track states
  const lastSubmissionToastId = useRef<ToastId | undefined>();
  const lastLangSelected = useRef<language | undefined>();
  const lastCode = useRef<string | undefined>();
  const cachedPassedSubmissions = useRef<submissionRecord[]>([]);
  const _states = useRef<Y.Map<any> | undefined>();

  const submitToServer = async (
    submission: submissionRecord,
    _ysubmissions: Y.Array<submissionRecord>,
    isLocal = false
  ) => {
    lastSubmissionToastId.current = toast({
      title: `${
        submission.user === user.id ? "You have" : "Your partner has"
      } submitted a solution`,
      status: "info",
      duration: 5000,
      isClosable: true,
    });
    if (matchedRoom && !matchedRoom.isMaster) return; // only the initer can submit to server

    if (submission.user === user.id && !isLocal) return; // host has already submitted in some other tab/window
    console.log("submitting answer to server");
    executionServiceClient.post("/api/code/submit", {
      
    });
    setTimeout(() => {
      // this line is solely to simulate a successful compiling on submission
      setCurrSubmission(null);
      _states.current?.set(SUBMISSION_STATE, null);
      submission.result = "WA";
      _ysubmissions.push([submission]);
    }, 3000);
  };

  const sendToChat = (s: string) => {
    if (!_chat) return;
    _chat.push([
      {
        msg: s,
        nickname: user.username,
      },
    ]);
    setChat(_chat.toArray());
  };

  const submitCode = () => {
    if (!_states.current || currSubmission || !lang || !ycode) return;
    const tmp: submissionRecord = {
      time: Date.now(),
      user: user.id,
      code: ycode.toString(),
      lang: lang,
      qn_id: qn?._id ?? "-1", // in case we implement a sandbox code editor
      result: "Unknown",
    };
    _states.current?.set(SUBMISSION_STATE, tmp); // idk why but this triggers the event listener for _state
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
    const doc = new Y.Doc();
    const ychat = doc.getArray<chatRecord>(CHAT_KEY);
    _setChat(ychat);
    const ysubmissions = doc.getArray<submissionRecord>(SUBMISSION_HISTORY_KEY);
    const ystates = doc.getMap<any>(STATES_KEY);
    _states.current = ystates;

    let ycode: Y.Text | null = null;

    const stateEventObserver = (
      mapEvent: Y.YMapEvent<any>,
      t: Y.Transaction
    ) => {
      const keyschanged = mapEvent.keysChanged;
      if (keyschanged.has(SUBMISSION_STATE)) {
        const newSubmission =
          (ystates.get(SUBMISSION_STATE) as submissionRecord) ?? null;
        setCurrSubmission(newSubmission); // if react changes are propageted in the next cycle.

        if (newSubmission) {
          if (!currSubmission) {
            // if there are no current submission
            submitToServer(newSubmission, ysubmissions, t.local);
          } else if (newSubmission.user != user.id && !matchedRoom?.isMaster) {
            // the master submitted a solution before the user's submission was synced
            if (lastSubmissionToastId.current) {
              toast.close(lastSubmissionToastId.current);
              lastSubmissionToastId.current = undefined;
            }
            toast({
              title: "Your partner has already submitted a solution",
              status: "warning",
              duration: 5000,
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
      signaling: ["ws://localhost:8083"],
      filterBcConns: true,
    });
    setProvider(_provider);

    _provider.awareness.setLocalStateField("user", {
      name: user.username,
      color: userColor.color,
      colorLight: userColor.light,
    });

    const initCodeIfNotExist = (e: Y.YMapEvent<any>, t: Y.Transaction) => {
      if (t.local) return;
      // all user will receive ystate change event due to us retrieveing
      if (!matchedRoom || matchedRoom.init) {
        const tmp_code = ystates.get(CODE_STATE) as Y.Text | undefined;
        if (tmp_code) {
          // this the init user accessed this page from another account. ...
          toast({
            title:
              "Your account accessed this page from another tab/device/browser",
            description: "Please change your password if you did not do so.",
            status: "warning",
            duration: 9000,
            isClosable: true,
          });
          setCodeFromMap();
        } else {
          console.log("Initalizing code...");
          ycode = new Y.Text();
          ystates.set(CODE_STATE, ycode);
          initStates();
        }
        ystates.unobserve(initCodeIfNotExist); // remove this method from observer
        ystates.observe(stateEventObserver);
      } else {
        // the initer have not initialized the code => wait for him to do so
        if (!ystates.has(CODE_STATE)) return;
        setCodeFromMap();
        ystates.unobserve(initCodeIfNotExist); // remove this method from observer
        ystates.observe(stateEventObserver);
      }
    };

    const observeDocLoad = (e: Y.YMapEvent<any>, t: Y.Transaction) => {
      if (t.local) return; // wait for our local change to propagaate back to us
      if (ystates.has(CODE_STATE)) {
        setCodeFromMap();
      }
      ystates.unobserve(observeDocLoad);
      ystates.observe(stateEventObserver);
    };

    if (matchedRoom && !lastCode.current) {
      // this is to force all users in multiplayer room to a receve ysates change event
      // we will use this to initialize the default values
      ystates.observe(initCodeIfNotExist);
      ystates.set("SYNCEVENT", user.id + random.uint32().toString());
    } else {
      // this is for single player mode or when disconnecct
      ystates.observe(observeDocLoad);
      ycode = new Y.Text();
      ystates.set(CODE_STATE, ycode);
      initStates();
    }

    (async () => {
      if (qn) {
        console.log("fetching submissions");
        if (cachedPassedSubmissions.current.length) {
          setSubmissions(
            cachedPassedSubmissions.current.concat(ysubmissions.toArray())
          );
          setSubmissionLoading(false);
          return;
        }
        await new Promise((r) => setTimeout(r, 6000)); // simulate fetching submission history
        cachedPassedSubmissions.current = [
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
          cachedPassedSubmissions.current.concat(ysubmissions.toArray())
        ); // updates submission array
        setSubmissionLoading(false);
      }
    })();

    ysubmissions.observe(() => {
      setSubmissions(
        cachedPassedSubmissions.current.concat(ysubmissions.toArray())
      ); // updates submission array
    });

    ychat.observe(() => {
      setChat(ychat.toArray()); // update chat log
    });

    return () => {
      console.log("destroying provider");
      lastCode.current = ycode?.toString();
      _states.current = undefined;
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
