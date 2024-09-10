import { EmptyState } from "../../../../components/global/emptystate"
import { ColoredLoader } from "../../../../components/global/loader"
import { motion } from "framer-motion"
import { ChatHeader } from "../components/chatheader"
import { UserCard } from "../../../../components/messages/usercard"
import { SenderCard } from "../../../../components/messages/sendercard"
import { useMessagesController } from "../../../../controllers/messageController"
import { RequestPrompt } from "./requestprompt"
import Talkamlogo from '../../../../assets/icons/logo.svg'
import InputEmoji from "react-input-emoji"
import * as Icon from 'react-feather'

export const ChatBox = ({ setCurrentChat, currentChat, page, setPage }) => {

    const messageController = useMessagesController(currentChat, setCurrentChat, page, setPage);

    const renderMessages = () => {
        return messageController.updatedMessages?.map((message, index) => {
            if (message?.message_type === 'date') {
                return (
                    <div key={index} className="flex flex-1 gap-3 items-center justify-center w-full py-3">
                        <span className='text-black bg-none border border-tgray-50 bg-opacity-15 p-1 px-2.5 rounded-xl text-[10px]'>
                            {message?.date ?? null}
                        </span>
                    </div>
                )
            }
            else if (message?.sender_id === messageController?.currentUser?.id) {
                return (
                    <UserCard
                        key={index}
                        text={message?.message}
                        time={message?.created_at}
                        file={message?.asset_url}
                        messageType={message?.message_type?.toLowerCase()}
                        preview={messageController?.imagePreview}
                    // isLoading={message?.imageLoading}
                    />
                );
            } else if (message?.sender_id !== messageController.currentUser?.id) {
                return (
                    <SenderCard
                        key={index}
                        text={message?.message}
                        time={message?.created_at}
                        file={message?.asset_url}
                        messageType={message?.message_type?.toLowerCase()}
                        preview={messageController?.imagePreview}
                    // isLoading={message?.imageLoading}
                    />
                );
            }
            return null;
        });
    };

    return (
        <div className="h-full flex flex-col w-full">
            {
                currentChat ?
                    <>
                        <ChatHeader
                            details={currentChat}
                            currentChat={messageController?.conversationdetails?.data}
                            setCurrentChat={setCurrentChat}
                            currentUser={messageController?.currentUser}
                            messageController={messageController}
                        />
                        <div
                            ref={messageController.scrollableRef}
                            onScroll={messageController.handleScroll}
                            className="w-full h-full flex-col p-6 overflow-y-auto flex-grow">
                            {
                                messageController?.messageLoading ?
                                    <div className='flex items-center justify-center flex-col m-auto w-full h-full p-6 overflow-y-auto'>
                                        <div>
                                            <ColoredLoader />
                                        </div>
                                        <p className="mt-3 text-sm text-[#868C98] text-center">
                                            Loading Messages...
                                        </p>
                                    </div>
                                    :
                                    messageController.messages?.length === 0 ?
                                        <EmptyState
                                            icon={Talkamlogo}
                                            height="h-[30%]"
                                            width="w-[30%]"
                                            text="No chats in this conversation yet"
                                            subtext="Chats would appear here when you have them"
                                        />
                                        :
                                        <motion.ul className="flex flex-col gap-2">
                                            {messageController.isFetching ?
                                                <div className="w-full flex items-center justify-center py-8">
                                                    <ColoredLoader />
                                                </div>
                                                :
                                                null
                                            }
                                            <>
                                                {renderMessages()}
                                            </>
                                            <div className="h-16" ref={messageController.messagesEndRef} />
                                        </motion.ul>
                            }
                        </div>
                        {
                            messageController?.conversationdetails && !messageController?.messageFetching && !messageController?.detailsLoading ?
                                <section className="w-full p-2">
                                    {
                                        (Number(messageController?.currentUser?.id) !== Number(currentChat?.requested_by?.id)) && (messageController?.conversationdetails?.data?.status === "Awaiting_Response") ?
                                            <div className={`w-2/3 flex items-center justify-center m-auto py-6`}>
                                                <RequestPrompt
                                                    user={messageController?.receiver?.username ?? messageController?.receiver?.name}
                                                    handleRequest={messageController?.handleRequestStatus}
                                                    isLoading={messageController?.requestLoading}

                                                />
                                            </div>
                                            :
                                            <section>
                                                {
                                                    messageController?.conversationdetails?.data?.i_am_blocked || messageController?.conversationdetails?.data?.user_blocked ?
                                                        <section className="w-full flex items-center justify-center text-tgray-300 text-sm py-4">
                                                            You can no longer send messages to this person.
                                                        </section>
                                                        :
                                                        <form onSubmit={() => messageController.handleSubmit()} className={`w-full flex items-center gap-4 border rounded-full px-4`}>
                                                            <section className="flex-1">
                                                                <InputEmoji
                                                                    value={messageController.text}
                                                                    onChange={messageController.setText}
                                                                    cleanOnEnter
                                                                    onEnter={messageController.handleSubmit}
                                                                    placeholder="Type a message..."
                                                                    borderColor="transparent"
                                                                    theme="auto"
                                                                    keepOpened
                                                                    fontSize={12}
                                                                />
                                                            </section>
                                                            <section className="flex items-center gap-4 flex-2">
                                                                {
                                                                    messageController?.imageLoading ?
                                                                        <ColoredLoader />
                                                                        :
                                                                        <label className=' cursor-pointer rounded-full'>
                                                                            <input
                                                                                className='hidden'
                                                                                type='file'
                                                                                name="file"
                                                                                onChange={messageController.uploadFile}
                                                                            />
                                                                            <Icon.Paperclip
                                                                                size={18}
                                                                                color="gray"
                                                                            />
                                                                        </label>
                                                                }

                                                                <button onClick={messageController.handleSubmit} type="button">
                                                                    <Icon.Send
                                                                        size={18}
                                                                        color="gray"
                                                                    />
                                                                </button>
                                                            </section>
                                                        </form>
                                                }
                                            </section>
                                    }
                                </section>
                                :
                                null
                        }
                    </>
                    :
                    <div className='flex items-center justify-center m-auto relative w-full h-full p-6 overflow-y-auto'>
                        <EmptyState
                            icon={Talkamlogo}
                            height="h-[30%]"
                            width="w-[30%]"
                            text="Select a message"
                            subtext="Choose from your existing conversations or start a new one."
                        />
                    </div>
            }
        </div>
    )
}