import { useCallback } from "react";
import { Storage } from "../../../app/storage";
import { TrashIcon, UploadImageIcon } from "../../../assets/icons/generated";
import { Input } from "../../../components/forms/input"
import { TextArea } from "../../../components/forms/textarea";
import { PostCardVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";
import { ColoredLoader } from "../../../components/global/loader";
import TalkamLogo from "../../../assets/icons/logo.svg"

export const MediaPost = ({ image, video, imageLoading, onChange, setPost, post }) => {

    const setFormattedTitle = useCallback(
        text => {
            setPost({ ...post, title: text?.slice(0, 80) });
        },
        [post, setPost]
    );

    return (
        <motion.form
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex flex-col gap-3 bg-white">
            <TextArea
                type="text"
                rounded="rounded-[4px]"
                placeholder='A sharp title for your post works best.'
                label='Post title'
                value={post?.title}
                rows={1}
                limitPosition="top"
                limit={80}
                onChange={(event) => {
                    setFormattedTitle(event.target.value)
                    Storage.setItem("post_title", event.target.value)
                }}
                required
            />
            <section className="relative">
                <label
                    className="relative w-full overflow-hidden cursor-pointer min-h-[170px] max-h-[220px] border-dashed border-2 border-tgray-200 rounded-md flex items-center justify-center">
                    {image ? <img
                        className="border-none h-full w-full"
                        src={image ?? TalkamLogo}
                        style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                            objectFit: 'cover',
                        }}
                        onError={(e) => {
                            e.target.onerror = TalkamLogo;
                            e.target.src = TalkamLogo;
                        }}
                    /> : null}
                    {
                        video ?
                            <video controls={false} className="w-full h-full bg-black pointer-events-none">
                                <source src={video} />
                            </video>
                            :
                            null
                    }
                    <Input
                        className='hidden'
                        type='file'
                        name="img"
                        id="img"
                        accept='video/*,image/*'
                        onChange={onChange}
                    />
                    {
                        imageLoading ?
                            <div className="w-full h-full bg-gradient-to-b from-[#a99daa45] to-[#eee6ef1e] absolute flex items-center justify-center m-auto pointer-events-none">
                                <ColoredLoader />
                            </div>
                            :
                            !image && !video ?
                                <span className="w-full h-full bg-[#F8F8F8] absolute flex items-center justify-center">
                                    <UploadImageIcon className="" color="#2F6CE2B2" style={{ paddingLeft: '2px' }} />
                                </span>
                                : null
                    }
                </label>
                {image || video ?
                    <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                        <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full"
                            onClick={() => {
                                setPost({ ...post, image: null, video: null });
                                Storage.removeItem("post_image")
                                Storage.removeItem("post_image_url")
                                Storage.removeItem("post_video_url")
                            }}
                        >
                            <TrashIcon className="" style={{ paddingLeft: '2px', color: "#FF0000" }} />
                        </span>
                    </span> : null
                }
            </section>


        </motion.form>
    )
}