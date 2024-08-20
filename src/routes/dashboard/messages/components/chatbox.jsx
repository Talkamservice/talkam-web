import { EmptyState } from "../../../../components/global/emptystate"
import { ColoredLoader } from "../../../../components/global/loader"
import { motion } from "framer-motion"
import { ChatHeader } from "../../../../components/messages/chatheader"
import { UserCard } from "../../../../components/messages/usercard"
import { SenderCard } from "../../../../components/messages/sendercard"
import { useMessagesController } from "../../../../controllers/messageController"
import { RequestPrompt } from "./requestprompt"
import Talkamlogo from '../../../../assets/icons/logo.svg'
import InputEmoji from "react-input-emoji"
import * as Icon from 'react-feather'

export const ChatBox = ({ currentChat, isLoading }) => {

    const messageController = useMessagesController(currentChat);

    const renderMessages = () => {
        return messageController.messages?.map((message, index) => {
            if (message?.sender_id === messageController?.currentUser?.id) {
                return (
                    <UserCard
                        key={index}
                        text={message?.message}
                        time={message?.created_at}
                        file={message?.asset_url}
                        isLoading={isLoading}
                        messageType={message?.message_type}
                    />
                );
            } else if (message?.sender_id !== messageController.currentUser?.id) {
                return (
                    <SenderCard
                        key={index}
                        text={message?.message}
                        time={message?.created_at}
                        file={message?.asset_url}
                        isLoading={isLoading}
                        messageType={message?.message_type}
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
                            currentChat={currentChat}
                            currentUser={messageController?.currentUser}
                        />
                        <div className="w-full h-full flex-col p-6 overflow-y-auto flex-grow">
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
                                            <>
                                                {renderMessages()}
                                            </>
                                            <div className="p-1" ref={messageController.messagesEndRef} />
                                        </motion.ul>
                            }
                        </div>
                        <section className="w-full p-2">
                            {
                                (Number(messageController?.currentUser?.id) !== Number(currentChat?.sender?.id)) && (currentChat?.status === "Awaiting_response" ? 'block' : 'hidden') ?
                                    <div className={`w-2/3 flex items-center justify-center m-auto py-6`}>
                                        <RequestPrompt user={currentChat?.sender?.username ?? currentChat?.sender.name} />
                                    </div>
                                    :
                                    <form onSubmit={() => messageController.handleSubmit()} className={`w-full flex items-center gap-4 border rounded-full px-4`}>
                                        <section className="flex-1">
                                            <InputEmoji
                                                value={messageController.text}
                                                onChange={messageController.setText}
                                                cleanOnEnter
                                                onEnter={messageController.handleSubmit}
                                                placeholder="Type a message..."
                                                borderRadius={5}
                                                borderColor="transparent"
                                                theme="auto"
                                            />
                                        </section>
                                        <section className="flex items-center gap-4 flex-2">
                                            <label className=' cursor-pointer rounded-full'>
                                                <input
                                                    className='hidden'
                                                    type='file'
                                                    name="file"
                                                    onChange={messageController.handleFileUpload}
                                                />
                                                <Icon.Paperclip
                                                    size={18}
                                                    color="gray"
                                                />
                                            </label>

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