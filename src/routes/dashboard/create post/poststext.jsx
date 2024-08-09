import { useCallback } from "react";
import { Input } from "../../../components/forms/input"
import { TextArea } from "../../../components/forms/textarea"
import { PostCardVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";
import { Storage } from "../../../app/storage";

export const PostsText = ({ post, setPost }) => {

    let limit = 350

    const setFormattedContent = useCallback(
        text => {
        setPost({...post, comment: text?.slice(0, limit)});
        },
        [limit, post, setPost]
    );
    const setFormattedTitle = useCallback(
        text => {
        setPost({...post, title: text?.slice(0, 80)});
        },
        [post, setPost]
    );
     
    return(
        <motion.form
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex flex-col gap-3">
            <TextArea
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'A sharp title for your post works best.'
                label = 'Post title'
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

            <TextArea 
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'Write the rest of your text here. (optional)'
                value={post?.comment}
                limit = {limit}
                rows={8}
                onChange={(event) => {
                    setFormattedContent(event.target.value)
                    Storage.setItem("post_comment", event.target.value)
                }}
            />
        </motion.form>
    )
}