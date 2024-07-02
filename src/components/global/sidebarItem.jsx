import { cloneElement } from "react"
import { NavLink } from "react-router-dom"

export const SideBarItem = ({ children, url, icon, onClick }) => {

    return (
        <NavLink onClick={onClick} to={url} className={`cursor-pointer w-full flex items-center justify-start leading-none no-underline hover:no-underline m-0 `}
            style={({ isActive }) => {
                return {
                // backgroundColor: isActive ? "#017FC8" : "",
                // color: isActive ? '#FFFFFF' : '#222222',
                textDecoration: 'none',
                writingMode:" horizontal-tb",
                // fontWeight: "800"
                };
            }}
        >
            <div className="flex items-center justify-between gap-2">
                <span aria-hidden="true">
                {icon &&
                    cloneElement(icon, {
                        className: `w-6 h-6 `,
                        // fill: 'currentColor',
                    })}
                </span>
                <h2 className={`text-sm font-normal`}>{children}</h2>
            </div>
        </NavLink>
    )
}