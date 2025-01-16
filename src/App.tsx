import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";
// Auth
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Verification from "./pages/Auth/Verification";
import VerificationLink from "./pages/Auth/VerificationLink";
// Chat
import Text from "./pages/Chat/Text";
import History from "./pages/Chat/Text/History";
import Setting from "./pages/Chat/Text/Setting";

import Layout from "./components/Layout";
import Code from "./pages/Code";
import ProfileView from "./pages/ProfileView";
import TokenConfirmation from "./pages/Auth/TokenConfirmation";
import NotFound from "./pages/NotFound";
import { AuthGuard, TokenVerify } from "./components/Auth/RequireAuth";

const AuthRoutes = () => (
  <Route path="auth">
    <Route path="" element={<Navigate to="/auth/login" replace />} />
    <Route path="login" element={AuthGuard(<SignIn />)} />
    <Route path="register" element={AuthGuard(<SignUp />)} />
    <Route path="verify" element={AuthGuard(<Verification />)} />
    <Route path="verify-code" element={AuthGuard(<VerificationLink />)} />
  </Route>
)

const ChatRoutes = () => (
  <Route path="chat" element={(<Layout />)}>
    <Route path="" element={<Navigate to="/chat/text" replace />} />
    <Route path="text">
      <Route path="" element={<Text />} />
      <Route path="history" element={TokenVerify(<History />)} />
      <Route path="setting" element={TokenVerify(<Setting />)} />
    </Route>
    {['image', 'audio', 'video'].map(path => (
      <Route key={path} path={path} element={<Navigate to="/features/coming-soon" replace />} />
    ))}
  </Route>
)

const App = () => {
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route path="" element={<Navigate to="/auth" replace />} />
                {AuthRoutes()}
                <Route path="code" element={AuthGuard(<Code />)} />
                {ChatRoutes()}
                <Route path="user">
                  <Route path="setting" element={TokenVerify(<Layout />)}>
                    <Route path="" element={<ProfileView />} />
                  </Route>
                  <Route path="confirm" element={<TokenConfirmation />} />
                </Route>
                <Route path="*" element={(<NotFound />)} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
      <Toaster />
    </>
  );
};

export default App;
