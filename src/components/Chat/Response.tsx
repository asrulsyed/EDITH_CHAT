import { FiCopy } from "react-icons/fi";
import React from "react";
import { CodeBlock } from "react-code-block";
import Markdown from "markdown-to-jsx";
import moment from 'moment'

interface MessagePart {
  type: "text" | "code";
  content: string;
  language?: string;
  startIndex: number;
}

const Response = ({ response, timestamp }: { response: string, timestamp: string | null }) => {
  const splitResponse = (content: string): MessagePart[] => {
    let isInCodeBlock: boolean = false;
    let currentPart: MessagePart = {
      type: "text",
      content: "",
      startIndex: 0,
    };
    let lineNumber: number = 0;
    const parts: MessagePart[] = [];

    content.split("\n").forEach((line: string) => {
      // Seperate each line of the response
      if (line.trim().startsWith("```")) {
        // If the line starts with "```", then it's a code block
        if (!isInCodeBlock) {
          // Beginning of a code block
          isInCodeBlock = true;
          parts.push(currentPart);
          const language = line.slice(3).trim().toLowerCase(); // Get the language
          currentPart = {
            type: "code",
            content: "",
            language: language || "Text",
            startIndex: lineNumber,
          };
        } else {
          // End of a code block
          isInCodeBlock = false;
          parts.push(currentPart);
          currentPart = {
            type: "text",
            content: "",
            startIndex: lineNumber + 1,
          };
        }
      } else {
        currentPart.content += line + "\n";
      }
      lineNumber++;
    });

    parts.push(currentPart);
    return parts.filter((part) => part.content.trim());
  };

  return (
    <div className="flex flex-col gap-4 text-mainFont">
      <div className="overflow-x-auto text-justify break-words whitespace-pre-wrap px-8">
        {splitResponse(response).map((part, index) => (
          <React.Fragment key={index}>
            {part.type === "text" && (
              <Markdown className="break-words">{part.content}</Markdown>
            )}
            {part.type === "code" && (
              <div className="relative">
                <button
                  onClick={() => navigator.clipboard.writeText(part.content)}
                  className="absolute p-2 transition-transform duration-200 bg-transparent border-none rounded-lg top-4 right-4 hover:text-white hover:outline-none hover:border-none hover:scale-125 focus:outline-none hover:bg-gray-900"
                >
                  <FiCopy size={20} />
                </button>
                <CodeBlock
                  code={part.content}
                  language={part.language || "Text"}
                >
                  <CodeBlock.Code className="flex flex-col p-10 my-6 overflow-x-hidden transition-all duration-200 ease-in bg-gray-900 shadow-lg hover:overflow-x-auto scroll-smooth rounded-xl">
                    <CodeBlock.LineContent>
                      <CodeBlock.Token />
                    </CodeBlock.LineContent>
                  </CodeBlock.Code>
                </CodeBlock>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="border-t border-secondaryBorder"></div>
      <div className="flex items-center justify-between px-8">
        <span>{moment(timestamp).format("YYYY/MM/DD HH:MM:SS")}</span>
        <button
          className="p-0 transition-colors duration-100 ease-linear bg-transparent border-none text-mainFont focus:outline-none hover:scale-105"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(response);
          }}
        >
          <FiCopy size={20} />
        </button>
      </div>
    </div>
  );
};

export default Response;
