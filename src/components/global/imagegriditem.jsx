import { useState } from "react";
import { Modal } from "./modal";
import { ImageModalView } from "./imagemodalview";
import classNames from "classnames";
import Broken from "../../assets/images/broken.png"

const bgColors = ["#05505C", "#800020", "#4B0082", "#444444"];
const colorAtRandom = () => {
    const randomIndex = Math.floor(Math.random() * bgColors.length);
    return bgColors[randomIndex];
}

export const ImageGridItem = ({ src, type, style }) => {

    const [showImage, setShowImage] = useState(false);

    const handleModal = () => {
        setShowImage((prev) => !prev)
    };

    const ImageView =

        <img
            onClick={handleModal}
            src={src}
            className="w-full h-full"
            loading="lazy"
            style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: "100% 100%",
                objectFit: 'cover',
                objectPosition: "center",
                backgroundColor: colorAtRandom(),
                backgroundPosition: "center"
            }}
            onError={(e) => {
                e.target.onerror = Broken;
                e.target.src = Broken;
            }}
        />


    const VideoView =
        <video controls className="w-full h-full bg-black">
            <source src={src} />
        </video>

    const fileMap = {
        "Image": ImageView,
        "Video": VideoView
    }

    return (
        <div
            className={classNames(style, `w-full flex items-center justify-center ${src ? 'block' : 'hidden'} cursor-pointer h-[120px] sm:h-[220px] overflow-hidden`)}
        >
            {fileMap[type]}

            <Modal
                show={showImage}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleModal}
                position='center'
                contentWidth='w-full'
            >
                <ImageModalView
                    file={src}
                    handleImageModal={handleModal}
                />
            </Modal>
        </div>
    )
}