import { useEffect, useState } from "react";
import { Tabs } from "../../../components/global/tabs";
import { ChatBox } from "./components/chatbox"
import { Conversations } from "./components/conversations";
import { Requests } from "./components/requests";
import { useMediaQuery } from "../../../hooks/useMediaQuery";

export const Messages = ({ onClose }) => {

    const [currentChat, setCurrentChat] = useState(null);

    const tabs = [
        {
            id: 0,
            title: "Messages",
            component: <Conversations
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
            />
        },
        {
            id: 1,
            title: "Requests",
            component: <Requests
                setCurrentChat={setCurrentChat}
                currentChat={currentChat}
            />
        },
    ];


    const isMobile = useMediaQuery("(max-width: 1024px)");
    let switchBoxView = currentChat && isMobile === true;


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setCurrentChat(() => null)
            }
        }
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="w-full h-[calc(100dvh-2dvh)] top-0 bottom-0 relative">
            <main className='w-full h-full flex flex-1 grow items-start justify-start border-r border-[#E2E4E9] divide-x divide-tgray-200 overflow-hidden'>

                <section className={`w-full h-full md:w-1/3 relative overflow-y-auto pt-5 ${!switchBoxView && isMobile ? 'md:w-full' : ''} ${switchBoxView ? 'hidden' : 'block'}`}>
                    <Tabs
                        tabs={tabs}
                        headerPadding="px-8"
                    />
                </section>

                <section className={`w-full h-full md:w-2/3 ${switchBoxView && 'w-full md:w-full block'} ${!switchBoxView && isMobile ? "hidden" : "block"}`}>
                    <ChatBox
                        currentChat={currentChat}
                    />
                </section>
            </main>
        </div>
    )
}