import { motion } from 'framer-motion';
import { PostCardVariants } from '../../helpers/cardanimation';
import { ColoredLoader } from '../global/loader';
import { Modal } from '../global/modal';
import { useState } from 'react';
import { UserCardImage } from './usercardimage';
import { ImageModalView } from '../global/imagemodalview';
import { ImagePreviewLoader } from './previewloader';
import moment from 'moment';
import * as Icon from 'react-feather'

export const SenderCard = ({ preview, file, text, time, isLoading, messageType }) => {

    const [showImageModal, setShowImageModal] = useState(false);

    const handleImageModal = () => {
        setShowImageModal(prev => !prev)
    }

    const TextView = <li className="flex justify-start">
        <div className="max-w-md">
            <div className="relative min-w-[100px] p-2 bg-tprimary-50 rounded-r-xl rounded-bl-xl">
                <span className="flex items-end justify-end flex-col space-x-8 p-1 text-sm text-wrap text-twhite-100">
                    {text}
                    <span className="pt-2 flex items-start justify-start text-[8px] text-doc-powder leading-[0px]">{moment(time).format("LT")}</span>
                </span>

            </div>
        </div>
    </li>

    const MediaView =
        <li className="flex justify-start">
            <div className="w-4/5 sm:w-3/5">
                <div className="flex min-w-1/3 h-[200px] md:h-[280px] bg-tprimary-50 rounded-r-xl rounded-bl-xl overflow-hidden p-1">
                    {
                        isLoading ?
                            <ImagePreviewLoader src={preview} />
                            :
                            <div className='w-full flex flex-col gap-2'>
                                <UserCardImage
                                    user="receiver"
                                    src={file}
                                    onClick={handleImageModal}
                                />
                                <span className="p-1 flex items-end justify-end text-[8px] text-twhite-100 leading-[0px]">{moment(time).format("LT")}</span>
                            </div>
                    }
                </div>
            </div>
        </li>;

    const FileView = <li className="flex justify-start">
        <div className="w-fit">
            <div className="relative p-2 bg-tprimary-50 rounded-r-xl rounded-bl-xl">
                {
                    isLoading ?
                        <ColoredLoader />
                        :
                        <span className="min-w-[100px] flex items-start justify-start flex-col text-sm truncate">
                            <a
                                href={file}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="flex items-center justify-between gap-2 w-full px-4 py-3 bg-tgray-150 bg-opacity-20 rounded text-xs cursor-pointer truncate">
                                <Icon.FileText size={20} color="#fff" >
                                    {file}
                                </Icon.FileText>
                                <span className="no-underline text-[13px] text-twhite-100 italic">View file</span>
                            </a>
                        </span>
                }
                <span className="p-2 flex items-end justify-end text-[8px] leading-[0px] text-twhite-100">{moment(time).format("LT")}</span>
            </div>
        </div>
    </li>

    const typeMap = {
        "Text": TextView,
        "media": MediaView,
        "file": FileView
    };

    return (
        <motion.section variants={PostCardVariants}>
            {typeMap[messageType]}
            <Modal
                show={showImageModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleImageModal}
                position='center'
                contentWidth='w-full'
            >
                <ImageModalView
                    file={file}
                    handleImageModal={handleImageModal}
                />
            </Modal>
        </motion.section>
    )
}