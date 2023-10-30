import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";

const CodeEditorWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

  return (
    <Box
      className="overlay rounded-md overflow-hidden shadow-4xl"
      w="100%"
      h="85vh"
    >
      <Editor
        height="100%"
        language={language || "javascript"}
        value={value}
        theme={theme}
        defaultValue="// some comment"
        onChange={handleEditorChange}
      />
    </Box>
  );
};

export default CodeEditorWindow;
