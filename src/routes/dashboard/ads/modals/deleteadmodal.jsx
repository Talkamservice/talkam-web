import { Button } from "../../../../components/forms/button"

export const DeleteAdModal = ({ onClose, handleDeleteAd, isLoading }) => {

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-lg">Delete this Ad</h2>
                <p className="text-xs text-tgray-250 text-center">
                    You are about to delete this closed Ad, you will lose all the information pertaining to the Ad, Are you sure?
                </p>
            </header>

            <section className="flex gap-2">
                <Button
                    onClick={onClose}
                    className="!rounded-full"
                    children="Cancel"
                    variant="error-outline"
                    fullWidth
                />
                <Button
                    className="!rounded-full"
                    children="Yes, Delete Ad"
                    fullWidth
                    onClick={handleDeleteAd}
                    isLoading={isLoading}
                />
            </section>
        </main>
    )
}