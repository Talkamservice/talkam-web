import * as Icon from "react-feather"
import { useLocation, useNavigate } from "react-router-dom";

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
        <div className="relative flex items-center border border-[#D2D2D2] rounded-full w-full cursor-pointer overflow-hidden leading-none">
            <div className="w-full overflow-hidden">
                <input
                    className="w-full h-full p-2.5 pl-12 placeholder:text-tgray-100 placeholder:text-sm"
                    type="search"
                    value={searchTerm}
                    onChange={handleChange}
                    placeholder="Search"
                    style={{
                        outline: 'none',
                        border: "none"
                    }}
                />
            </div>
            <span className='absolute left-4 text-tgray-150'>
                <Icon.Search fontWeight='700' size={20} color='#222222' />
            </span>
        </div>
    )
}