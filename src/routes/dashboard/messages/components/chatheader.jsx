import { useNavigate } from 'react-router-dom'
import { Avatar } from '../../../../components/global/avatar';
import { SingleUserIcon, TrashIcon } from '../../../../assets/icons/generated';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PostCardVariants } from '../../../../helpers/cardanimation';
import { useOnOutsideClick } from '../../../../hooks/useOnOutsideClick';
import { Modal } from '../../../../components/global/modal';
import { BlockPromptModal } from '../../../../components/global/blockpromptmodal';
import { DeleteChatPromptModal } from './deletechatpromptmodal';
import { useMediaQuery } from '../../../../hooks/useMediaQuery';
import { ColoredLoader } from '../../../../components/global/loader';
import * as Icon from 'react-feather'

export const ChatHeader = ({ messageController, currentChat, setCurrentChat, currentUser, details }) => {

    const isMobile = useMediaQuery("(max-width: 1024px)");
    const receiver = details?.members?.find(member => member.id !== currentUser.id);
    const popUpRef = useRef();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPopUp, setShowPopUp] = useState(false);

    useOnOutsideClick(popUpRef, () => {
        setShowPopUp(false);
    });

    return (
        <div className={`p-2 flex items-center justify-between space-x-3 w-full border-b border-[#E2E4E9]`}>
            <section className='flex items-center gap-3'>
                {
                    isMobile ?
                        <Icon.ArrowLeft className='cursor-pointer' onClick={() => { setCurrentChat(null); messageController.setPage(1) }} />
                        :
                        null
                }
                <div className='cursor-pointer' onClick={() => navigate(`/userprofile/${receiver?.id}`)}>
                    <Avatar src={receiver?.avatar} size="sm" />
                </div>
            </section>
            <div className={`flex-1 flex items-center space-x-3`}>
                <span className="flex-1 inline-flex flex-col text-sm">
                    <span className={`font-semibold text-lg`}>
                        {(receiver?.username || receiver?.name) ?? '-- --'}
                    </span>
                </span>
            </div>
            <section ref={popUpRef} className="cursor-pointer">
                <Icon.MoreVertical onClick={() => setShowPopUp(prev => !prev)} color="#212121" />
                {
                    showPopUp ?
                        <motion.div
                            variants={PostCardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            className="absolute top-12 right-5 z-10"
                        >
                            <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                                <li onClick={() => navigate(`/userprofile/${receiver?.id}`)}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    <SingleUserIcon className='' size={15} color='#000000' strokeWidth={2} />
                                    <p>View Profile</p>
                                </li>
                                <li onClick={() => { messageController.handleNotificationStatus(currentChat?.notification_status ? 0 : 1); setShowPopUp(false); }}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    {currentChat?.notification_status ? <Icon.BellOff className='' size={15} color='#000000' strokeWidth={2} /> : <Icon.Bell className='' size={15} color='#000000' strokeWidth={2} />}
                                    <p>{currentChat?.notification_status ? "Mute" : "Unmute"} Notifications</p>
                                </li>
                                <li
                                    onClick={() => setShowDeleteModal((prev) => !prev)}
                                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight"
                                >
                                    <TrashIcon className="w-4 h-4 text-[#ff0000]" />
                                    <p>Delete Chat</p>
                                </li>
                                {
                                    messageController?.conversationdetails?.data?.user_blocked ?
                                        <li onClick={() => { messageController.handleBlockUser(); setShowPopUp(false); }}
                                            className={`bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight`}>
                                            {messageController?.blockLoading ? <ColoredLoader colors={["#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000"]} /> : null}
                                            <p className='text-[#FF0000]'>Unblock @{receiver?.username ?? receiver?.name}</p>
                                        </li>
                                        :
                                        <li onClick={() => { messageController.handleShowBlockModal(); setShowPopUp(false); }}
                                            className={`bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight`}>
                                            <Icon.Slash size={15} color='#FF0000' strokeWidth={2} />
                                            <p className='text-[#FF0000]'>Block @{receiver?.username ?? receiver?.name}</p>
                                        </li>
                                }
                            </ul>
                        </motion.div>
                        :
                        null
                }
            </section>

            <Modal
                show={messageController.showBlockModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={messageController.handleShowBlockModal}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <BlockPromptModal
                    handleBlockUser={messageController.handleBlockUser}
                    isLoading={messageController.blockLoading}
                    handleShowBlockModal={messageController.handleShowBlockModal}
                    user={receiver?.username ?? receiver?.name}
                />
            </Modal>

            <Modal
                show={showDeleteModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={() => setShowDeleteModal(false)}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <DeleteChatPromptModal
                    messageController={messageController}
                    onClose={() => setShowDeleteModal(false)}
                />
            </Modal>
        </div>
    )
}