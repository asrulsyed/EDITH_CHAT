import Response from "@/components/Chat/Response";
import UserPrompt from "@/components/Chat/UserPrompt";
import { useChat } from "@/context/ChatContext";
import { useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const History = () => {
  const { showHistory, showChats, history, chatLog, startNewSession, deleteChats } = useChat();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const deleteSession = async (sessionId: string) => {
    await deleteChats(sessionId);
  }

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await showHistory();
      if (!sessionId) {
        setSessionId(res);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      await showChats(sessionId);
      setIsLoading(false);
    };
    fetchChats();
  }, [sessionId]);

  return (
    <main className="fixed top-[114px] left-0 right-0 bottom-0 flex font-Sofia text-mainFont">
      <div className="max-w-[260px] bg-headerBg w-full border-r-2 border-primaryBorder flex flex-col relative items-start px-5">
        <div className="text-subButtonFont text-xl py-5">Chat History</div>
        <div className="pl-3 text-left flex flex-col gap-2 h-full pb-20 overflow-y-auto">
          {history.map((session) => (
            <div
              key={session.id}
              onClick={() => setSessionId(session.id)}
              className={`${session.id === sessionId ? 'bg-inputBg border-tertiaryBorder text-mainFont' : 'border-secondaryBorder text-subButtonFont hover:bg-inputBg hover:border-tertiaryBorder hover:text-mainFont'} h-10 border-l-2 pl-2 flex items-center justify-start group rounded-lg transition-colors duration-200 relative `}
            >
              <p className="truncate w-[200px]">{session.title}</p>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-inputBg pl-2 hidden group-hover:flex items-center rounded-r-lg">
                {/* <button className="bg-inputBg p-1 border-none hover:scale-105">
                  <FiEdit3 size={20} />
                </button> */}
                <button className="bg-inputBg p-1 border-none" onClick={() => deleteSession(session.id)}>
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          className="absolute bottom-5 left-1/2 -translate-x-1/2 text-hoverFont text-nowrap bg-buttonFont hover:bg-buttonHoverBg hover:border-transparent hover:scale-105 focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            navigate("/chat/text");
            startNewSession();
          }}
        >
          Start New Chat
        </button>
      </div>
      <div className="w-full flex flex-col items-center  overflow-y-auto">
        {
          !isLoading
            ? <div className="w-full max-w-[730px] my-[30px] mb-[50px] flex flex-col gap-8">
              {chatLog.map((chat) => (
                <div key={chat.timestamp} className="flex flex-col gap-5">
                  <UserPrompt prompt={chat.prompt} />
                  {chat.response !== null && <Response response={chat.response} timestamp={chat.timestamp} />}
                </div>
              ))}
            </div>
            : <img src="/chat_logo.svg" alt="chat loading" className="rotate w-16 fixed top-60" />
        }
      </div>
    </main>
  );
};

export default History;
