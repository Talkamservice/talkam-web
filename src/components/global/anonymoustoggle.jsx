import React, { forwardRef } from 'react'
import { EnableUserIcon, DisableUserIcon } from '../../assets/icons/generated'

export const AnonToggleButton = forwardRef((props, ref ) => {

  return (
    <label className='cursor-pointer'>
      <input
        type='checkbox'
        className='hidden'
        ref={ref}
        { ...props }
      />
      <div className={`w-14 p-1 rounded-full ${ props.checked ? "bg-[#FDAC0E]" : "bg-[#EAEAEA]"} `}>
        <div className={`w-fit p-0.5 shadow-sm rounded-full transition-all duration-300 
        ${ props.checked ? 'bg-white translate-x-6 rotate-0' : "bg-white -rotate-[360deg]" }`}
        >
          {props.checked ? <DisableUserIcon /> : <EnableUserIcon />}
        </div>
      </div>
    </label>
  )
})