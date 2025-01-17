import ChatArea from "@/components/Chat/ChatArea";
import InputBox from "@/components/InputBox";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Text = () => {
  const { logined, setLogined } = useAuth();
  const { isStartChat, setToken } = useChat();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const validateTokenAndRedirect = async (token: string | null, email: string | null) => {
      if (!token || !email) {
        navigate("/auth/login");
        return;
      }

      try {
        const decoded = jwtDecode<{ destination: string }>(token);

        if (decoded.destination === email) {
          setToken(token);
          setLogined(true);
          navigate("/chat/text");
        } else {
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        navigate("/auth/login");
      }
    }

    if (!logined) {
      const token = searchParams.get('token');
      if (token) {
        localStorage.setItem("EDITH_TOKEN", token);
      }
      const email = localStorage.getItem("EDITH_EMAIL");
      validateTokenAndRedirect(token, email);
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
