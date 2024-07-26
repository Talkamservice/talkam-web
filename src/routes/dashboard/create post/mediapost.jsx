import { Storage } from "../../../app/storage";
import { TrashIcon, UploadImageIcon } from "../../../assets/icons/generated";
import { Input } from "../../../components/forms/input"
import { PostCardVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";

export const MediaPost = ({ image, setImagePreview,  onChange, setPost, post }) => {
     
    return(
        <motion.form
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex flex-col gap-3 bg-white">
            <Input
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'A sharp title for your post works best.'
                label = 'Post title'
                value={post?.title}
                onChange={(event) => {
                    setPost({...post, title: event.target.value}); 
                    Storage.setItem("post_title", event.target.value)
                }}
                required
            />
            <section className="relative">
                <label
                    className="relative w-full overflow-hidden cursor-pointer min-h-[170px] max-h-[220px] border-dashed border-2 border-tgray-200 rounded-md flex items-center justify-center">
                    <img
                        className="border-none h-full w-full"
                        src={image ?? null}
                        style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                            objectFit: 'cover',
                        }}
                    />
                    <Input
                        className='hidden'
                        type='file'
                        name="img"
                        id="img"
                        accept='image/*'
                        onChange={onChange}
                    />
                    {
                        !image ?
                        <span className="w-full h-full bg-[#F8F8F8] absolute flex items-center justify-center">
                            <UploadImageIcon className="" color="#2F6CE2B2" style={{paddingLeft: '2px'}} />
                        </span>
                        : null
                    }
                </label>
                { image ? 
                    <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                        <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full" 
                            onClick={() => {
                                setImagePreview(null);
                                setPost({...post, image: null});
                                Storage.removeItem("post_image")
                                Storage.removeItem("post_image_url")
                            }}
                        >
                            <TrashIcon className=""  style={{paddingLeft: '2px', color:"#FF0000"}} />
                        </span>
                    </span> : null
                }
            </section>

            
        </motion.form>
    )
}