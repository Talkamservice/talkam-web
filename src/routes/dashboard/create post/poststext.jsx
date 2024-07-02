import { useCallback } from "react";
import { Input } from "../../../components/forms/input"
import { TextArea } from "../../../components/forms/textarea"
import { PostCardVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";

export const PostsText = ({ post, setPost }) => {

    let limit = 280

    const setFormattedContent = useCallback(
        text => {
        setPost({...post, comment: text?.slice(0, limit)});
        },
        [limit, post, setPost]
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
            <Input
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'A sharp title for your post works best.'
                label = 'Post title'
                value={post?.title}
                onChange={(event) => setPost({...post, title: event.target.value})}
                required
            />

            <TextArea 
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'Write the rest of your text here. (optional)'
                value={post?.comment}
                limit = {limit}
                rows={8}
                onChange={(event) => setFormattedContent(event.target.value)}
            />
        </motion.form>
    )
}