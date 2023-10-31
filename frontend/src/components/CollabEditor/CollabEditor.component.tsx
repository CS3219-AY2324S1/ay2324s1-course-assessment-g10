import { useEffect, useRef } from "react";
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
import { Flex } from "@chakra-ui/react";
import { language, useSharedEditor } from "../../contexts/sharededitor.context";

const toLangSyntax = (lang: language) => {
  switch (lang) {
    case "c++17":
      return cpp();
    case "python3":
      return python();
    case "java":
      return java();
  }
};

const CollabEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { lang, codeUndo, ycode, provider } = useSharedEditor();

  useEffect(() => {
    if (!editorRef.current || !ycode || !codeUndo || !provider || !lang)
      return () => {}; // nothing to reset

    const extensions: Extension[] = [
      basicSetup(),
      toLangSyntax(lang),
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
  }, [editorRef, lang, provider, ycode]);

  return <Flex h="100%" w="100%" ref={editorRef}></Flex>;
};

export default CollabEditor;
