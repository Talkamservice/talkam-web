import React, { useRef, useState } from 'react'
import { useOnOutsideClick } from '../../hooks/useOnOutsideClick'
import { Search } from '../global/search'
import { ColoredLoader } from '../global/loader'
import * as Icon from 'react-feather'
import { useClickOutside } from '../../hooks/useClickOutside'

export const DropDownSelect = ({ defaultValue, options, label, onChange, readOnly, node, styles, buttonStyles, search, searchChange, searchValue, isLoading, required }) => {

  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState('')

  const ref = useRef()

  useClickOutside(ref, () => {
    setShow(false);
  });

  const toggleDropDown = () => {
    setShow(prev => !prev)
  }

  const handleSelected = (option) => {
    onChange(option)
    setSelected(option)
  }

  return (
    <div tabIndex={0} className={`w-full min-w-[200px] space-y-1 ${styles}`}>
      {!!label ? (
        <label className="text-sm font-medium text-tblack-100 ">{label}</label>
      ) : null}
      {required && <span className='text-error-500'>*</span>}
      <button type='button' ref={ref} onClick={toggleDropDown} className={`w-full relative flex justify-between items-center focus:ring-tblue-100 focus:border-tprimary-100
        gap-6 bg-twhite-100 border border-tgray-50 focus:outline-none rounded-xl focus:ring-4 cursor-pointer p-3 ${buttonStyles}`}
      >
        <section className='flex items-center  gap-2'>
          {!!node && node}
          <p className='text-tgray-300 text-sm whitespace-nowrap'>{selected ? selected?.name : defaultValue}</p>
        </section>
        {show ? <Icon.ChevronUp size={15} color='gray' /> : <Icon.ChevronDown size={15} color='gray' />}
        <div
          className={`absolute overflow-auto ${show ? "block" : "hidden"}
          left-0 right-0 top-full min-w-full w-max max-h-[200px] no-scrollbar bg-white shadow-md mt-1 rounded-lg z-20`}
        >
          {
            search ?
              <section onClick={(event) => event.stopPropagation()} className='p-2 sticky top-0 z-[11] bg-white w-full border-x border-t border-tgray-50 rounded-t-lg'>
                <Search onClick={(event) => event.stopPropagation()} onChange={searchChange} value={searchValue} placeholder='search' />
              </section>
              :
              null
          }
          {
            isLoading ?
              <section className='p-3 flex items-center gap-2'>
                <ColoredLoader />
                <span className='text-xs text-tgray-300'>Loading results...</span>
              </section>
              :
              <ul className={`overflow-hidden text-left border border-tgray-50 ${!search ? "rounded-lg" : "rounded-b-lg"} no-scrollbar relative`}>
                {options?.length ? options?.map(option => (
                  <MenuItem
                    key={option.id}
                    value={option?.value ? option.value : option.name}
                    id={option?.id}
                    onSelect={() => handleSelected(option)}
                    readOnly={readOnly}
                  />
                )) :
                  <li className='w-full overflow-hidden z-10 bg-twhite-100 px-4 py-3 hover:bg-tprimary-50 hover:text-white font-medium text-tblack-100 text-xs'>No options available</li>
                }
              </ul>
          }
        </div>
      </button>
    </div>
  )
}

export const MenuItem = ({ onSelect, value, readOnly }) => {
  return (
    <li onClick={onSelect} className={` ${readOnly && 'pointer-events-none'} overflow-hidden z-10 bg-twhite-100 px-4 py-3 hover:bg-tprimary-50 hover:text-white border-b border-tgray-50 font-medium text-tblack-100 text-xs`}>{value}</li>
  )
}