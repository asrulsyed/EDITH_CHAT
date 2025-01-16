import { useState } from "react";
import { FiLogOut, FiSettings } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose, IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MenuItems } from "@/stack";
import { useAuth } from "@/context/AuthContext";

type MenuItem = {
  id: string;
  label: string;
  checked: boolean;
};

const MobileDropDownMenu = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MenuItems);
  const handleSetting = () => {
    navigate("/user/setting");
  }

  const handleLogout = () => {
    logout();
  }

  const handleItemClick = (itemId: string) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        checked: item.id === itemId,
      }))
    );
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger className="w-10 h-10 p-2 transition-all duration-300 border-transparent rounded-full outline-none bg-buttonBg hover:border-transparent hover:bg-buttonHoverBg text-mainFont focus:outline-none hover:text-hoverFont">
        {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="bg-inputBg mt-[14px] w-[200px] border-secondaryBorder font-Sofia"
        align="end"
      >
        <div className="block sm:hidden">
          {menuItems.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex items-center justify-between h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont"
              onClick={() => {
                handleItemClick(item.id);
                navigate(`/chat/${item.id}`);
              }}
            >
              {item.label}
              <FaCheck
                className={`${item.checked ? "visible" : "invisible"} w-4 h-4`}
              />
            </DropdownMenuItem>
          ))}
        </div>
        <DropdownMenuSeparator className="block sm:hidden bg-[#FFFFFF]/10" />
        <DropdownMenuSub>
          <DropdownMenuItem className="h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont hover:">
            Quests
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont hover:">
            AI Agents
          </DropdownMenuItem>
          <DropdownMenuItem className="h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont hover:">
            Docs
          </DropdownMenuItem>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="bg-[#FFFFFF]/10" />
        <DropdownMenuItem
          className="flex items-center justify-between h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont hover:"
          onClick={handleSetting}
        >
          Setting
          <FiSettings className="!w-5 !h-5" />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center justify-between h-10 py-0 text-base transition-all duration-300 hover:bg-buttonBg text-mainFont hover:"
          onClick={handleLogout}
        >
          Log Out
          <FiLogOut className="!w-5 !h-5" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileDropDownMenu;
