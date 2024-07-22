import { X } from "react-feather"
import { FacebookIcon } from "../../assets/icons/generated"
import WhatsappIcon from "../../assets/icons/whatsapp.png"
import TwitterIcon from "../../assets/icons/twitter.png"
import TikTokIcon from "../../assets/icons/tiktok.png"
import InstagramIcon from "../../assets/icons/instagram.png"

export const ShareModal = ({ title, comment, image, onClose }) => {

    console.log(window.location.href);

    const postDetails = {
        title: "This Post if from talkAm",
        text: "This post title is much more better",
        image: "",
        url: ""
    }

    const handleShare = async () => {
        console.log("Whatsapp Clicked")
        if(navigator.share){
            try {
                await navigator
                  .share({title: "This was shared successfully!!!"})
                  .then(() =>
                    console.log("Hooray! Your content was shared to tha world")
                  );
              } catch (error) {
                console.log(`Oops! I couldn't share to the world because: ${error}`);
              }
            } else {
              // fallback code
              console.log(
                "Web share is currently not supported on this browser. Please provide a callback"
              );
        }
    }


    return (
        <main className="w-full flex items-center flex-col gap-4">
            <header className="w-full flex items-center justify-between border-b border-tgray-50 p-6">
                <h2  className="font-bold text-base">Share this post to:</h2>
                <X className="cursor-pointer" onClick={onClose} strokeWidth={3} />
            </header>
            <section className="flex items-center gap-8 p-6">
                <img onClick={handleShare} className="cursor-pointer w-7 h-7" src={WhatsappIcon} />
                <FacebookIcon className="cursor-pointer w-7 h-7" />
                <a
                    href={`https://twitter.com/intent/tweet?text=${comment}&title=${title}&file=${image}&&url=${window.location.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img className="cursor-pointer w-7 h-7" src={TwitterIcon} />
                </a>
                <img className="cursor-pointer w-7 h-7" src={TikTokIcon} />
                <img className="cursor-pointer w-7 h-7" src={InstagramIcon} />
            </section>
        </main>
    )
}