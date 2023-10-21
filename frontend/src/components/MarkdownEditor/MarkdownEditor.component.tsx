import { useLayoutEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

import { Box, HStack } from "@chakra-ui/react";
import { MarkdownViewer } from "../MarkdownVIewer/MarkdownViewer";

export const MarkdownEditor = () => {
  const [code, setCode] = useState("");
  const [height, setHeight] = useState(0);

  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const h = (ref.current?.offsetHeight ?? 400) - 40;
    setHeight(h); // this is super scuffed cos 100% doesnt work
  }, []);

  return (
    <HStack spacing="2" width="100%" height="100%">
      <Box width="60%" height="100%" padding="20px" overflowY="auto" ref={ref}>
        <CodeMirror
          value={code}
          height={`${height}px`}
          extensions={[
            markdown({
              base: markdownLanguage,
              codeLanguages: languages,
            }),
          ]}
          onChange={(value) => setCode(value)}
        />
      </Box>
      <Box
        width="40%"
        height="100%"
        padding="20px"
        overflowY="auto"
        boxShadow="xl"
      >
        <MarkdownViewer markdown={code} />
      </Box>
    </HStack>
  );
};
