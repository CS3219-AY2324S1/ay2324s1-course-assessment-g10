import { useEffect, useRef, useState } from "react";
import { useMatchmake } from "../../contexts/matchmake.context";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import * as Y from "yjs";
import { yCollab } from "y-codemirror.next";
import { WebrtcProvider } from "y-webrtc";
import {
  EditorState,
  EditorView,
  Extension,
  ViewUpdate,
  basicSetup,
} from "@uiw/react-codemirror";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";

const userColor = { color: "#30bced", light: "#30bced33" };

const toLangSyntax = (lang: "C++" | "Python3" | "Java") => {
  switch (lang) {
    case "C++":
      return cpp();
    case "Python3":
      return python();
    case "Java":
      return java();
  }
};

type editorprop = {
  language: "C++" | "Python3" | "Java";
  defaultValue?: string;
  onChange?: (s: string) => void;
};

const CollabEditor = (prop: editorprop) => {
  const { language, defaultValue = "", onChange = (s: string) => {} } = prop;
  const user = useSelector(selectUser);
  const { matchedRoom } = useMatchmake();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    let ydoc: Y.Doc;
    let provider: WebrtcProvider;

    const extensions: Extension[] = [
      basicSetup(),
      toLangSyntax(language),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          onChange(v.state.doc.toString());
        }
      }),
    ];

    if (matchedRoom) {
      ydoc = new Y.Doc();
      const ytext = ydoc.getText("peerconnectcc");
      ytext.insert(0, defaultValue);
      const undoManager = new Y.UndoManager(ytext);
      provider = new WebrtcProvider(matchedRoom.host, ydoc);

      provider.awareness.setLocalStateField("user", {
        name: matchedRoom.partner,
        color: userColor.color,
        colorLight: userColor.light,
      });

      extensions.push(yCollab(ytext, provider.awareness, { undoManager }));
    }

    const view = new EditorView({
      state: EditorState.create({
        doc: defaultValue,
        extensions: extensions,
      }),
    });

    editorRef.current.appendChild(view.dom);

    return () => {
      console.log("destoroyed!");
      if (provider) {
        provider.destroy();
      }
      if (ydoc) {
        ydoc.destroy();
      }

      if (editorRef.current) {
        editorRef.current.removeChild(view.dom);
      }
    };
  }, [editorRef, user, matchedRoom]);

  return <div ref={editorRef}></div>;
};

export default CollabEditor;
