import React from 'react';

export const Tooltip = ({ children, text, position = "top" }) => {
    const positionClassesMap = {
        top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
        left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
        right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
    };

    const pointerClasses = {
        top: "left-1/2 transform -translate-x-1/2 -bottom-4 border-t-gray-800",
        bottom: "left-1/2 transform -translate-x-1/2 -top-3.5 border-b-gray-800",
        left: "top-1/2 transform -translate-y-1/2 -right-3.5 border-l-gray-800",
        right: "top-1/2 transform -translate-y-1/2 -left-3.5 border-r-gray-800"
    };

    return (
        <span className="relative group inline-flex">
            {children}
            <div className={`z-[9999] absolute whitespace-nowrap bg-[#212121] text-white text-xs px-3 py-2 rounded-xl hidden group-hover:block transition-all duration-700 ease-in-out ${positionClassesMap[position]}`}>
                {text}
                <div className={`absolute w-0 h-0 border-8 border-transparent ${pointerClasses[position]}`} />
            </div>
        </span>
    );
};