import { motion } from 'framer-motion';
import { PostCardVariants } from '../../helpers/cardanimation';
import { getFileExtension } from '../../helpers/getFileExtension';
import { ColoredLoader } from '../global/loader';
import { Modal } from '../global/modal';
import { useState } from 'react';
import { allowedDocumentExtensions, allowedImageExtensions } from '../../helpers/extensions';
import { UserCardImage } from './usercardimage';
import { ImageModalView } from '../global/imgemodalview';
import moment from 'moment';

export const SenderCard = ({ file, text, time, isLoading, messageType }) => {

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

    const MediaView = <li className="flex justify-start">
        <div className="w-3/5">
            <div className="relative min-w-1/3 p-2 bg-tprimary-50 rounded-r-xl rounded-bl-xl">
                {
                    isLoading ?
                        <ColoredLoader />
                        :
                        <div className='w-full flex flex-col'>
                            <UserCardImage
                                src={file}
                                onClick={handleImageModal}
                            />
                            <span className="p-3 flex items-end justify-end text-[8px] text-twhite-100 leading-[0px]">{moment(time).format("LT")}</span>
                        </div>
                }
            </div>
        </div>
    </li>

    const typeMap = {
        "Text": TextView,
        "Media": MediaView,
        "File": "File"
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