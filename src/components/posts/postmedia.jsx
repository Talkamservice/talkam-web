import classNames from "classnames"
import Broken from "../../assets/images/broken.png"

const bgColors = ["#05505C", "#800020", "#4B0082", "#444444"];

export const PostMedia = ({ src, style, side, onClick, type }) => {

    const colorAtRandom = () => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
    }

    const ImageView =
        <img
            onClick={onClick}
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

    const typeMap = {
        "Image": ImageView,
        "Video": VideoView,
        "File": ImageView,
        "Text": ImageView
    }

    return (
        <div
            className={classNames(style, `w-full flex items-center justify-center ${src ? 'block' : 'hidden'} cursor-pointer
                ${side ? 'h-[250px]' : 'h-[250px] sm:h-[300px] md:h-[400px]'}
                rounded-xl overflow-hidden`)
            }
        >
            {typeMap[type]}
        </div>
    )
}