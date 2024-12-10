import { Button } from "../../../components/forms/button"

export const CancelSubscriptionModal = ({ onClose, handleCancelSub, isLoading }) => {
    return (
        <div className="flex items-center justify-center flex-col p-6 gap-6">
            <header className="flex flex-col items-center justify-center text-center gap-4">
                <p className="text-xl font-bold">Cancel Subscription</p>
                <p className="w-full flex items-center justify-center text-sm text-[#858585]">
                    By canceling your subscription, kindly ensure you have read the Cancelation Policy outline.
                    Are you sure you want to cancel Subscription?
                </p>
            </header>

            <section className="w-full flex items-center justify-center gap-4">
                <Button
                    className="!rounded-full"
                    variant="outline"
                    onClick={onClose}
                    fullWidth
                >
                    Close
                </Button>

                <Button
                    variant="error"
                    className="!rounded-full"
                    fullWidth
                    onClick={handleCancelSub}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    Yes, cancel subscription
                </Button>
            </section>
        </div>
    )
}