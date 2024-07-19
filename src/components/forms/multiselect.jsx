import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { useOnOutsideClick } from '../../hooks/useOnOutsideClick';
import { CardVariants } from '../../helpers/cardanimation';
import * as Icon from 'react-feather'

export const MultiSelect = ({ options, selectedItems, setSelectedItems, rounded }) => {

    const ref = useRef();
    const [search, setSearch] = useState('')
    const [filteredData, setFilteredData] = useState(options)
    const [showDropDown, setShowDropDown] = useState(false);

    useOnOutsideClick(ref, () => {
        setShowDropDown(() => false);
    });

    const handleSearchOptions = (event) => {
        setSearch(() => event.target.value)
        const searchWord = event.target.value
        const newFilter = options.filter((value) => {
            return value.toLowerCase().includes(searchWord.toLowerCase());
        });
        if(searchWord === ""){
            setFilteredData((prev) => [...prev, options]);
        }
        setFilteredData(newFilter);
    }

    const handleAddNewtag = (event) => {
        if(selectedItems.length >=4) return;
        if(event.keyCode === 13){
            if(!search || search.trim() === "") return;
            if(selectedItems.includes(search)) return;
            setSelectedItems((prev) => [ ...prev, search ]);
            setSearch(() => "")
        }
    }

    const handleAddItemArray = (item) => {
        if(selectedItems.includes(item) || selectedItems.length >= 4) return;
        setSelectedItems((prev) => [ ...prev, item ]);
        setFilteredData(() => options)
        setSearch(() => '')
    }

    const removeItemFromArray = (item) => {
        const newItems = selectedItems.filter( option => option !== item );
        setSelectedItems(() => newItems)
    }

    useEffect(() => {
        setFilteredData(() => options)
    }, [options])
    

  return (
    <div ref={ref} className='w-full flex flex-col'>
        <div className='w-full relative '>
            <div className={`w-full flex items-center justify-between gap-2 border border-[#E2E4E9] ${ rounded ? rounded : "rounded-xl" } cursor-pointer p-1`}>
                {   !selectedItems?.length ? 
                    <span onClick={() => setShowDropDown(prev => !prev)} className='text-[#76787e] text-sm p-2 whitespace-nowrap leading-none'>
                        Add at least one tag
                    </span>
                    : 
                    <div className='flex-2 flex items-center gap-2 flex-wrap overflow-auto'>
                        {selectedItems?.map((option, index) => (
                            <SelectedPill
                                key={index}
                                option={option}
                                onClick={() => removeItemFromArray(option)}
                            />
                        ))}
                    </div>
                }
                <div onClick={() => setShowDropDown(prev => !prev)} className='w-full flex flex-1 justify-end p-2'>
                    { !showDropDown ? <Icon.ChevronDown color='gray' size={18} /> : <Icon.ChevronUp color='gray' size={18} />}
                </div>
            </div> 
            {
                showDropDown ?
                <motion.section variants={CardVariants} className={`z-10 w-full flex items-start flex-col gap-4 border border-[#E2E4E9] absolute bottom-100 my-2 ${ rounded ? rounded : "rounded-xl" } bg-white p-3`}>
                    <div className="h-[36px] relative w-full">
                        <span className='w-5 absolute top-1/2 left-2 transform -translate-y-1/2'>
                            <Icon.Search size={18} color='gray' />
                        </span>
                        <input
                            style={{
                            outline: "none",
                            border: "1px solid #E2E4E9",
                            boxShadow: "none",
                            }}
                            value={search}
                            onChange={(event) => handleSearchOptions(event)}
                            onKeyUp={(event) => handleAddNewtag(event)}
                            type="text"
                            placeholder="Search"
                            className="text-[#0A0D14] size-full w-full text-sm rounded-[8px] py-2 pl-9 pr-8"
                        />
                    </div>
                    <section className='flex flex-col w-full gap-1 max-h-[120px] overflow-auto'>
                        {
                            !filteredData?.length ?
                            <span className='text-xs text-[#76787e]'>Tap "Enter" to add tag.</span>
                            :
                            filteredData?.map((option, index) => (
                                <button
                                    disabled={selectedItems.length >= 4}
                                    type='button'
                                    onClick={() => handleAddItemArray(option)}
                                    className={`text-sm w-full cursor-pointer disabled:text-tgray-75 disabled:cursor-not-allowed hover:bg-gray-50 text-left p-2`} key={index}
                                >
                                    {option}
                                </button>
                            ))
                        }
                    </section>
                </motion.section>
                :
                null
            }
        </div>
    </div>
  )
}

const SelectedPill = ({ option, onClick }) => {
    return (
        <div className='flex items-center justify-between gap-2 py-2 px-3 bg-[#e8edf3a7] rounded-lg'>
            <span className='text-xs'>{option}</span>
            <Icon.X onClick={onClick} size={15} color='#ff000090' className='cursor-pointer' />
        </div>
    )
}