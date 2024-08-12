import { useState } from "react";
import { Modal } from "./modal";
import Fallback from "../../assets/icons/events.svg"
import TalkamLogo from "../../assets/icons/logo.svg"
import * as Icon from 'react-feather'

export const GroupBanner = ({ banner, groupCategory, groupCategoryIcon }) => {

    const [showImagePreview, setShowImagePreview] = useState();

    const toggleModal = () => {
        setShowImagePreview((prev) => !prev)
    }

    return (
        <section className="relative">
            <div onClick={toggleModal} className="relative w-full overflow-hidden cursor-pointer h-[100px] md:h-[150px] border-tgray-200 rounded-sm flex items-center justify-center">
                <img
                    className="border-none h-full w-full"
                    src={banner ?? TalkamLogo}
                    style={{
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: "cover",
                        objectFit: 'cover',
                    }}
                    onError={(e) => {
                        e.target.onerror = TalkamLogo;
                        e.target.src = TalkamLogo;
                    }}
                />

                <div className="absolute top-0 left-0 m-2 md:m-2.5 flex items-center gap-1 px-2 py-1 rounded-full bg-twhite-100">
                    {groupCategoryIcon &&
                        <img
                            src={groupCategoryIcon}
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full"
                            onError={(e) => {
                                e.target.onerror = Fallback;
                                e.target.src = Fallback;
                            }}
                        />
                    }
                    <span className="text-[10px] md:text-sm text-tblack-100 whitespace-nowrap">
                        {groupCategory}
                    </span>
                </div>
            </div>
            <Modal
                show={showImagePreview}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-3/4'
            >
                <div className="w-full h-[90dvh]">
                    <img
                        src={banner}
                        className="w-full h-full flex items-center justify-center m-auto bg-[#000000] relative"
                        style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                            objectFit: 'contain',
                        }}
                        onError={(e) => {
                            e.target.onerror = TalkamLogo;
                            e.target.src = TalkamLogo;
                        }}
                    />
                    <Icon.X
                        size={32}
                        onClick={toggleModal}
                        className="bg-white p-2 rounded-full bg-opacity-30 m-5 cursor-pointer absolute top-0 right-0 border-2 border-[#ffffff80]"
                        color="#000000"
                        strokeWidth={4}
                    />
                </div>
            </Modal>
        </section>
    )
}