import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import * as random from "lib0/random";
import { Question } from "../models/Question.model";
import { useSelector } from "react-redux";
import { User, selectUser } from "../reducers/authSlice";
import { useMatchmake } from "./matchmake.context";
import { useLoaderData } from "react-router-dom";
import { Buffer } from "buffer";
import data from "../data/lang_temps.json";

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

const SUBMISSION_KEY = "code_being_eval";
const CHAT_KEY = "peerprepchat";
const CODE_KEY = "peerprepcode";
const SUBMISSION_HISTORY_KEY = "peerprepsubmissions";
const STATES_KEY = "peerprepstates";

interface SharedEditorInterface {
  lang: language;
  provider?: WebrtcProvider;
  code: string;
  ycode?: Y.Text;
  codeUndo?: Y.UndoManager;
  chat: chatRecord[];
  submissions: submissionRecord[];
  qn?: Question;
  currSubmission: submissionRecord | null;

  replaceCode: (s: string) => void;
  setCode: (s: string) => void;
  sendToChat: (s: string) => void;
  submitCode: () => void;
  changeLang: (s: language) => void;
  clearCode: () => void;
}

export const SharedEditorContext = createContext<SharedEditorInterface>({
  lang: "c++17",
  code: "",
  chat: [],
  submissions: [],
  currSubmission: null,

  replaceCode: () => {},
  setCode: () => {},
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
  const qn = useLoaderData() as Question | undefined;
  const user = useSelector(selectUser) as User; // null check should be done before this

  // exposed variables
  const { matchedRoom } = useMatchmake();
  const [lang, setLang] = useState<language>("c++17");
  const [codeUndo, setCodeUndo] = useState<Y.UndoManager>();
  const [ycode, setycode] = useState<Y.Text>();
  const [code, setCode] = useState("");
  const [provider, setProvider] = useState<WebrtcProvider>();
  const [submissions, setSubmissions] = useState<submissionRecord[]>([]);
  const [chat, setChat] = useState<chatRecord[]>([]);
  const [currSubmission, setCurrSubmission] = useState<submissionRecord | null>(
    null
  );

  // internal variables
  const [_states, _setStates] = useState<Y.Map<submissionRecord>>();
  const [_chat, _setChat] = useState<Y.Array<chatRecord>>();

  const [_ysubmissions, _setysubmissions] =
    useState<Y.Array<submissionRecord>>(); // this line is solely to simulate a successful compiling on submission

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
    if (!_states || currSubmission) return;
    const tmp: submissionRecord = {
      time: Date.now(),
      user: user.username,
      code: code,
      lang: lang,
      qn_id: qn?._id ?? "-1", // in case we implement a sandbox code editor
      result: "Unknown",
    };
    _states.set(SUBMISSION_KEY, tmp);
    setCurrSubmission(tmp);

    setTimeout(() => {
      // this line is solely to simulate a successful compiling on submission
      setCurrSubmission(null);
      _states.delete(SUBMISSION_KEY);
      tmp.result = "WA";
      _ysubmissions?.push([tmp]);
    }, 3000);
  };

  const clearCode = () => {
    ycode?.delete(0, ycode.length);
  };

  const changeLang = (newLang: language) => {
    if (newLang == lang) return;
    replaceCode(LangDataMap[newLang]?.default ?? "");
    setLang(newLang);
  };

  const replaceCode = (s: string) => {
    clearCode();
    ycode?.insert(0, s);
  };

  useEffect(() => {
    const doc = new Y.Doc();
    const ychat = doc.getArray<chatRecord>(CHAT_KEY);
    _setChat(ychat);
    const ysubmissions = doc.getArray<submissionRecord>(SUBMISSION_HISTORY_KEY);
    _setysubmissions(ysubmissions);
    const ystates = doc.getMap<submissionRecord>(STATES_KEY);
    _setStates(ystates);

    const ycode = doc.getText(CODE_KEY);
    setycode(ycode);
    const undoManager = new Y.UndoManager(ycode);
    setCodeUndo(undoManager);

    const roomvalue = matchedRoom
      ? matchedRoom.room
      : Buffer.from(`${user.id}/${user.username}/${qn?.id ?? ""}`).toString(
          "base64"
        );
    const provider = new WebrtcProvider(roomvalue, doc, {
      signaling: ["ws://localhost:8083"],
    });
    setProvider(provider);

    provider.awareness.setLocalStateField("user", {
      name: user.username,
      color: userColor.color,
      colorLight: userColor.light,
    });

    let pastSubmissions: submissionRecord[];

    (async () => {
      if (qn) {
        console.log("fetching submissions");
        await new Promise((r) => setTimeout(r, 1000)); // simulate fetching submission history
        console.log("fetch complete");
        pastSubmissions = [
          {
            time: Date.now(),
            user: user.username,
            code: "lorem ipsum",
            lang: "c++17",
            qn_id: "1",
            result: "TLE",
          },
        ];
        setSubmissions(pastSubmissions.concat(ysubmissions.toArray())); // updates submission array
      }
    })();

    ysubmissions.observe(() => {
      setSubmissions(pastSubmissions.concat(ysubmissions.toArray())); // updates submission array
    });

    ychat.observe(() => {
      setChat(ychat.toArray()); // update chat log
    });

    ystates.observe((mapEvent) => {
      setCurrSubmission(ystates.get(SUBMISSION_KEY) ?? null); // if exist, means some code is being eval.
    });

    return () => {
      provider.destroy();
      doc.destroy();

      setProvider(undefined);
      setCodeUndo(undefined);
      setycode(undefined);
    };
  }, []);

  const memo = useMemo(() => {
    console.log("updating sharededitor memo");
    return {
      lang,
      provider,
      ycode,
      code,
      codeUndo,
      chat,
      submissions,
      qn,
      currSubmission,
      replaceCode,
      setCode,
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
  ]);

  return (
    <SharedEditorContext.Provider value={memo}>
      {children}
    </SharedEditorContext.Provider>
  );
};

export const useSharedEditor = () => useContext(SharedEditorContext);
