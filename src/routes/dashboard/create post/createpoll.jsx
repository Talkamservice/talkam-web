import { Input } from "../../../components/forms/input"
import { PostCardVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";
import { AddOnPollInput } from "../../../components/forms/addonpollinput";
import { DropDownSelect } from "../../../components/forms/dropdown";
import { Button } from "../../../components/forms/button";
import { useMemo } from "react";
import { randomId } from "../../../helpers/randomid";

export const CreatePoll = ({ poll, onAddPoll, getInputValue, post, setPost, removePollHandler }) => {
    
    const pollDuration = useMemo(() => Array(24).fill(null).map((_,i) => i + 1).map(h => {
        return {
            id: randomId(),
            name: `${h < 1 ? '' : h === 1 ? h + ' hour' : h + ' hours' }`,
            value: `${h < 1 ? '' : h === 1 ? h + ' hour' : h + ' hours' }`
        }
    }).flat(), []);
    
    const pollDaysDuration = useMemo(() => Array(7).fill(null).map((_,i) => i + 1).map(d => {
        return {
            id: randomId(),
            name: `${d < 1 ? '' : d === 1 ? d + ' day' : d + ' days' }`,
            value: `${d < 1 ? '' : d === 1 ? d + ' day' : d + ' days' }`
        }
    }).flat(), []);

    const handlePollDurationTime = (option) => {
        console.log(option.value)
    }
    const handlePollDurationDays = (option) => {
        console.log(option.value)
    }
     
    return(
        <motion.form
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex flex-col gap-3"
        >
            <Input
                type="text"
                rounded="rounded-[4px]"
                placeholder = 'Question here'
                label = 'Post title/Question'
                value={post?.question}
                onChange={(event) => setPost({...post, question: event.target.value})}
                required
            />

            <section className="flex flex-col gap-1">
                <header className="flex items-start justify-start gap-1">
                    <h2 className="text-sm font-semibold">Options</h2>
                    <span className='text-error-100'>*</span>
                </header>
                <Input
                    type="text"
                    rounded="rounded-[4px]"
                    placeholder = 'Choice 1'
                    onChange={(event) => getInputValue(event, 1, '')}
                    value={poll[0].option}
                />
                <Input
                    type="text"
                    rounded="rounded-[4px]"
                    placeholder = 'Choice 2'
                    onChange={(event) => getInputValue(event, 2, '')}
                    value={poll[1].option}
                />
                {
                    poll?.slice(2)?.map((item, index) => (
                        <AddOnPollInput
                            key={item.index}
                            getInputValue={getInputValue}
                            index={item.index}
                            choiceIndex={ index + 3 }
                            removePollItem={removePollHandler}
                            value={item.option}
                        />
                    ))
                }
            </section>

            <section className="w-full flex flex-col items-start justify-between gap-3 md:flex-row">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Duration of Poll</span>
                    <section className="flex items-center gap-3">
                        <DropDownSelect
                            buttonStyles="!py-2"
                            defaultValue="2 Days"
                            options={pollDaysDuration}
                            onChange={handlePollDurationDays}
                        />
                        <DropDownSelect
                            buttonStyles="!py-2"
                            defaultValue="1 hour"
                            options={pollDuration}
                            onChange={handlePollDurationTime}
                        />
                    </section>
                </div>
                <Button
                    type="button"
                    children="Add choice"
                    className={`!rounded-full !py-2 !px-4 text-sm font-bold text-tprimary-50 ${ poll.length >= 4 ? 'hidden' : 'block' } `}
                    variant="outline"
                    onClick={onAddPoll}
                />
            </section>

        </motion.form>
    )
}