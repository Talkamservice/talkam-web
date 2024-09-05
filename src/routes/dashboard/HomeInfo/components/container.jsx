import { Link } from "react-router-dom";

function Container({ children }) {
  return (
    <div className="w-full min-h-full flex flex-col justify-between max-w-screen-2xl mx-auto px-[5vw] lg:px-24 pt-5 sm:pt-6 min-[850px]:pt-6 ">
      <div className="w-full max-w-[1080px] mx-auto pt-6 md:pt-10 xl:pt-[60px]">
        {children}
      </div>
      <div className="border-t w-full border-[#D7D7D7] mt-10 pt-8  flex justify-between items-center">
        <div className="*:text-sm *:text-[#212121] *:font-semibold flex flex-wrap justify-start items-start gap-8 gap-y-5 mb-8 sm:mb-12">
          <Link to="">Copyright</Link>
          <Link to="/help&info/terms">Terms of Use</Link>
          <Link to="/help&info/feedback">Feedback</Link>
          <Link to="/help&info/privacy-policy">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

export default Container;
