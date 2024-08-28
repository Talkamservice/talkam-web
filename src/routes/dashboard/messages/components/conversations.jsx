import { EmptyState } from "../../../../components/global/emptystate";
import { Search } from "../../../../components/global/search"
import { ConversationSkeletonLoader } from "../../../../components/global/skeletons";
import { ConversationCard } from "../../../../components/messages/conversationcard"
import EmptyListIcon from "../../../../assets/images/emptylist.png"

export const Conversations = ({ currentChat, setCurrentChat, conversations, isLoading, setSearch, currentUser }) => {

    return (
        <div className="w-full h-full flex flex-col gap-8">
            <header className="w-full px-2">
                <Search
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search Messages"
                />
            </header>

            <section className="w-full flex flex-col gap-2">
                {
                    isLoading ?
                        <section className="px-2">
                            <ConversationSkeletonLoader />
                        </section>
                        :
                        !conversations?.data.length ?
                            <section className="w-full py-1 flex items-center justify-center m-auto h-full">
                                <EmptyState
                                    icon={EmptyListIcon}
                                    height="h-[30px]"
                                    width="h-[30px]"
                                    text="You have no existing chats"
                                    subtext="Your chats would appear here when you have any."
                                />
                            </section>
                            :
                            conversations?.data?.map((convo) => {
                                const receiver = convo?.members?.find(member => member.id !== currentUser.id)
                                const isFromReceiver = receiver?.id === convo?.last_message?.sender_id
                                return (
                                    <ConversationCard
                                        key={convo.id}
                                        user={receiver?.username ?? receiver.name}
                                        time={convo.last_message?.created_at}
                                        lastMessage={convo.last_message?.message}
                                        status={convo.last_message?.read}
                                        onClick={() => setCurrentChat(() => convo)}
                                        avatar={receiver?.avatar}
                                        activeChat={currentChat && currentChat?.last_message?.conversation_id === convo?.last_message?.conversation_id}
                                        unreadcount={convo.number_of_unread}
                                        isFromReceiver={isFromReceiver}
                                    />
                                )
                            })
                }
            </section>
        </div>
    )
}