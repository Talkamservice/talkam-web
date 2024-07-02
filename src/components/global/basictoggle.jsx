import React, { forwardRef } from 'react'

export const BasicToggleButton = forwardRef((props, ref ) => {

  return (
    <label className='cursor-pointer'>
      <input
        type='checkbox'
        className='hidden'
        ref={ref}
        { ...props }
      />
      <div className={`w-14 p-1 rounded-full ${ props.checked ? "bg-[#FDAC0E]" : "bg-[#EAEAEA]"} `}>
        <div className={`w-fit p-2.5 shadow-sm rounded-full transition-all duration-300 bg-white
        ${ props.checked ? 'translate-x-7 rotate-0' : "-rotate-[360deg]" }`}
        ></div>
      </div>
    </label>
  )
})