import { useNavigate } from "react-router-dom"
import { AuthWrapper } from "../../utils/authWrapper"
import { useState } from "react";
import { Button } from "../forms/button";
import { Modal } from "../global/modal";
import * as Icon from 'react-feather'

export const SubCategoryCard = ({ name, followercount, id, type, isSuspended }) => {

    const navigate = useNavigate();
    const [showPrompt, setShowPrompt] = useState(false);

    const toggleModal = () => {
        setShowPrompt((prev) => !prev)
    }

    const goToSubCategory = () => {
        if (isSuspended) {
            setShowPrompt(true)
        } else {
            navigate(`${type === "Category" ? `/category/${id}` : `/group/${id}`}`)
        }
    }

    return (
        <>
            <AuthWrapper onClick={goToSubCategory}>
                <div className="w-full flex flex-col gap-2 border border-[#E0F1FE] bg-[#F0F9FF] px-3 py-3 rounded-md cursor-pointer">
                    <p className="text-sm font-medium whitespace-nowrap truncate">{name}</p>
                    <p className="flex items-center gap-1 text-[#888888] text-xs font-medium">
                        {followercount} {!followercount ? 'Followers' : followercount > 1 ? "Followers" : "Follower"}
                    </p>
                </div>
            </AuthWrapper>

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