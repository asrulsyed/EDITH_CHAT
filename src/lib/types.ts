export interface User {
  name: string;
  avatar: string;
  email?: string;
  inviteCode?: string;
}

export interface LoginProps {
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export interface RegisterProps {
  name: string;
  email: string;
}

export interface InviteProps {
  code: string;
}

export interface AuthContextType {
  verifyCode: string | null;
  logined: boolean;
  setVerifyCode: (code: string | null) => void;
  setLogined: (logined: boolean) => void;
  login: (email: string) => Promise<boolean>;
  signup: (data: RegisterProps) => Promise<any>;
  handleSocialLogin: (provider: 'google' | 'twitter') => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
} 

export interface ChatContextType {
  isStartChat: boolean;
  chatLog: Chat[];
  history: Session[];
  loadingIndex: number | null;
  sendMessage: (prompt: string) => Promise<any>;
  showHistory: () => Promise<any>;
  showChats: (sessionId: string | null) => void;
  deleteChats: (sessionId: string) => void;
  startNewSession: () => void;
  setToken: (token: string | null) => void;
}

export interface Chat {
  prompt: string;
  response: string | null;
  sessionId: string | null;
  timestamp: string | null;
}

export interface Session {
  id: string;
  title: string;
}