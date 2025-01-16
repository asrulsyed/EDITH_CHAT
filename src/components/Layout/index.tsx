import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ChatProvider } from "@/context/ChatContext";

const Layout = () => {
  return (
    <ChatProvider>
      <Header />
      <Outlet />
    </ChatProvider>
  );
};

export default Layout;
