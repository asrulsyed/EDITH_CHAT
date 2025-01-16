import { useNavigate } from "react-router-dom";

const Video = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center w-screen h-screen text-black bg-white font-Sofia">
      <div className="max-w-screen-lg px-10 -translate-y-1/4 ">
        <button
          className="flex items-end p-0 mx-auto mb-8 border-none outline-none focus:outline-none"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.png"
            alt="logo"
            className="h-10"
          />
        </button>
        <p className="font-bold text-5xl sm:text-[64px] lg:text-[80px] text-center mb-8">
          COMING SOON!
        </p>
        <p className="text-xl sm:text-[28px] text-center leading-loose">
          EDITH is a groundbreaking Web3-based AI ecosystem that combines
          blockchain technology, decentralized collaboration, and intelligent
          automation to create the future of Artificial Intelligence.
        </p>
      </div>
      <div className="fixed flex items-center justify-center w-full gap-8 bottom-16 sm:gap-16">
        <a
          className="hover:cursor-pointer hover:scale-105"
          href="https://t.me/edithx_ai"
        >
          <img src="/telegram.png" className="w-10 h-10 sm:w-16 sm:h-16" />
        </a>
        <a
          className="hover:cursor-pointer hover:scale-105"
          href="https://discord.gg/ss4p3nyBKP"
        >
          <img src="/discord.png" className="w-10 h-10 sm:w-16 sm:h-16" />
        </a>
        <a
          className="hover:cursor-pointer hover:scale-105"
          href="https://x.com/edithAPP"
        >
          <img src="/twitter-dark.png" className="w-10 h-10 sm:w-16 sm:h-16" />
        </a>
        <a
          className="hover:cursor-pointer hover:scale-105"
          href="https://edithx.ai/"
        >
          <img src="/website.png" className="w-10 h-10 sm:w-16 sm:h-16" />
        </a>
      </div>
    </div>
  );
};

export default Video;
