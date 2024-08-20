import { EmptyState } from "../../../../components/global/emptystate";
import { Search } from "../../../../components/global/search"
import { ConversationSkeletonLoader } from "../../../../components/global/skeletons";
import { ConversationCard } from "../../../../components/messages/conversationcard"
import { useGetAllConversationsQuery } from "../../../../services/posts/messagesApiSlice";
import { useState } from "react";
import { useDebounceValue } from "../../../../hooks/useDebounceValue";
import EmptyListIcon from "../../../../assets/images/emptylist.png"

export const Conversations = ({ currentChat, setCurrentChat }) => {

    const [search, setSearch] = useState("");
    const debounceValue = useDebounceValue(search);

    const { data: conversations, isLoading } = useGetAllConversationsQuery({
        status: "",
        tab: "",
        search: debounceValue
    });

    return (
        <div className="w-full h-full flex flex-col gap-8">
            <header className="w-full px-2">
                <Search onChange={(event) => setSearch(event.target.value)} placeholder="Search Messages" />
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
                            conversations?.data?.map((convo) => (
                                <ConversationCard
                                    key={convo.id}
                                    user={convo.receiver?.username ?? convo?.receiver?.name}
                                    time={convo.created_at}
                                    lastMessage={convo.last_message?.message}
                                    status={convo.last_message?.read}
                                    onClick={() => setCurrentChat(() => convo)}
                                    avatar={convo?.receiver?.avatar}
                                    activeChat={currentChat && currentChat?.last_message?.conversation_id === convo?.last_message?.conversation_id}
                                />
                            ))
                }
            </section>
        </div>
    )
}