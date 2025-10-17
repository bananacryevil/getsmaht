import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const CustomCodeBlock = (props) => {
  const code = props.block.content.map((content) => content.text).join("\n");
  const language = props.block.props.language || "javascript";

  return (
    <div style={{ position: "relative" }}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#282c34",
        }}
        codeTagProps={{
          style: {
            fontFamily: '"Fira Code", "Fira Mono", monospace',
            fontSize: "14px",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CustomCodeBlock;
