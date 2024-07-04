import { useState } from "react"
import { Button } from "../forms/button"
import { Avatar } from "../global/avatar"
import { CommentInput } from "./commentinput"
import { motion } from "framer-motion"
import { randomId } from "../../helpers/randomid"
import * as Icon from "react-feather"

export const NestedCommentCard = ({ parentComment, allComments, setAllComments }) => {

    const [ isReplying, setIsReplying ] = useState();
    const [ anonChecked, setAnonChecked ] = useState(false);
    const [ comment, setComment ] = useState({
        id: randomId(),
        image: "",
        comment: "",
    });

    const handleAddNewComment = (event) => {
        setComment({...comment, comment: event.target.value });
    }
    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setComment({...comment, image: URL.createObjectURL(files[0])})
    };

    const submitComment = () => {
        setAllComments((prev) => [ comment, ...prev ]);
        setComment({
            id: randomId(),
            image: "",
            comment: "",
        });
        setIsReplying(() => false )
    }
    console.log(parentComment, allComments)

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-xl p-2 flex flex-col items-start justify-between gap-4`}>
                <section className="w-full flex gap-3">
                    <div className="flex items-start justify-start">
                        <Avatar size="sm" />
                    </div>
                    <section className="w-full flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold">daphne322</span>
                            <span className="p-0.5 rounded-full border border-[#F96C40]" />
                            <span className="text-xs text-tprimary-50 font-bold">5hrs</span>
                        </div>

                        <p className="text-sm font-normal text-wrap break-words whitespace-normal pr-2 w-full">
                            {parentComment.comment}
                        </p>
                        <section className="">
                            { parentComment.image ? 
                                <section className="relative rounded-lg min-h-[170px] h-[250px]">
                                    <img
                                        className="border-none h-full w-full rounded-lg"
                                        src={parentComment.image ?? null}
                                        style={{
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: "cover",
                                            objectFit: 'cover',
                                        }}
                                    />
                                </section>
                                : null
                            }
                        </section>

                        <section className="w-full flex items-center gap-12 pt-2">
                            <Button
                                variant="link"
                                children="Reply"
                                className="text-[#444444] !text-sm font-boldNunito"
                                onClick={() => setIsReplying(true)}
                            />
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span className="font-boldNunito text-sm text-[#444444]">18</span>
                                <Icon.ThumbsUp size={20} />
                            </div>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <span className="font-boldNunito text-sm text-[#444444]">18</span>
                                <Icon.ThumbsDown size={20} />
                            </div>
                        </section>
                    </section>
                </section>
                {    isReplying ?
                    <motion.section className="w-full">
                        <CommentInput
                            anonChecked={anonChecked}
                            setAnonChecked={setAnonChecked}
                            comment={comment}
                            setComment={setComment}
                            image={comment.image}
                            onChange={handleFileUpload}
                            handleCommentChange={handleAddNewComment}
                            submitComment={submitComment}
                            setIsReplying={setIsReplying}
                            cancel
                        />
                    </motion.section>
                    :
                    null
                }
            </div>
        </>
    )
}