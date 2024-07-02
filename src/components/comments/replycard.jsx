import { TrashIcon, UploadGifIcon, UploadImageIcon } from "../../assets/icons/generated"
import { downVariants } from "../../helpers/cardanimation"
import { Button } from "../forms/button"
import { Input } from "../forms/input"
import { AnonToggleButton } from "../global/anonymoustoggle"
import { Avatar } from "../global/avatar"
import { motion } from "framer-motion"
import * as Icon from 'react-feather'

export const ReplyCard = ({ anonChecked, setAnonChecked, comment, setComment, onChange, image }) => {

    return (
        <>
            <div className={`w-full border border-tgray-50 rounded-tr-xl rounded-tl-xl ${ !anonChecked && "rounded-xl" } p-3 flex items-start justify-between gap-4`}>
                <div className="flex items-start justify-start">
                    <Avatar size="sm" />
                </div>
                <section className="flex flex-col gap-1 w-full">
                    <textarea
                        style={{
                            outline: 'none',
                            border: "none"
                        }}
                        rows={2}
                        className="text-base w-full no-scrollbar"
                        placeholder="Leave a comment..."
                    />
                    {/* Image here */}
                    { image ? 
                        <section className="relative rounded-lg min-h-[170px] h-[250px]">
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
                                    <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full" onClick={() => setComment({...comment, image: null })}>
                                        <TrashIcon className=""  style={{paddingLeft: '2px', color:"#FF0000"}} />
                                    </span>
                                </span>
                        </section>
                        : null
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
                <Button 
                    children="Comment"
                    className="!rounded-full !py-2 !px-3 self-end"
                />
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