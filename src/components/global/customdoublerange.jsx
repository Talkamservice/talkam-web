import { useEffect, useRef, useState } from "react";

export const CustomDoubleRangeSlider = ({ min, max, initialMin, initialMax, step, onValueChange }) => {

    const progressRef = useRef(null)
    const [minValue, setMinValue] = useState(initialMin);
    const [maxValue, setMaxValue] = useState(initialMax);

    const handleMinChange = (e) => {
        const newMinValue = parseInt(e.target.value, 10);
        if (newMinValue <= maxValue - step) {
            setMinValue(newMinValue);
            onValueChange({ min: newMinValue, max: maxValue });
        }
    };

    const handleMaxChange = (e) => {
        const newMaxValue = parseInt(e.target.value, 10);
        if (newMaxValue >= minValue + step) {
            setMaxValue(newMaxValue);
            onValueChange({ min: minValue, max: newMaxValue });
        }
    };


    useEffect(() => {
        progressRef.current.style.left = ((minValue - min) / (max - min)) * 100 + '%';
        progressRef.current.style.right = 100 - ((maxValue - min) / (max - min)) * 100 + '%';
    }, [minValue, maxValue, min, max]);


    return (
        <div className="w-full flex flex-col items-start">
            <div className="w-full">
                <div className="h-2 relative rounded-md bg-tgray-75">
                    <div ref={progressRef} className="absolute h-2 bg-tprimary-50 rounded">
                    </div>
                </div>

                <div className="relative">
                    {/* Min Handle */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={minValue}
                        onChange={handleMinChange}
                        className="absolute w-full -top-2 h-2 bg-transparent appearance-none opacity-0"
                    />
                    <div
                        className="text-tgray-75 text-xs"
                        style={{
                            position: 'absolute',
                            left: `${((minValue - min) / (max - min)) * 100}%`,
                            transform: 'translateX(-50%)',
                            marginTop: '-2rem',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {minValue}
                    </div>
                    <svg
                        className="min-handle-svg"
                        style={{
                            position: 'absolute',
                            left: `${((minValue - min) / (max - min)) * 100}%`,
                            transform: 'translateX(-40%)',
                            marginTop: '-1rem',
                            pointerEvents: 'none',
                        }}
                        width="40"
                        height="25"
                        viewBox="0 0 25 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.8" y="0.8" width="24" height="16" rx="8" fill="#FDAC0E" stroke="#F2C05D" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.4545 5C10.7056 5 10.9091 5.26117 10.9091 11.4167C10.9091 11.7388 10.7056 12 10.4545 12C10.2035 12 10 11.7388 10 11.4167L10 5.58333C10 5.26117 10.2035 5 10.4545 5Z" fill="#212121" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.5463 5C14.7974 5 15.0009 5.26117 15.0009 11.4167C15.0009 11.7388 14.7974 12 14.5463 12C14.2953 12 14.0918 11.7388 14.0918 11.4167L14.0918 5.58333C14.0918 5.26117 14.2953 5 14.5463 5Z" fill="#212121" />
                    </svg>


                    {/* Max Handle */}
                    <input
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={maxValue}
                        data-value={maxValue}
                        onChange={handleMaxChange}
                        className="absolute w-full -top-2 h-2 bg-transparent appearance-none pointer-events-none opacity-0"
                    />

                    <div className="text-tgray-75 text-xs" style={{ position: 'absolute', left: `${((maxValue - min) / (max - min)) * 100}%`, transform: 'translateX(-70%)', marginTop: '-2rem' }}>
                        {maxValue}
                    </div>

                    <svg
                        style={{
                            position: 'absolute',
                            left: `${((maxValue - min) / (max - min)) * 100}%`,
                            transform: 'translateX(-50%)',
                            marginTop: '-1rem',
                            pointerEvents: 'none'
                        }}
                        width="40"
                        height="25"
                        viewBox="0 0 25 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.5" y="0.5" width="24" height="16" rx="8" fill="#FDAC0E" stroke="#F2C05D" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.4545 5C10.7056 5 10.9091 5.26117 10.9091 5.58333L10.9091 11.4167C10.9091 11.7388 10.7056 12 10.4545 12C10.2035 12 10 11.7388 10 11.4167L10 5.58333C10 5.26117 10.2035 5 10.4545 5Z" fill="#212121" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M14.5463 5C14.7974 5 15.0009 5.26117 15.0009 5.58333L15.0009 11.4167C15.0009 11.7388 14.7974 12 14.5463 12C14.2953 12 14.0918 11.7388 14.0918 11.4167L14.0918 5.58333C14.0918 5.26117 14.2953 5 14.5463 5Z" fill="#212121" />
                    </svg>
                </div>
            </div>
        </div>
    );
};
