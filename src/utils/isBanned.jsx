import { Modal } from "../components/global/modal"

export const IsBlocked = ({ isBanned }) => {

    return (
        isBanned ?
            <>{children}</> :
            <Modal
                show={true}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                // onClose={toggleLoginModal}
                position='center'
                contentWidth='w-full md:w-3/4 lg:w-2/4'
            >
                <div className="flex items-center justify-center flex-col">
                    <p>You have been banned from this group and cannot view or interact</p>
                </div>
            </Modal>
    )
}