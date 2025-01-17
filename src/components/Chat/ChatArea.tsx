import { useChat } from "@/context/ChatContext";
import { useEffect, useRef } from "react";
import UserPrompt from "./UserPrompt";
import { Chat } from "@/lib/types";
import Response from "./Response";

const ChatArea = () => {
  const { chatLog, loadingIndex } = useChat();

  const chatLogEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom of the chat log to show the latest message
    if (chatLogEndRef.current) {
      chatLogEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: 'end',
      })
    }
  }, [chatLog]);

  return (
    <div className="flex flex-col w-full gap-6">
      {chatLog.map((chat: Chat, id: number) => (
        <div key={id} className="flex flex-col w-full gap-6">
          <UserPrompt prompt={chat.prompt} />
          <div className="flex justify-start px-8">
            <img src="/chat_logo.svg" alt="chat loading" className={`${loadingIndex === id ? 'rotate' : ''} w-8`} />
            <p className="text-2xl pl-4">{loadingIndex === id ? "Edith is thinking..." : "Answer"}</p>
          </div>
          {(chat.response !== null) && <Response response={chat.response} timestamp={chat.timestamp} />}
        </div>
      ))}
      <div ref={chatLogEndRef} />
    </div>
  );
};

export default ChatArea;
