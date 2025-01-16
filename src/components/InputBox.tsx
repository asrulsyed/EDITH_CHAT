import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChat } from "@/context/ChatContext";
import { toast } from "@/hooks/use-toast";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowRight, FaChevronDown, FaSpinner } from "react-icons/fa6";

const TEXTAREA_MIN_HEIGHT = "36px";
const TEXTAREA_MAX_HEIGHT = "100px";

const InputBox = () => {
  const {
    isStartChat,
    sendMessage,
  } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messageOver, setMessageOver] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [textareaWidth, setTextareaWidth] = useState<number>(0);

  // Adjust text input area 's height
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = TEXTAREA_MIN_HEIGHT;
      textarea.style.height = `${Math.min(
        textarea.scrollHeight,
        parseInt(TEXTAREA_MAX_HEIGHT)
      )}px`;
    }
  };

  // Initialize text area's width on mount
  useEffect(() => {
    setTextareaWidth(textareaRef.current?.clientWidth || 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setInputPrompt(newPrompt);
    adjustTextareaHeight();

    // Observe if text is over a line
    const textWidth = newPrompt.length * 8;
    setMessageOver(textWidth > textareaWidth * 0.8);
  };

  const keyDownHandler = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClickSend = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = TEXTAREA_MIN_HEIGHT;
    }
    e.preventDefault();
    handleSendMessage();
  }

  const handleSendMessage = async () => {
    if (inputPrompt === "") {
      toast({
        variant: "destructive",
        title: 'Enter a message to send',
      });
      return;
    }
    
    setIsStreaming(true);
    try {
      await sendMessage(inputPrompt);
    } finally {
      setIsStreaming(false);
      setInputPrompt("");
      setMessageOver(false);
    }
};

  return (
    <div
      className={`${isStartChat ? "fixed bottom-5 max-w-[730px] left-1/2 -translate-x-1/2" : ""
        } flex flex-nowrap sm:flex-wrap justify-between items-center gap-4 bg-inputBg p-[21px] border-secondaryBorder border rounded-[40px] w-full`}
    >
      <div
        className={`${messageOver ? "order-0 basis-full" : "order-1"
          } flex-grow`}
      >
        <textarea
          ref={textareaRef}
          className={`${isStreaming ? '' : "text-mainFont"} bg-transparent pt-2 border-none w-full h-[36px] font-semibold text-base placeholder:text-subButtonFont overflow-y-hidden outline-none resize-none`}
          placeholder="Message EDITH..."
          onKeyDown={keyDownHandler}
          value={inputPrompt}
          onChange={(e) => handleChange(e)}
          translate="no"
          disabled={isStreaming}
          style={{
            minHeight: TEXTAREA_MIN_HEIGHT,
            maxHeight: TEXTAREA_MAX_HEIGHT,
          }}
        />
      </div>
      <div className={`${messageOver ? "order-1" : "order-0"}`}>
        <DropdownMenu onOpenChange={setIsOpen}>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-buttonBg p-0 border border-secondaryBorder hover:border-tertiaryBorder focus:border-secondaryBorder focus:outline-none rounded-full w-[62px] min-w-[62px] h-9">
            <img src="/Edith_Logo.png" alt="chat logo" className="rounded-full w-8 h-8" />
            <FaChevronDown
              className={`${isOpen ? "rotate-180" : ""
                } transition-all duration-300 text-mainFont w-3 h-3`}
            />
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent align="start"></DropdownMenuContent> */}
        </DropdownMenu>
      </div>
      <div className="order-2">
        <button
          className="flex items-center justify-center p-2 rounded-full border-secondaryBorder bg-buttonBg hover:border-tertiaryBorder focus:outline-none w-9 h-9 text-mainFont"
          onClick={(e) => handleClickSend(e)}
        >
          {isStreaming ? (
            <FaSpinner className="w-auto h-full animate-spin" />
          ) : (
            <FaArrowRight className="w-auto h-full" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputBox;
