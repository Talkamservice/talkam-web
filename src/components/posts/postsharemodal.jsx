import { X } from "react-feather"
import { FacebookIcon } from "../../assets/icons/generated"
import WhatsappIcon from "../../assets/icons/whatsapp.png"
import TwitterIcon from "../../assets/icons/twitter.png"
import TikTokIcon from "../../assets/icons/tiktok.png"
import InstagramIcon from "../../assets/icons/instagram.png"
import { TwitterShareButton } from "react-share"
import { Helmet } from "react-helmet"

export const ShareModal = ({ title, comment, image, onClose, id }) => {

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
            <Helmet>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="csrf_token" content="" />
                <meta property="type" content="website" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                <meta property="image" content={image} data-react-helmet="true"/>
                <meta property="og:image" content={image} data-react-helmet="true"/>
                <meta property="og:image:secure_url" content={image} data-react-helmet="true"/>
                <meta property="og:locale" content="en_US" />
                <meta content="image/*" property="og:image:type" data-react-helmet="true"/>
                <meta property="og:site_name" content="talkam" />
                <meta name="twitter:card" content={image} />
                <meta name="twitter:url" content={`https://web.talkam.prodevs.io/comment/${id}`} />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={comment}/>
                <meta name="twitter:image" content={`${image}?4362984378`} />
            </Helmet>
            <header className="w-full flex items-center justify-between border-b border-tgray-50 p-6">
                <h2  className="font-bold text-base">Share this post to:</h2>
                <X className="cursor-pointer" onClick={onClose} strokeWidth={3} />
            </header>
            <section className="flex items-center gap-8 p-6">
                <img onClick={handleShare} className="cursor-pointer w-7 h-7" src={WhatsappIcon} />
                <FacebookIcon className="cursor-pointer w-7 h-7" />
                <TwitterShareButton
                    url={`https://web.talkam.prodevs.io/comment/${id}`}
                    title={title}
                    content={comment}
                >
                    <img className="cursor-pointer w-7 h-7" src={TwitterIcon} />
                </TwitterShareButton>
                <img className="cursor-pointer w-7 h-7" src={TikTokIcon} />
                <img className="cursor-pointer w-7 h-7" src={InstagramIcon} />
            </section>
        </main>
    )
}