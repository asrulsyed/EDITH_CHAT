import { Chat, ChatContextType, Session } from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isStartChat, setIsStartChat] = useState<boolean>(false);
  const [chatLog, setChatLog] = useState<Chat[]>([]);
  const [history, setHistory] = useState<Session[]>([]);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const sendMessage = async (prompt: string) => {
    setIsStartChat(true);

    // Add new message to chat log immediately
    setChatLog((prevChatLog: Chat[]) => [
      ...prevChatLog,
      {
        prompt: prompt,
        response: null,
        sessionId: null,
        timestamp: new Date().toISOString()
      }
    ]);

    const currentIndex = chatLog.length;
    setLoadingIndex(currentIndex);

    try {
      const requestBody = sessionId
        ? { prompt, sessionId }
        : { prompt }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat`,
        requestBody
      );

      // Handle different response statuses
      if (res.status === 200) {
        setChatLog((prevChatLog) => {
          const updatedLog = [...prevChatLog];
          updatedLog[updatedLog.length - 1] = {
            ...updatedLog[updatedLog.length - 1],
            prompt: prompt,
            response: res.data?.response,
            sessionId: res.data?.sessionId,
            timestamp: new Date().toISOString()
          };
          return updatedLog;
        });
        setSessionId(res.data?.sessionId);
        return res; // Return full response object
      } else {
        // Handle non-200 status codes
        if (res.status === 429) {
          toast({
            variant: "destructive",
            title: "You have reached the maximum number of requests. Please try again later.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error generating response",
          });
        }
        return res;
      }
    } catch (err: any) {
      console.error("Error fetching response from EDITH", err);
      const errorMessage = err.response?.status === 429
        ? "Too many requests. Please wait a moment before trying again."
        : "Error generating response";

      toast({
        variant: "destructive",
        title: "Error fetching response from EDITH",
        description: `${err}`,
      });

      setChatLog((prevChatLog) => {
        const updatedLog = [...prevChatLog];
        updatedLog[updatedLog.length - 1] = {
          ...updatedLog[updatedLog.length - 1],
          prompt: prompt,
          response: errorMessage,
          sessionId: null,
          timestamp: new Date().toISOString()
        };
        return updatedLog;
      });
      return err.response;
    } finally {
      setLoadingIndex(null);
    }
  };

  const showHistory = async () => {
    if (token) {
      axios.defaults.headers.common['token'] = token;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/sessions`
      )
      const reversedData = [...res.data].reverse();
      setHistory(reversedData.map((session: any) => ({
        id: session.id,
        title: extractTitleFromMd(session.title)
      })));
      setSessionId(reversedData[0].id);
      return reversedData[0].id;
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  const extractTitleFromMd = (markdown: string) => {
    const cleanText = markdown
      .replace(/^#+\s+/, '')  // Remove heading symbols
      .replace(/\*\*/g, '');  // Remove asterisks
    return cleanText.trim() || 'Untitled Chat';
  }

  const showChats = async (sessionId: string | null) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/session/${sessionId}`
      )
      setSessionId(sessionId);
      setChatLog(res.data.chats);
    } catch (err) {
      console.error(err);
    }
  }

  const deleteChats = async (sessionId: string) => {
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/chat`, { data: { sessionId: sessionId } });
    setHistory((prevHistory) => {
      const newHistory = prevHistory.filter((session) => session.id !== sessionId)
      if (newHistory.length > 0) {
        setSessionId(newHistory[0].id);
      } else {
        setSessionId(null);
      }
      return newHistory;
    });
  }

  const startNewSession = () => {
    setSessionId(null);
    setChatLog([]);
    setIsStartChat(false);
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['token'] = token;
    }
  }, [token])

  return (
    <ChatContext.Provider
      value={{
        isStartChat,
        chatLog,
        history,
        loadingIndex,
        sendMessage,
        showHistory,
        showChats,
        deleteChats,
        startNewSession,
        setToken
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
