import { X, Download } from "react-feather";
import { toast } from "sonner";
import TalkamLogo from "../../assets/icons/logo.svg"

export const ImageModalView = ({ file, handleImageModal }) => {

    const handleDownload = async () => {
        try {
            // Fetch the image as a blob, using `no-cors` mode to handle potential CORS issues
            const response = await fetch(file, { mode: 'no-cors' });
            const blob = await response.blob();

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'talkam-image.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            toast.error("Failed to download image");
        }
    };


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

            <div className="absolute bottom-0 bg-black backdrop-blur-sm bg-opacity-50 w-full flex items-center justify-end py-4 px-12 cursor-pointer">
                <div onClick={handleDownload} className="flex items-center gap-2">
                    <p className="text-sm text-white">Download Image</p>
                    <Download size={28} color="#FFFFFF" />
                </div>
            </div>
        </div>
    )
}