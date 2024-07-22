import { Avatar } from "../../../../components/global/avatar"

export const BlockedUserSettings = () => {
    return (
        <main className="flex flex-col gap-4 h-full py-3">
            <section className="flex flex-col overflow-auto">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Avatar size="sm" />
                        <div className="flex flex-col">
                            <span className="text-base font-medium">Username</span>
                            <span className="text-xs text-tgray-300 font-semibold">Member since Dec, 2022</span>
                        </div>
                    </div>
                    <p to="settings" className='cursor-pointer border border-tgray-50 rounded-full px-2 py-1 flex items-center justify-between gap-2'>
                        <span className='text-tblack-100 text-xs md:text-sm whitespace-nowrap'>Unblock</span>
                    </p>
                </div>
            </section>
        </main>
    )
}