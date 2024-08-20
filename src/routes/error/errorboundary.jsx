import { Button } from "../../components/forms/button"
import { EmptyState } from "../../components/global/emptystate"
import { useNavigate } from "react-router-dom"
import ErrorImage from '../../assets/images/error.jpg'
import * as Icon from 'react-feather'

export const ErrorBoundaryFallBack = ({ error }) => {
    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate(-1, { replace: true })
        // window.location.reload()
    }
    console.log(error)
    return (
        <div id="error-page" className="w-full h-dvh flex items-center justify-center flex-col overflow-auto">
            <div className="w-1/2">
                <EmptyState
                    icon={ErrorImage}
                    height="h-[70%]"
                    width="w-[70%]"
                    text={error}
                    subtext="Kindly reload the page or go back..."
                    node={<Button onClick={handleGoBack} children="Go back" leftIcon={<Icon.ArrowLeft size={15} />} />}
                />
            </div>
        </div>
    )
}