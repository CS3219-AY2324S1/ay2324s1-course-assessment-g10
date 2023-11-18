import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkMath from "remark-math";

function urlTransformer(url: string) {
  if (/^data:image\/(png|jpeg);base64,/.test(url)) {
    return url;
  }

  return defaultUrlTransform(url);
}

export const MarkdownViewer = ({ markdown }: { markdown: string }) => {
  return (
    <Markdown remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]} skipHtml={false} urlTransform={urlTransformer}>
      {markdown}
    </Markdown>
  );
};
