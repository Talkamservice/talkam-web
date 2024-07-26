import { Avatar } from "../../components/global/avatar"
import { ColoredLoader } from "../../components/global/loader"
import { useMediaQuery } from "../../hooks/useMediaQuery";
import * as Icon from "react-feather"

export const ChooseAvatarModal = ({ avatars, isLoading, handleAvatarSelect, onClose }) => {

  let isMonitor = useMediaQuery("(max-width: 768px)");

    return (
        <main className="flex flex-col gap-4">
            <header className="flex items-center justify-center border-b border-tgray-xlight p-5">
                <p className="text-lg font-bold">Select your Avatar</p>
                <Icon.X
                    size={32}
                    onClick={onClose}
                    className="bg-[#4444440] p-2 rounded-full bg-opacity-30 m-5 cursor-pointer absolute top-0 right-0 border-2 border-[#2220204e]"
                    color="#000000"
                    strokeWidth={4}
                />
            </header>

            <section className="flex items-center justify-center flex-wrap gap-4 p-2">
                {
                    isLoading ?
                    <ColoredLoader />
                    :
                    avatars?.data?.map((avatar) => (
                        <div
                            key={avatar.id}
                            onClick={() => handleAvatarSelect(avatar)}
                            className={`
                                hover:bg-tgray-50 w-fit
                                rounded-full flex items-center justify-center cursor-pointer p-2
                                transition-all duration-700 ease-in-out hover:mb-2
                            `}
                        >
                            <Avatar
                                size={isMonitor ? "lg" : "2xl"}
                                src={avatar.image}
                            />
                        </div>
                    ))
                }
            </section>
        </main>
    )
}