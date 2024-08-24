import { Button } from "../../../../components/forms/button"

export const RequestPrompt = ({ user, handleRequest, isLoading }) => {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-normal text-sm text-center">
                <span className="font-bold">{user}</span> is sending you a message to connect. Do you want to accept their request to send and receive messages?
                They won't know you have seen this until you accept.
            </p>

            <div className="w-full flex items-center justify-between gap-4">
                <Button
                    variant="error-outline"
                    fullWidth
                    onClick={() => handleRequest("Declined")}
                    disabled={isLoading}
                >
                    Reject
                </Button>

                <Button
                    className="!bg-[#000000]"
                    fullWidth
                    onClick={() => handleRequest("Accepted")}
                    disabled={isLoading}
                >
                    Accept
                </Button>
            </div>
        </div>
    )
}