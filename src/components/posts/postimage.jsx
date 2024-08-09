import classNames from "classnames"

const bgColors = ["#05505C", "#800020", "#4B0082", "#444444"];

export const PostImage = ({ src, style, side, onClick }) => {

    const colorAtRandom = () => {
        const randomIndex = Math.floor(Math.random() * bgColors.length);
        return bgColors[randomIndex];
    }

    return(
        <div
            onClick={onClick}
            className={classNames(style,`w-full flex items-center justify-center ${ src ? 'block' : 'hidden' } cursor-pointer
                ${ side ? 'h-[150px]' : 'min-h-[250px] sm:min-h-[300px] md:min-h-[400px]' }
                rounded-xl`)
            } 
            style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: "cover",
                objectFit: 'contain',
                objectPosition: "center",
                backgroundColor: colorAtRandom(),
                backgroundPosition: "center"
            }} 
        />
    )
}