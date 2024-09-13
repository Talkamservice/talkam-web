import { useLocation, useNavigate } from "react-router-dom"

export const PostTags = ({ tag, side, onClick }) => {

    const location = useLocation()
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);


    const routeToTagSearch = () => {
        searchParams.set('search', tag);
        navigate({
            pathname: '/search/posts',
            search: `?${searchParams.toString()}`,
        }, { replace: true });
    }

    return (
        <h6 onClick={routeToTagSearch} className={`cursor-pointer ${side ? "text-[11px] px-2 py-1" : "text-xs px-3 py-2 "} font-medium text-tblack-100 rounded-full border border-[#D2D2D2]`}>{tag}</h6>
    )
}