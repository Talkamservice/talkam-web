import { useState } from "react"
import { Modal } from "../components/global/modal"
import { Button } from "../components/forms/button";
import * as Icon from 'react-feather'

export const IsBanned = ({ isBanned, children, onClick }) => {

    const [showPrompt, setShowPrompt] = useState(false);

    const toggleModal = () => {
        setShowPrompt((prev) => !prev)
    }

    const handleEventClick = () => {
        if (isBanned) {
            setShowPrompt(true)
        } else {
            onClick()
        }
    }

    return (
        <>
            <div onClick={handleEventClick}>
                {children}
            </div>
            <Modal
                show={showPrompt}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full sm:w-3/5 md:w-5/12 xl:w-3/12 '
            >
                <div className="flex items-center justify-center flex-col p-4 gap-8">

                    <header className="flex items-start gap-3 border-b border-tgray-xlight">
                        <Icon.AlertCircle color="#FF0000" size={35} />
                        <p className="font-medium text-center">You have been Suspended from this group and cannot view or interact.</p>
                    </header>

                    <Button
                        className="!rounded-full"
                        children="Cancel"
                        variant="error"
                        fullWidth
                        onClick={toggleModal}
                    />
                </div>
            </Modal>
        </>
    )
}