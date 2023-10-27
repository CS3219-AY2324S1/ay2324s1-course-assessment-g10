import { useEffect } from "react";
import { useMatchmake } from "../../contexts/matchmake.context";
import { Navigate, useNavigate } from "react-router-dom";

import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import { Buffer } from "buffer";
import CodeMirror from "@uiw/react-codemirror";

const userColor = { color: "#30bced", light: "#30bced33" };

interface CollabEditorProps {
  isCollab?: boolean;
  defaultValue?: string;
}

const CollabEditor = (props: CollabEditorProps) => {
  const extensions = [];
  const { matchedRoom } = useMatchmake();
  if (!props.isCollab) {
    if (!matchedRoom) return <Navigate to="/" />;

    const room = Buffer.from(matchedRoom.host).toString("base64");

    const ydoc = new Y.Doc();
    const provider = new WebrtcProvider(room, ydoc);
    const ytext = ydoc.getText();

    const undoManager = new Y.UndoManager(ytext);

    provider.awareness.setLocalStateField("user", {
      name: "Anonymous " + Math.floor(Math.random() * 100),
      color: userColor.color,
      colorLight: userColor.light,
    });

    extensions.push(yCollab(ytext, provider.awareness, { undoManager }));
  }

  return (
    <CodeMirror
      value={props.defaultValue ?? ""}
      basicSetup={true}
      extensions={extensions}
      width="100%"
      height="70vh"
    ></CodeMirror>
  );
};

export default CollabEditor;
