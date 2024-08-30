import classNames from "classnames"
import Broken from "../../assets/images/broken.png"

const bgColors = ["#05505C", "#800020", "#4B0082", "#444444"];

export const UserCardImage = ({ src, style, onClick, user }) => {

    const colorAtRandom = () => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
    }

    const radiusMap = {
        "sender": "rounded-tl-lg",
        "receiver": "rounded-tr-lg",
    }

    return (
        <div
            onClick={onClick}
            className={classNames(style, `w-full h-full flex items-center justify-center cursor-pointer overflow-hidden ${radiusMap[user]}`)}
        >
            <img
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
        </div>
    )
}