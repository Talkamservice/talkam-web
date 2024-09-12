import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

export const Carousel = ({ children: slides, autoSlide = false, autoSlideInterval }) => {

    const [currentSlide, setCurrentSlide] = useState(0);

    const goToPrevious = () => {
        setCurrentSlide((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
    }

    const goToNext = () => {
        setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1))
    }

    useEffect(() => {
        if (!autoSlide) return;

        const slideInterval = setInterval(goToNext, autoSlideInterval);
        return () => clearInterval(slideInterval)
    }, [])

    return (
        <div className="">
            <div className="w-full overflow-hidden relative">
                <div
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                    className="w-full transition-transform ease-out duration-300 flex"
                >
                    {slides?.map((slide, idx) => (
                        <div key={idx} className="w-full flex-shrink-0">
                            {slide}
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-between p-2">
                    <ChevronLeft onClick={goToPrevious} size={23} className="bg-white rounded-full p-1.5 cursor-pointer hover:bg-opacity-50 border border-tgray-xlight" />
                    <ChevronRight onClick={goToNext} size={23} className="bg-white rounded-full p-1.5 cursor-pointer hover:bg-opacity-50 border border-tgray-xlight" />
                </div>

                <div className="absolute bottom-2 right-3">
                    <div className="flex items-center justify-center gap-1">
                        {
                            slides?.map((_, index) => (
                                <div
                                    className={`transition-all duration-300 ease-in-out w-1 h-1 rounded-full bg-tprimary-50 ${currentSlide === index ? 'p-[2.5px]' : 'bg-opacity-30'}`}
                                    key={index}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
