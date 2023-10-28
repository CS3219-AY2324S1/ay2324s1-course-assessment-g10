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
import { IndexeddbPersistence } from "y-indexeddb";
import { Question } from "../models/Question.model";
import { useSelector } from "react-redux";
import { User, selectUser } from "../reducers/authSlice";
import { useMatchmake } from "./matchmake.context";
import { useLoaderData } from "react-router-dom";
import { Buffer } from "buffer";

type chatRecord = {
  nickname: string;
  msg: string;
};

type language = "C++17" | "Python3" | "Java";
type executionResult = "Correct" | "TLE" | "MLE" | "WA" | "Unknown";

type submissionRecord = {
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
  provider?: WebrtcProvider | IndexeddbPersistence;
  code: string;
  ycode?: Y.Text;
  codeUndo?: Y.UndoManager;
  chat: chatRecord[];
  submissions: submissionRecord[];
  qn?: Question;
  currSubmission: submissionRecord | null;

  setCode: (s: string) => void;
  sendToChat: (s: string) => void;
  submitCode: (s: string) => void;
  changeLang: (s: language) => void;
  clearCode: () => void;
}

export const SharedEditorContext = createContext<SharedEditorInterface>({
  lang: "C++17",
  code: "",
  chat: [],
  submissions: [],
  currSubmission: null,

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
  const [lang, setLang] = useState<language>("C++17");
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

  const sendToChat = (s: string) => {
    if (!_chat) return;
    _chat.push([
      {
        msg: s,
        nickname: user.username,
      },
    ]);
  };

  const submitCode = (s: string) => {
    if (!_states || currSubmission) return;
    const tmp: submissionRecord = {
      user: user.username,
      code: s,
      lang: lang,
      qn_id: qn?._id ?? "-1", // in case we implement a sandbox code editor
      result: "Unknown",
    };
    _states.set(SUBMISSION_KEY, tmp);
    setCurrSubmission(tmp);
  };

  const clearCode = () => {
    ycode?.delete(0, ycode.length);
  };

  const changeLang = (newLang: language) => {
    if (newLang == lang) return;
    clearCode();
    setLang(newLang);
  };

  useEffect(() => {
    const doc = new Y.Doc();
    const ychat = doc.getArray<chatRecord>(CHAT_KEY);
    const ysubmissions = doc.getArray<submissionRecord>(SUBMISSION_HISTORY_KEY);
    const ystates = doc.getMap<string>(STATES_KEY);

    const ycode = doc.getText(CODE_KEY);
    setycode(ycode);
    const undoManager = new Y.UndoManager(ycode);
    setCodeUndo(undoManager);

    const roomvalue = matchedRoom
      ? matchedRoom.host
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

    async () => {
      if (!qn) {
        await new Promise((r) => setTimeout(() => r, 2000)); // simulate fetching submission history
        pastSubmissions = [
          {
            user: user.username,
            code: "lorem ipsum",
            lang: "C++17",
            qn_id: "1",
            result: "WA",
          },
        ];
      }
    };

    ysubmissions.observe(() => {
      setSubmissions(pastSubmissions.concat(ysubmissions.toArray())); // updates submission array
    });

    ychat.observe(() => {
      setChat(ychat.toArray()); // update chat log
    });

    ystates.observe((mapEvent) => {
      const statesChanged = mapEvent.keysChanged;
      if (statesChanged.has(SUBMISSION_KEY)) {
        setCurrSubmission(null); // if exist, means some code is being eval.
      }
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
      setCode,
      sendToChat,
      submitCode,
      changeLang,
      clearCode,
    };
  }, [qn, matchedRoom, user]); // ctx only changes when: qn changes, user changes, collab state changes.

  return (
    <SharedEditorContext.Provider value={memo}>
      {children}
    </SharedEditorContext.Provider>
  );
};

export const useSharedEditor = () => useContext(SharedEditorContext);
