import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logOut } from "../../../services/authSlice";
import { apiSlice } from "../../../app/api/apiSlice";

export const UserPopUp = ({ currentUser, toggleShowPanel, close }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = () => {
        toggleShowPanel();
        close();
        dispatch(apiSlice.util.resetApiState());
        dispatch(logOut());
        navigate("/login", { replace: true })
    }

    return (
        <div className="flex flex-col min-w-[200px] z-40">
            <ul className="w-full bg-white flex flex-col items-start divide-y divide-tgray-50 border border-tgray-50 overflow-hidden rounded-xl">
                <li onClick={() => { navigate(`/userprofile/${currentUser.id}`); toggleShowPanel(); close() }}
                    className="bg-white w-full px-4 flex items-start gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight font-semibold whitespace-nowrap"
                >
                    My Profile
                </li>
                <li onClick={() => { navigate("/settings"); toggleShowPanel(); close() }}
                    className="bg-white w-full px-4 flex items-start gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight font-semibold whitespace-nowrap"
                >
                    Settings
                </li>
                <li onClick={handleLogOut}
                    className="bg-white w-full px-4 flex items-start gap-2 text-sm py-3 text-[#444444] hover:bg-tgray-xlight font-semibold whitespace-nowrap"
                >
                    Log out
                </li>
            </ul>
        </div>
    )
}