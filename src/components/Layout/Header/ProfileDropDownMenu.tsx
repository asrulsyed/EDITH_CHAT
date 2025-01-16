import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileDropDownMenu = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSetting = () => {
    navigate("/user/setting");
  }

  const handleLogout = () => {
    logout();
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
          {
            headers: {
              "ngrok-skip-browser-warning": "1"
            }
          }
        )
        console.log("aaa", res);
        setName(res.data.name)
        setEmail(res.data.email)
      } catch (err) {
        console.error(err);
      }
    }
    fetchProfile();
  }, [isOpen]);

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="p-0 transition-all duration-200 ease-in border-none rounded-full hover:scale-105 focus:outline-none">
        <div className="h-[46px] w-[46px] rounded-full bg-gradient-to-br from-[#7D2DFF] to-[#41DDFF] flex items-center justify-center"></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-[#000000] mt-[14px] w-[300px] border-[#FFFFFF]/10 border p-5 rounded-lg text-[#E2E2E2] text-base font-semibold font-Sofia"
        align="end"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
        <div className="h-[46px] w-[46px] rounded-full bg-gradient-to-br from-[#7D2DFF] to-[#41DDFF] flex items-center justify-center"></div>
          <div className="ml-2.5 flex-1">
            <p className="text-base font-semibold">{name}</p>
            <p className="text-base font-normal text-[#FFFFFF]/80">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#FFFFFF]/10 my-4" />
        <DropdownMenuItem className="text-base" onClick={handleSetting}>
          <FiSettings className="!w-5 !h-5" />
          Setting
        </DropdownMenuItem>
        <DropdownMenuItem className="text-base" onClick={handleLogout}>
          <FiLogOut className="!w-5 !h-5" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDownMenu;
