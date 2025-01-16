import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const TokenConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => { 
    const token = searchParams.get('token');
    console.log(token);
    if (token) {
      localStorage.setItem('EDITH_token', token);
      navigate('/code');
    }
  }, [navigate, searchParams]);

  return <></>;
};

export default TokenConfirmation;
