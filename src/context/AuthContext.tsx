import { createContext, useContext, useEffect, useState } from "react";
import { ApiResponse, AuthContextType, AuthError, RegisterProps, User } from "@/lib/types";
import axios from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [verifyCode, setVerifyCode] = useState<string | null>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("EDITH_TOKEN");
    if (logined) {
      if (token) {
        axios.defaults.headers.common['token'] = token;
      }
      fetchUserData()
    } else if (token) {
      axios.defaults.headers.common['token'] = token;
      setLogined(true);
      fetchUserData()
    }
  }, [logined]);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
      )
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
      logout();
    }
  }

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await axios.post<ApiResponse<void>>(
        `${import.meta.env.VITE_BACKEND_URL}/auth/magic-link`,
        { destination: email }
      );
      if (res.data.success) {
        return true;
      }

      throw new AuthError(res.data.message || "Login failed. Please try again.");

    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new AuthError(error.response?.data?.message || "Network error occurred");
      }

      throw new AuthError("An unexpected error occurred");

    }
  }

  const handleSocialLogin = (provider: "google" | "twitter") => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/${provider}`
  };

  const signup = async (data: RegisterProps): Promise<boolean> => {
    try {
      const res = await axios.post<ApiResponse<void>>(
        `${import.meta.env.VITE_BACKEND_URL}/auth/magic-link`,
        {
          name: data.name,
          destination: data.email
        }
      );
      if (res.data.success) {
        return true;
      } 

      throw new AuthError(res.data.message || "Registration failed. Please try again.");

    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new AuthError(error.response?.data?.message || "Network error occurred");
      }

      throw new AuthError("An unexpected error occurred");
    }
  }

  const logout = () => {
    localStorage.removeItem("EDITH_TOKEN");
    delete axios.defaults.headers.common['token'];
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
