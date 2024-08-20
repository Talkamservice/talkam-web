import * as Icon from 'react-feather'

export const Search = ({ value, onChange, placeholder = "Search" }) => {
    return (
        <div className="relative flex items-center border border-[#D2D2D2] rounded-full w-full cursor-pointer overflow-hidden leading-none">
            <div className="w-full overflow-hidden">
                <input
                    className="w-full h-full p-2.5 pl-12 text-sm text-tgray-150 placeholder:text-tgray-500 placeholder:text-sm"
                    type="search"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
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