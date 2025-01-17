import { useState, useRef } from "react";
import { MdCheck, MdOutlineContentCopy } from "react-icons/md";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProfileView = () => {
  const { user, setUser } = useAuth();

  
  const [copyStatus, setCopyStatus] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>(user?.avatar || "");
  const [name, setName] = useState<string>(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const handleCopyClick = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const handleClickUpdate = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/profile`,
        {
          name,
          avatar,
        }
      )
      setUser({ ...user, name, avatar });
      toast({
        variant: "default",
        title: "Update Success",
      })
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Update Failed",
      })
    }
  }

  const handleClickCancel = () => {
    navigate(-1);
  }

  // useEffect(() => {
  //   const fetchInviteCode = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/auth/profile`
          
  //       )
  //       setReferralCode(res.data.inviteCode)
  //       setName(res.data.name)
  //       setAvatar(res.data.avatar);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   }
  //   fetchInviteCode();
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#000000] font-Sofia text-[#E2E2E2]">
      <div className="bg-[#FFFFFF05] border border-[#FFFFFF]/20 rounded-lg px-[72px] py-10 max-w-[900px] font-Sofia text-[#E2E2E2] text-base flex flex-col gap-7 items-stretch">
        <h1 className="text-2xl font-medium text-left font-Sofia text-[#FFFFFF] ml-1">Profile</h1>
        <div className="flex items-center justify-between">
          {
            user?.avatar
              ? <img src={user.avatar} alt="Profile" className="h-[90px] w-[90px] rounded-full object-cover" />
              : <div className="h-[90px] w-[90px] rounded-full bg-gradient-to-br from-[#7D2DFF] to-[#41DDFF] flex items-center justify-center"></div>
          }
          <div className="flex-1 ml-7">
            <p className="mb-3 text-2xl font-semibold text-left">{user?.name}</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={handleAvatarClick}
              className="bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 rounded-sm w-[98px] h-[28px] flex items-center justify-center text-[#FFFFFF] focus:outline-none text-nowrap hover:scale-105 hover:border-[#FAFAFA]/15 transition-transform duration-100 ease-linear"
            >
              Add Avatar
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col items-start gap-5">
            <p className="text-[18px]">User Name</p>
            <input
              className="bg-[#000000] border border-[#FFFFFF]/20 rounded-lg font-semibold placeholder:text-[#E2E2E2] w-full py-3 px-[18px]"
              placeholder={`${user?.name}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-[18px]">Invite Code</p>
            <div className="relative w-full">
              <input
                type="text"
                className="bg-[#000000] border border-[#FFFFFF]/20 rounded-lg font-semibold placeholder:text-[#E2E2E2] w-full py-3 px-[18px]"
                value={user?.inviteCode}
                disabled
              />
              <CopyToClipboard text={user?.inviteCode || ""} onCopy={handleCopyClick}>
                <button
                  className="absolute right-[1px] h-[calc(100%-2px)] -translate-y-1/2 bg-[#000000] top-1/2 focus:outline-none px-3 border-none group"
                  onClick={handleCopyClick}
                >
                  {copyStatus ? <MdCheck className="w-5 h-auto" /> : <MdOutlineContentCopy className="w-5 h-auto transition-all duration-300 ease-out group-hover:scale-110" />}
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col items-start gap-5">
          <p className="text-[18px]">Solana Wallet Address</p>
          <div className="flex justify-between w-full gap-4">
            <input className="bg-[#000000] border border-[#FFFFFF]/20 rounded-lg font-semibold placeholder:text-[#E2E2E2] w-full py-3 px-[18px]" placeholder="" type="text" />
            <button
              className="bg-[#FAFAFA]/10 border border-[#FAFAFA]/15 rounded-sm h-full focus:outline-none px-5 hover:scale-105 hover:border-[#FAFAFA]/15 transition-transform duration-100 ease-linear"
              onClick={handleCopyClick}
            >
              Confirm
            </button>
          </div>
        </div> */}
        <div className="flex justify-end gap-5 mt-7">
          <button
            onClick={handleClickCancel}
            className="w-[140px] h-12 flex items-center justify-center bg-[#000000] border border-[#FAFAFA]/80 focus:outline-none text-xl font-medium text-[#FAFAFA]/80 hover:scale-105 hover:border-[#FAFAFA]/80 transition-transform duration-300 ease-linear"
          >
            Cancel
          </button>
          <button
            onClick={handleClickUpdate}
            className="w-[140px] h-12 flex items-center justify-center bg-[#FAFAFA]/80 border border-transparent focus:outline-none text-xl font-medium text-[#000000] hover:scale-105 hover:border-transparent transition-transform duration-300 ease-linear"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileView;