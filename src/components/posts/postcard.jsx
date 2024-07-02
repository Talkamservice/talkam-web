import { Avatar } from "../global/avatar"
import { PostComment } from "./postcomment"
import { PostImage } from "./postimage"
import { PostTags } from "./posttags"
import { PostCommentCount } from "./postcommentcount"
import { PostActionButton } from "./postactionbutton"
import { PostShareButton } from "./postsharebutton"
import { motion } from "framer-motion"
import { PostCardVariants } from "../../helpers/cardanimation"
import { useRef } from "react"
import { useTruncatedElement } from "../../hooks/useTruncated"
import { Button } from "../forms/button"
import { useNavigate } from "react-router-dom"
import * as Icon from 'react-feather'

export const PostCard = ({ comment, tags, image, category, time, author, commentcount, likes, side, id }) => {

    const navigate = useNavigate();
    const commentRef = useRef(null);
    const { isTruncated, isReadingMore, toggleIsShowingMore } = useTruncatedElement(commentRef);

    return (
        <motion.div
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="w-full flex flex-col gap-2 border border-tgray-xlight p-3 rounded-lg cursor-pointer"
            onClick={() => navigate(`/comment/${id}`)}
        >
            <header className="flex items-center justify-between gap-3">
                <section className="flex items-center gap-3">
                    <Avatar size="sm" src={""} />
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-tblack-100">{category}</span>
                            <span className="text-sm font-medium text-tprimary-50">{time}</span>
                        </div>
                        <span className="text-xs font-medium text-[#858585]">Posted by {author}</span>
                    </div>
                </section>

                <section className="cursor-pointer">
                    <Icon.MoreVertical color="#212121" />
                </section>
            </header>

            <main className="w-full flex flex-col gap-2">
                <section className="flex flex-col w-full gap-3">
                    <article>
                        <PostComment
                            side={side}
                            ref={commentRef}
                            comment={comment}
                            isReadingMore={isReadingMore}
                        />
                        {isTruncated && (
                            <Button
                                variant="link"
                                className="!text-tprimary-50 !font-medium !text-sm "
                                onClick={toggleIsShowingMore}
                                children={isReadingMore ? 'Read less...' : 'Read more...'}
                            />
                        )}
                    </article>
                    <PostImage side={side} src={image} />
                    <section className="flex items-center justify-start gap-2 flex-wrap">
                    {tags?.map((tag) => ( <PostTags side={side} key={tag} tag={tag} /> ))}
                    </section>
                </section>
                <footer className={` ${ side ? 'hidden' : 'flex' } flex item-center justify-between flex-wrap gap-2 border-t border-tgray-50 py-2`}>
                    <div className="flex items-center flex-wrap gap-2">
                        <PostCommentCount count={commentcount} />
                        <PostActionButton count={likes} />
                    </div>
                    <PostShareButton />
                </footer>
            </main>
        </motion.div>
    )
}