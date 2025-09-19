import { Link } from "react-router-dom";
import supportImg from "../../../../assets/svgs/support_icon_black.svg";
import twitter from "../../../../assets/svgs/twitter.svg";
import facebook from "../../../../assets/svgs/facebook.svg";
import instagram from "../../../../assets/svgs/instagram.svg";
import tiktok from "../../../../assets/svgs/tiktok.svg";
import whatsapp from "../../../../assets/svgs/whatsapp.svg";
import youtube from "../../../../assets/svgs/youtube.svg";
import { toast } from "sonner";

function Container({ children }) {
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy ID");
    }
  };

  // Function to check if the user is on a mobile device
  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  };

  // Event handler for the click event
  const handleClick = (event) => {
    // phone number to copy to clipboard
    const phoneNumber = "+2349121192945";
    if (!isMobileDevice()) {
      event.preventDefault();
      copyToClipboard(phoneNumber);
    }
    // On mobile devices, it will proceed to open the phone app due to the "tel:" link
  };
  return (
    <div className="w-full min-h-full flex flex-col justify-between max-w-screen-2xl mx-auto px-[5vw] lg:px-24  ">
      <div className="w-full max-w-[1080px] mx-auto pt-9 md:pt-10 ">
        {children}
      </div>
      <div className="border-t w-full border-[#D7D7D7] mt-10 pt-8 flex flex-col gap-8  xl:flex-row justify-between items-start xl:items-center pb-8 sm:pb-12">
        <div className="*:text-sm *:text-[#212121] *:font-semibold flex flex-wrap justify-start items-start gap-5 sm:gap-8 gap-y-3 ">
          <Link to="/help&info/payment-terms">Payment Terms</Link>
          <Link to="/help&info/terms">Terms of Use</Link>
          <Link to="/help&info/feedback">Feedback</Link>
          <Link to="/help&info/privacy-policy">Privacy Policy</Link>
          <Link to="/help&info/child-safety-policy">Child Safety Policy</Link>
        </div>
        <div className="flex flex-col justify-start sm:justify-between xl:justify-start w-fit items-start gap-y-5 gap-7 sm:flex-row  sm:w-full xl:w-fit ">
          <a
            href="tel:+2349121192945"
            className="flex justify-center items-center gap-2"
            onClick={handleClick}
          >
            <img
              src={supportImg}
              alt="contact us"
              className="w-[26px] xl:w-6"
            />
            <p className="text-sm text-[#212121] text-medium">
              Contact support
            </p>
          </a>
          <div className="*:*:w-[26px] xl:*:*:w-6 flex justify-between sm:justify-start gap-4 sm:gap-7 xl:gap-5 items-center w-full sm:w-fit">
            <a
              href="https://www.instagram.com/talkamtechservices?igsh=MXJhdG9hcThpbTVlaw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={instagram} alt="instagram" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61565345395891&mibextid=ZbWKwL"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={facebook} alt="facebook" />
            </a>
            <a
              href="https://youtube.com/@talkamtechservice?si=RJDCt_yP7GGtPfxT"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={youtube} alt="youtube" />
            </a>
            <a
              href="https://x.com/TalkAM_?t=mjLzdDE8RfMkF2vFHKBc4A&s=09"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={twitter} alt="X" />
            </a>
            <a
              href="https://www.tiktok.com/@talkamtechservices?_t=8pYnLh9yTAM&_r=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={tiktok} alt="tiktok" />
            </a>
            <a
              href="https://wa.me/2349162483641"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={whatsapp} alt="whatsapp" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Container;
