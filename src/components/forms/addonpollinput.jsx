import { TrashIcon } from '../../assets/icons/generated'
import { Input } from "./input"

export const AddOnPollInput = ({ getInputValue, index, removePollItem, choiceIndex, value }) => {
    return (
        <div className="w-full flex items-center justify-between gap-4">
            <Input
                wrapperClassName="w-full"
                type="text"
                rounded="rounded-[4px]"
                placeholder = {'choice ' + choiceIndex}
                onChange={(event) => getInputValue(event, index, '')}
                value={value}
            />
            <span className="cursor-pointer" onClick={() => removePollItem(index)}>
                <TrashIcon className="text-[#AC4242]" />
            </span>
        </div>
    )
}