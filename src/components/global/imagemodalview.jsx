import TalkamLogo from "../../assets/icons/logo.svg"
import { X } from "react-feather";

export const ImageModalView = ({ file, handleImageModal }) => {
    return (
        <div className="relative h-[90dvh] w-full">

            <X
                size={32}
                onClick={handleImageModal}
                className="bg-white p-2 rounded-full bg-opacity-30 cursor-pointer absolute top-0 right-0 m-5 border-2 border-[#ffffff80]"
                color="#000000"
                strokeWidth={4}
            />

            <div className="w-full h-full">
                <img
                    src={file}
                    className="w-full h-full flex items-center justify-center bg-[#000]"
                    style={{
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: "cover",
                        objectFit: 'contain',
                        objectPosition: "center",
                        backgroundPosition: "center"
                    }}
                    onError={(e) => {
                        e.target.onerror = TalkamLogo;
                        e.target.src = TalkamLogo;
                    }}
                />
            </div>
        </div>
    )
}