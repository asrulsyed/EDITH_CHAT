// import { FiEdit3 } from "react-icons/fi";
const UserPrompt = ({ prompt }: { prompt: string }) => {
  
  return (
    <div className="flex items-start justify-between h-full gap-4 p-4 pl-8 rounded-lg iw-full bg-inputBg group text-mainFont">
      <span className="flex-1 text-lg text-justify break-words">{prompt}</span>
      {/* <button className="p-0 text-transparent transition-colors duration-100 ease-linear bg-transparent border-none group-hover:text-mainFont">
        <FiEdit3 size={20} />
      </button> */}
    </div>
  )
}

export default UserPrompt