import { useEffect, useRef, useState } from "react";

export const CustomRangeSlider = ({ min, max, initialValue, step, onValueChange }) => {
    const progressRef = useRef(null);
    const [value, setValue] = useState(initialValue);

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        setValue(newValue);
        if (onValueChange) {
            onValueChange(newValue);
        }
    };

    useEffect(() => {
        progressRef.current.style.width = ((value - min) / (max - min)) * 100 + '%';
    }, [value, min, max]);

    return (
        <div className="w-full flex flex-col items-start">
            <div className="w-full">
                <div className="h-2 relative rounded-md bg-tgray-75">
                    <div ref={progressRef} className="absolute h-2 bg-tprimary-50 rounded"></div>
                </div>

                <div className="relative">
                    {/* Single Handle */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={handleChange}
                        className="absolute w-full -top-1 h-2 bg-transparent appearance-none pointer-events-none opacity-0"
                    />
                    <div
                        className="text-tgray-75 text-xs"
                        style={{
                            position: 'absolute',
                            left: `${((value - min) / (max - min)) * 100}%`,
                            transform: 'translateX(-50%)',
                            marginTop: '-2rem',
                            whiteSpace: 'nowrap' // Prevent text wrapping
                        }}
                    >
                        {value}
                    </div>
                    <svg
                        style={{
                            position: 'absolute',
                            left: `${((value - min) / (max - min)) * 100}%`,
                            transform: 'translateX(-50%)',
                            marginTop: '-.8rem',
                            pointerEvents: 'none'
                        }}
                        width="40"
                        height="20"
                        viewBox="0 0 25 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.5" y="0.5" width="24" height="16" rx="8" fill="#FDAC0E" stroke="#F2C05D" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.4545 5C10.7056 5 10.9091 5.26117 10.9091 5.58333L10.9091 11.4167C10.9091 11.7388 10.7056 12 10.4545 12C10.2035 12 10 11.7388 10 11.4167L10 5.58333C10 5.26117 10.2035 5 10.4545 5Z" fill="#212121" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.5463 5C14.7974 5 15.0009 5.26117 15.0009 5.58333L15.0009 11.4167C15.0009 11.7388 14.7974 12 14.5463 12C14.2953 12 14.0918 11.7388 14.0918 5.58333C14.0918 5.26117 14.2953 5 14.5463 5Z" fill="#212121" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
