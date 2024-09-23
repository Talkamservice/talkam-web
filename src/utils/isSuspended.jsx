import { Modal } from "../components/global/modal"
import { Button } from "../components/forms/button";
import { useNavigate } from "react-router-dom";
import * as Icon from 'react-feather'

export const IsSuspended = ({ isSuspended, children }) => {

    const navigate = useNavigate()

    return (
        <>
            {
                !isSuspended ?
                    <>
                        {children}
                    </>
                    :
                    <Modal
                        show={isSuspended}
                        shouldCloseOnEscPress={false}
                        shouldCloseOnOverlayClick={false}
                        onClose={() => navigate(-1, { replace: true })}
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
                                onClick={() => navigate(-1, { replace: true })}
                            />
                        </div>
                    </Modal>
            }
        </>
    )
}