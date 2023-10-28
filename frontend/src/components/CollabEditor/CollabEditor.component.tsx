import { useEffect, useRef } from "react";
import { useMatchmake } from "../../contexts/matchmake.context";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { yCollab } from "y-codemirror.next";
import {
  EditorState,
  EditorView,
  Extension,
  ViewUpdate,
  basicSetup,
} from "@uiw/react-codemirror";
import { useSelector } from "react-redux";
import { selectUser } from "../../reducers/authSlice";
import { Flex, Heading } from "@chakra-ui/react";
import { language, useSharedEditor } from "../../contexts/sharededitor.context";

const toLangSyntax = (lang: language) => {
  switch (lang) {
    case "C++17":
      return cpp();
    case "Python3":
      return python();
    case "Java":
      return java();
  }
};

const CollabEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { setCode, lang, codeUndo, ycode, provider } = useSharedEditor();

  useEffect(() => {
    if (!editorRef.current || !ycode || !codeUndo || !provider) return () => {}; // nothing to reset

    const extensions: Extension[] = [
      basicSetup(),
      toLangSyntax(lang),
      EditorView.updateListener.of((v: ViewUpdate) => {
        if (v.docChanged) {
          setCode(v.state.doc.toString());
        }
      }),
      yCollab(ycode, provider?.awareness, { undoManager: codeUndo }),
    ];

    const view = new EditorView({
      state: EditorState.create({
        doc: ycode.toString(),
        extensions: extensions,
      }),
    });

    editorRef.current.appendChild(view.dom);
    view.dom.style.flex = "1";
    view.dom.style.width = "100%";

    return () => {
      if (editorRef.current) {
        editorRef.current.removeChild(view.dom);
      }
    };
  }, [editorRef, lang, provider]);

  return <Flex h="100%" w="100%" ref={editorRef}></Flex>;
};

export default CollabEditor;
