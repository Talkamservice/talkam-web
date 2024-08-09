import { Button } from "../forms/button"

export const BlockPromptModal = ({ user, handleBlockUser, isLoading, handleShowBlockModal }) => {

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2  className="font-bold text-lg">Block @{user}</h2>
                <p className="text-xs text-tgray-250 text-center">They will not be able to follow you or view your posts, and you will not see posts or notifications from @{user}. </p>
            </header>

            <section className="flex flex-col gap-2">
                <Button
                    onClick={handleBlockUser}
                    isLoading={isLoading}
                    disabled={isLoading}
                    className="!rounded-full"
                    children="Block"
                    variant="error"
                    fullWidth
                />
                <Button
                    className="!rounded-full"
                    children="Cancel"
                    variant="outline"
                    fullWidth
                    onClick={handleShowBlockModal}
                />
            </section>
        </main>
    )
}