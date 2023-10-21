import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";

export const MarkdownViewer = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}>
      {markdown}
    </Markdown>
  );
};
