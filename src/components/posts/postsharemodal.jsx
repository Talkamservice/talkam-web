import { X } from "react-feather"
import { FacebookIcon } from "../../assets/icons/generated"
import WhatsappIcon from "../../assets/icons/whatsapp.png"
import TwitterIcon from "../../assets/icons/twitter.png"
import TikTokIcon from "../../assets/icons/tiktok.png"
import InstagramIcon from "../../assets/icons/instagram.png"
import { FacebookShareButton, TwitterShareButton } from "react-share"
import { Helmet } from "react-helmet"
import { toast } from "sonner"
import { handleError } from "../../utils/handleError"
import * as Icon from 'react-feather'

export const ShareModal = ({ title, comment, image, onClose, id }) => {

    const postDetails = {
        title: "This Post if from talkAm",
        text: "This post title is much more better",
        image: "",
        url: ""
    }

    const copyTextToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(`https://web.talkam.prodevs.io/comment/${id}`);
            toast.success("Copied to Clipboard")
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
        onClose();
    }


    return (
        <main className="w-full flex items-center flex-col gap-4">
            <Helmet>
                <meta charset="utf-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="csrf_token" content="" />
                <meta property="type" content="website" />
                <meta content="image/*" property="og:image:type" data-react-helmet="true"/>
                <meta property="image" content={image} data-react-helmet="true"/>
                <meta property="og:image" content={image} data-react-helmet="true"/>
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />
                <meta property="og:image:secure_url" content={image} data-react-helmet="true"/>
                <meta property="og:locale" content="en_US" />
                <meta property="og:quote" content={comment} />
                <meta property="og:site_name" content="talkam" />
                <meta property="og:title" content={title ?? comment} />
                <meta property="og:description" content={comment ?? comment}/>

                <meta name="twitter:card" content="summary_large_image" />
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
                {/* <img onClick={handleShare} className="cursor-pointer w-7 h-7" src={WhatsappIcon} /> */}

                <FacebookShareButton
                    url={`https://web.talkam.prodevs.io/comment/${id}`}
                    quote={"CampersTribe - World is yours to explore"}
                    title={title}
                    hashtag="#talkam"
                >
                    <FacebookIcon className="cursor-pointer w-7 h-7" />
                </FacebookShareButton>

                <TwitterShareButton
                    url={`https://web.talkam.prodevs.io/comment/${id}`}
                    title={title}
                    content={comment}
                    className="w-fit"
                >
                    <img className="cursor-pointer w-7 h-7" src={TwitterIcon} />
                </TwitterShareButton>

                <p onClick={() => copyTextToClipboard()}
                    className="cursor-pointer bg-white px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight border border-tgray-50 rounded-full"
                >
                    <Icon.Link2 className='-rotate-45' size={15} color='#000000' strokeWidth={2} />
                    <p>Copy link</p>
                </p>

                {/* <img className="cursor-pointer w-7 h-7" src={TikTokIcon} /> */}
                {/* <img className="cursor-pointer w-7 h-7" src={InstagramIcon} /> */}
            </section>
        </main>
    )
}