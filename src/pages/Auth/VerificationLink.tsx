import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerificationLink = () => {
  const { setVerifyCode } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verification = async (code: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verify-code`,
        { code: code }
      );

      if (res.status === 200) {
        setVerifyCode(res.data.code);
        localStorage.setItem("EDITH_code", res.data.code);
        navigate("/chat/text");
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Error!",
        });
        navigate("/code");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Invalid Error!",
      });
      navigate("/code");
    }
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      verification(code);
    } else {
      toast({
        variant: "destructive",
        title: "Can not find any code!",
      });
      navigate("/code");
    }
  }, []);

  return <></>;
};

export default VerificationLink;
