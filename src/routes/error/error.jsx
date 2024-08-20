import { useNavigate, useRouteError } from "react-router-dom";
import { EmptyState } from "../../components/global/emptystate";
import { Button } from "../../components/forms/button";
import Lost from '../../assets/images/error.jpg'
import * as Icon from 'react-feather'

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate()
  const handleGoBack = () => {
    navigate(-1, { replace: true })
  }

  return (
    <div id="error-page" className="w-full h-screen flex items-center justify-center flex-col overflow-auto">
      <div className="w-1/2">
        <EmptyState
          icon={Lost}
          height="h-[70%]"
          width="w-[70%]"
          text={error?.statusText || error?.message}
          subtext="Kindly reload the page or go back..."
          node={<Button onClick={handleGoBack} children="Go back" leftIcon={<Icon.ArrowLeft size={15} />} />}
        />
      </div>
    </div>
  );
}