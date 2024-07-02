import * as Icon from 'react-feather'

export const SelectPill = ({ options, selectedItems, setSelectedItems }) => {

    const HandleSelectedItem = (option) => {
        if(selectedItems?.includes(option)) return;
        setSelectedItems((prev) => [ ...prev, option ]);
    }

    const removeSelectedItem = (option) => {
        const newItems = selectedItems.filter( item => item !== option );
        setSelectedItems(() => newItems)
    }

    return (
        <>
            {
                options?.map(( item ) => 
                    <Pill
                        key={item.id}
                        name={item?.name}
                        addItem={() => HandleSelectedItem(item.id)}
                        removeItem={() => removeSelectedItem(item.id)}
                        selected={ selectedItems.includes(item.id) }
                    />
                )
            }
        </>
    )
}

const Pill = ({ name, addItem, removeItem, selected  }) => {

    return (
        <div onClick={ selected ? removeItem : addItem} className={`cursor-pointer flex items-center divide-x border transition-all duration-500 ease-in-out
            ${ selected ? 'border-tprimary-50 divide-tblue-150 bg-tprimary-50 bg-opacity-20' : 'border-tgray-75 divide-x-tgray-75 bg-none' } 
            rounded-full py-2 `
        }>
            <span className="text-xs md:text-sm text-tgray-150 px-4">{name}</span>
            <span className='px-4 transition-all duration-500 ease-in-out'>
                { selected ? <Icon.X color='#FF0000' size={15} /> : <Icon.Plus size={15} />}
            </span>
        </div>
    )
}