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
            className={classNames(style,`w-full ${ src ? 'block' : 'hidden' } cursor-pointer
                ${ side ? 'h-[100px]' : 'min-h-[150px] sm:min-h-[250px] md:min-h-[300px]' }
                rounded-lg`)} 
            style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: "cover",
                objectFit: 'contain',
                backgroundColor: colorAtRandom()
            }} 
        />
    )
}