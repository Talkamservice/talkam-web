import { Avatar } from "../../components/global/avatar"
import { ColoredLoader } from "../../components/global/loader"

export const ChooseAvatarModal = ({ avatars, isLoading, handleAvatarSelect }) => {
    return (
        <main className="flex flex-col gap-4">
            <header className="flex items-center justify-center text-lg font-bold border-b border-tgray-xlight p-5">Select your Avatar</header>

            <section className="grid gap-4 grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 p-5">
                {
                    isLoading ?
                    <ColoredLoader />
                    :
                    avatars?.data?.map((avatar) => (
                        <div
                            key={avatar.id}
                            onClick={() => handleAvatarSelect(avatar)}
                            className={`
                                hover:bg-tgray-xlight
                                rounded-full flex items-center justify-center cursor-pointer p-2
                                transition-all duration-700 ease-in-out hover:mb-2
                            `}
                        >
                            <Avatar size="2xl" src={avatar.image} />
                        </div>
                    ))
                }
            </section>
        </main>
    )
}