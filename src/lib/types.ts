export interface User {
  id: string;
  destination: string;
  name: string;
  avatar: string;
}

export interface LoginProps {
  email: string;
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
  login: (data: LoginProps) => Promise<any>;
  signup: (data: RegisterProps) => Promise<any>;
  handleSocialLogin: (provider: 'google' | 'twitter') => void;
  user: User | null;
  getUser: (token: string) => Promise<any>;
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