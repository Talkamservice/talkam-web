import { Button } from "../../../../components/forms/button"

export const DeleteChatPromptModal = ({ messageController, onClose }) => {

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-lg">Delete Chat</h2>
                <p className="text-xs text-tgray-250 text-center">This chat would be deleted permanently and all it&apos;s messages. </p>
            </header>

            <section className="flex flex-col gap-2">
                <Button
                    onClick={() => messageController?.handleDeleteConversation()}
                    isLoading={messageController.deleteLoading}
                    disabled={messageController.deleteLoading}
                    className="!rounded-full"
                    children="Delete Chat"
                    variant="error"
                    fullWidth
                />
                <Button
                    className="!rounded-full"
                    children="Cancel"
                    variant="outline"
                    fullWidth
                    onClick={onClose}
                />
            </section>
        </main>
    )
}