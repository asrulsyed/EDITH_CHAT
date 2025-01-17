import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginProps, RegisterProps, User } from "@/lib/types";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();

  const [verifyCode, setVerifyCode] = useState<string | null>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/profile`
          
        )
        console.log("aaa", res);
        setUser(res.data)
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
    // const verifyToken = async () => {
    //   try {
    //     const res = await axios.post(
    //       `${import.meta.env.VITE_BACKEND_URL}/auth/verify-token`
    //     );

    //     if (res.status === 200) {
    //       setLogined(true);
    //     }

    //   } catch (err) {

    //   }
    // }
  }, [logined]);

  const login = async (data: LoginProps) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/magic-link`,
        {
          destination: data.email,
        }
      );
      if (res.data.success === true) {
        localStorage.setItem("EDITH_EMAIL", data.email);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Please register your account before log in"
        });
      }
      return res.data.success
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error:",
        description: (error as Error).message,
      });
      throw error;
    }
  }

  const handleSocialLogin = (provider: "google" | "twitter") => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`
  };

  const signup = async (data: RegisterProps) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/magic-link`,
        {
          name: data.name,
          destination: data.email
        }
      );
      if (res.data.success === true) {
        localStorage.removeItem("EDITH_EMAIL");
        localStorage.setItem("EDITH_EMAIL", data.email);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: "Please try again"
        })
      }
      return res.data.success
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Registration error:",
        description: (error as Error).message,
      })
      throw error;
    }
  }

  const getUser = async (token: string) => {
    const decoded = jwtDecode<User>(token);
    setUser(decoded);
  }

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setLogined(false);
  }

  return (
    <AuthContext.Provider
      value={{
        verifyCode,
        logined,
        setVerifyCode,
        setLogined,
        login,
        signup,
        handleSocialLogin,
        user,
        setUser,
        getUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
