import * as Icon from "react-feather"

export const NavSearch = () => {
    return (
        <div className="relative flex items-center border border-[#D2D2D2] rounded-full w-full cursor-pointer overflow-hidden leading-none">
            <div className="w-2/3 overflow-hidden">
                <input
                    className="w-full h-full p-2.5 pl-12 placeholder:text-tgray-100 placeholder:text-sm"
                    type="search"
                    placeholder="Search"
                    style={{
                        outline: 'none',
                        border: "none"
                    }}
                />
            </div>
            <div className="w-1/3 h-full flex items-center justify-center gap-5 border-l border-[#D2D2D2] leading-none p-2.5">
                <span className="text-sm leading-none">
                    Search TalkAM
                </span>
                <Icon.ChevronDown size={20} />
            </div>
            <span className='absolute left-4 text-tgray-150'>
                <Icon.Search fontWeight='700' size={20} color='#222222' />
            </span>
        </div>
    )
}