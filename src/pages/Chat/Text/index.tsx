import ChatArea from "@/components/Chat/ChatArea";
import InputBox from "@/components/InputBox";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { User } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Text = () => {
  const { setLogined, logined } = useAuth();
  const { isStartChat, setToken } = useChat();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sendToken = async (token: string | null) => {
      setToken(token);
    }

    if (!logined) {
      const token = searchParams.get('token');
      const email = localStorage.getItem("EDITH_EMAIL");
      if (token && email) {
        const decoded = jwtDecode<User>(token);
        if (decoded.email === email) {
          sendToken(token);
          setLogined(true);
        } else {

          navigate("/auth/login")
        }
      } else {
        navigate("/auth/login")
      }
    }
  }, [])

  return (
    <main className={`${isStartChat ? 'flex justify-center' : ' flex justify-center items-center h-full'} font-Sofia text-mainFont`}>
      <div className="flex flex-col items-center gap-10 sm:gap-20 px-4 w-full max-w-[730px] mt-[140px] mb-[120px]">
        {!isStartChat ? (
          <div className="text-3xl font-bold whitespace-nowrap">
            <span className="hidden sm:block">
              Every Day I'm Theoretically Human
            </span>
            <div className="flex items-end justify-center p-0 border-none outline-none sm:hidden focus:outline-none">
              <img
                src="/EDITH_logo_png.png"
                alt="logo"
                className="h-16"
              />
            </div>
          </div>
        ) : (
          <ChatArea />
        )}
        <InputBox />
      </div>
    </main>
  );
};

export default Text;
