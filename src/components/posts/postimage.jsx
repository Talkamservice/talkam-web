import classNames from "classnames"

const bgColors = ["#05505C", "#800020", "#4B0082", "#444444"];

export const PostImage = ({ src, style, side, onClick }) => {

    const colorAtRandom = () => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
    }

    return (
        <div
            onClick={onClick}
            className={classNames(style, `w-full flex items-center justify-center ${src ? 'block' : 'hidden'} cursor-pointer
                ${side ? 'h-[150px]' : 'h-[250px] sm:h-[300px] md:h-[400px]'}
                rounded-xl overflow-hidden`)
            }
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
            />
        </div>
    )
}