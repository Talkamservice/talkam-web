import { Button } from "../../../../components/forms/button"

export const CloseAdModal = ({ onClose, handleCloseAdHandler, isLoading }) => {

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="w-full flex flex-col items-center justify-center gap-3">
                <h2 className="font-bold text-lg">Close a running Ad</h2>
                <p className="text-xs text-tgray-250 text-center">
                    You are about to close a running ad, and all information related to the ad will be permanently lost.
                    Please note that this action is irreversible, and no refunds will be provided. Are you sure you want to proceed?
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
                    children="Yes, Proceed"
                    fullWidth
                    onClick={handleCloseAdHandler}
                    isLoading={isLoading}
                />
            </section>
        </main>
    )
}