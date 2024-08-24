import { ColoredLoader } from "../global/loader"

export const ImagePreviewLoader = ({ src }) => {
    return (
        <div
            className={`relative w-full flex items-center justify-center pointer-events-none
                ${'h-[150px] md:h-[200px]'} overflow-hidden`
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
                    backgroundColor: "#444444",
                    backgroundPosition: "center"
                }}
            />
            <span className="absolute inset-0 bg-tblack-100 bg-opacity-50 backdrop-blur-sm flex items-center justify-center m-auto">
                <ColoredLoader />
            </span>
        </div>
    )
}