import { useSelector } from "react-redux"
import { TrashIcon, UploadGifIcon, UploadImageIcon } from "../../assets/icons/generated"
import { downVariants } from "../../helpers/cardanimation"
import { Button } from "../forms/button"
import { Input } from "../forms/input"
import { AnonToggleButton } from "../global/anonymoustoggle"
import { Avatar } from "../global/avatar"
import { motion } from "framer-motion"
import { selectCurrentUser } from "../../services/authSlice"
import { useIsAuth } from "../../hooks/useIsAuth"
import { useNavigate } from "react-router-dom"
import { ColoredLoader } from "../global/loader"
import * as Icon from 'react-feather'

export const CommentInput = ({
    anonChecked,
    setAnonChecked,
    commentBody,
    setCommentBody,
    setImagePreview,
    imagePreview,
    onChange,
    handleCommentChange,
    submitComment,
    image,
    setIsReplying,
    cancel,
    isValidComment,
    isLoading,
    imageLoading,
    error,
}) => {

    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const isAuth = useIsAuth();

    const handleSubmit = () => {
        if (!isAuth) {
            navigate("/login", { replace: true })
        } else {
            submitComment();
        }
    }

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-tr-xl rounded-tl-xl ${!anonChecked && "rounded-xl"} p-3 flex flex-col sm:flex-row items-start justify-between gap-2`}>
                <section className="w-full flex items-start gap-2">
                    <div className="flex items-start justify-start">
                        <Avatar size="sm" src={currentUser?.avatar} />
                    </div>
                    <section className="w-full flex flex-col gap-1">
                        <textarea
                            style={{
                                outline: 'none',
                                border: "none"
                            }}
                            rows={4}
                            className={`
                                ${error ? 'border border-error-100 focus:ring-error-100 focus:ring-opacity-10 focus:border focus:border-error-100' : 'focus:ring-0 focus:border-0'}
                                border border-tgray-50 placeholder:text-tgray-250
                                p-3 focus:outline-none w-full text-xs text-tblack-100 no-scrollbar
                            `}
                            placeholder="Leave a comment..."
                            value={commentBody?.comment}
                            onChange={handleCommentChange}
                        />

                        {/* Image here */}
                        {
                            imagePreview ?
                                <section className="relative rounded-lg min-h-[170px] h-[250px]">
                                    {
                                        image ?
                                            <>
                                                <img
                                                    className="border-none h-full w-full rounded-lg"
                                                    src={image ?? null}
                                                    style={{
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: "cover",
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                                <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                                                    <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full" onClick={() => {
                                                        setCommentBody({ ...commentBody, image: null })
                                                        setImagePreview(() => null)
                                                    }}>
                                                        <TrashIcon className="" style={{ paddingLeft: '2px', color: "#FF0000" }} />
                                                    </span>
                                                </span>
                                            </>
                                            :
                                            null
                                    }
                                    {
                                        imageLoading ?
                                            <div
                                                style={{
                                                    backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%),url(${imagePreview})`,
                                                    backgroundRepeat: 'no-repeat',
                                                    backgroundSize: 'cover',
                                                    objectFit: "contain",
                                                }}
                                                className="w-full h-full bg-gradient-to-b from-[#a99daa45] to-[#eee6ef1e] absolute flex items-center justify-center m-auto pointer-events-none rounded-md">
                                                <ColoredLoader />
                                            </div>
                                            : null
                                    }
                                </section>
                                :
                                null
                        }
                        <div className="flex items-center gap-3">
                            <label
                                className="cursor-pointer">
                                <Input
                                    className='hidden'
                                    type='file'
                                    name="img"
                                    id="img"
                                    accept='image/*'
                                    onChange={onChange}
                                />
                                <Icon.Image color="#2121219C" />
                            </label>
                            <UploadGifIcon />
                            <AnonToggleButton checked={anonChecked} onChange={(event) => setAnonChecked(event.target.checked)} />
                        </div>
                    </section>
                </section>

                <section className=" flex items-center gap-2 self-end">
                    {cancel ?
                        <Button
                            type="button"
                            variant="link"
                            children="Cancel"
                            className="!rounded-full !py-2 !px-3 self-end font-bold !text-error-500"
                            onClick={() => setIsReplying(() => false)}
                        />
                        :
                        null
                    }
                    <Button
                        children="Comment"
                        className="!rounded-full !py-2 !px-3"
                        onClick={handleSubmit}
                        disabled={!isValidComment || isLoading || !isAuth}
                    // isLoading={isLoading}
                    />
                </section>
            </div>
            {
                anonChecked &&
                <motion.p
                    key="chatbox"
                    variants={downVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    className="bg-[#FDD78D] text-xs font-semibold rounded-bl-xl rounded-br-xl p-2 flex items-center justify-center text-center">
                    You&apos;re posting anonymously. Your profile won&apos;t be shown.
                </motion.p>
            }
        </>
    )
}