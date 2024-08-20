import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "../global/search";

export const NavSearch = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search') || '';

    const handleChange = (e) => {
        const newSearchTerm = e.target.value;
        searchParams.set('search', newSearchTerm);
        navigate({
            pathname: '/search/posts',
            search: `?${searchParams.toString()}`,
        }, { replace: true });
    };

    return (
        <Search onChange={handleChange} value={searchTerm} placeholder="Search" />
    )
}