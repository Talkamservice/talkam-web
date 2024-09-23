import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import { logOut } from "../../../services/authSlice";
import { apiSlice } from "../../../app/api/apiSlice";
import { Storage } from "../../../app/storage";
import * as Icon from 'react-feather'

export const UserPopUp = ({ currentUser, toggleShowPanel, close }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = () => {
        toggleShowPanel();
        close();
        dispatch(apiSlice.util.resetApiState());
        dispatch(logOut());
        Storage.clearItem();
        navigate("/", { replace: true })
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
                    className="bg-white w-full px-4 flex items-center gap-2 text-sm py-3 text-[#E85E51] hover:bg-tgray-xlight font-semibold whitespace-nowrap"
                >
                    <Icon.LogOut size={18} color="#E85E51" />
                    Log out
                </li>
            </ul>
        </div>
    )
}