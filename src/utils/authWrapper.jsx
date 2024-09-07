import { useState } from "react";
import { useIsAuth } from "../hooks/useIsAuth"
import { Modal } from "../components/global/modal";
import { ModalLogin } from "../routes/auth/modallogin/modalogin";

export const AuthWrapper = ({ children, onClick, ref }) => {

    const isAuth = useIsAuth();
    const [showLogin, setShowLogin] = useState(false);

    const toggleLoginModal = () => {
        setShowLogin(false)
    }

    const handleEventClick = () => {
        if (!isAuth) {
            setShowLogin(true)
        } else {
            onClick()
        }
    }

    return (
        <div ref={ref} className="" onClick={handleEventClick}>
            {children}
            <Modal
                show={showLogin}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleLoginModal}
                position='center'
                contentWidth='w-full md:w-3/4 lg:w-2/4'
            >
                <ModalLogin onClose={toggleLoginModal} />
            </Modal>
        </div>
    )
}