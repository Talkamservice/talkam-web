import classNames from "classnames"

export const PostImage = ({ src, style, side }) => {
    return(
        <div className={classNames(style,`w-full ${ src ? 'block' : 'hidden' } ${ side ? 'h-[100px]' : 'min-h-[150px] sm:min-h-[250px] md:min-h-[300px]' } rounded-lg`)} 
            style={{
                backgroundImage: `url(${src})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: "cover",
                objectFit: 'contain'
            }} 
        />
    )
}