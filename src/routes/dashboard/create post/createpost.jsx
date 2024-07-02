import { useState } from "react";
import { DropDownSelect } from "../../../components/forms/dropdown"
import { Tabs } from "../../../components/global/tabs"
import { PostsText } from "./poststext";
import { Input } from "../../../components/forms/input";
import { Button } from "../../../components/forms/button";
import { MediaPost } from "./mediapost";
import { CreatePoll } from "./createpoll";
import { toast } from "sonner";
import { talkAmRules } from "../../../constants/talkamrules";
import { RuleCard } from "../../../components/global/rulecard";
import { AnonToggleButton } from "../../../components/global/anonymoustoggle";
import { BasicToggleButton } from "../../../components/global/basictoggle";
import { downVariants } from "../../../helpers/cardanimation";
import { motion } from "framer-motion";

export const CreatePost = () => {

    const [isChecked, setIsChecked] = useState(false)
    const [scheduleCheck, setScheduleCheck] = useState(false)

    const [ poll, setPoll ] = useState([
        {
            index: 1,
            option: '',
            editable: false
        },
        {
            index: 2,
            option: '',
            editable: false
        },
    ])
    const [ post, setPost ] = useState({
        title: "",
        comment: "",
        image: null,
        question: "",
    });

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setPost({...post, image: URL.createObjectURL(files[0])})
    };

    const addPollHandler = () => {
        const newPoll = [...poll, { index: poll.length + 1,  option: '', editable: true }]
        setPoll(newPoll)
    };

    const removePollHandler = (index) => {
        const deleteInput = [...poll];
        const itemIndex = deleteInput.findIndex((input) => input.index === index);
        if(itemIndex < 0) toast.error("item index not found.")
        deleteInput.splice(itemIndex, 1)
        setPoll(deleteInput)
    }

    const getInputValue = (event, index) => {
        const {name, value} = event.target
        onChangePoll(index, name, value)
    }

    const onChangePoll = (index, key, value) => {
        const result = poll?.reduce((prev, current) => {
            if(current.index === index){
                prev.push({
                    ...current,
                    option: value
                })
            } else {
                prev.push(current)
            }
            return prev;
        }, [])
        setPoll(result)
    }
    
    const tabs = [
        {
            id: 0,
            title: "Text",
            component: 
                <PostsText
                    post={post}
                    setPost={setPost}
                />
        },
        {
            id: 1,
            title: "Media",
            component: 
                <MediaPost
                    image={post.image}
                    onChange={handleFileUpload}
                    setPost={setPost}
                    post={post}
                />
        },
        {
            id: 2,
            title: "Poll",
            component: 
                <CreatePoll
                    onAddPoll={addPollHandler}
                    getInputValue={getInputValue}
                    poll={poll}
                    post={post}
                    setPost={setPost}
                    removePollHandler={removePollHandler}
                />
        },
    ];

    return (
        <div className="w-full flex divide-x divide-tgray-light relative">
            <section className=" w-full h-[93dvh] min-h-[93dvh] md:w-4/6 overflow-y-auto no-scrollbar px-6 py-0 sm:py-6">
            {/*left side card here */}
                <main className={`flex flex-col  gap-3 py-3 px-0 sm:px-6 sm:border border-tgray-xlight rounded-tr-xl rounded-tl-xl ${ !isChecked && "rounded-xl" } pb-6 transition-all duration-300 ease-out`}>
                    <header className="w-full flex flex-col items-start md:flex-row gap-4 md:items-center justify-between">
                        <h2 className="font-bold text-2xl">Create post</h2>
                        <DropDownSelect
                            node={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                            defaultValue="Select group or category"
                        />
                    </header>
                    
                    <section className="relative">
                        <Tabs tabs={tabs}/>
                        <span className="absolute top-0 right-0 z-10">
                            <AnonToggleButton
                                checked={isChecked} 
                                onChange={(event) => setIsChecked(event.target.checked)} 
                            />
                        </span>
                    </section>
                    <footer className="w-full flex flex-col gap-4 bg-white">
                        <Input
                            type="text"
                            rounded="rounded-[4px]"
                            placeholder = 'Add at least one tag'
                            label = 'Tags'
                            required
                        />

                        <section className="w-full flex flex-col items-start md:flex-row justify-between gap-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <p className="text-[#272727] font-normal text-base">Schedule this post</p>
                                    <BasicToggleButton checked={scheduleCheck} onChange={(event) => setScheduleCheck(event.target.checked)} />
                                </div>
                                {
                                    scheduleCheck &&
                                    <motion.div
                                        key="chatbox"
                                        variants={downVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                        className="flex items-center gap-3">
                                        <Button
                                            children="Date"
                                            variant="outline"
                                            className="!rounded-md !px-8 !py-2"
                                        />
                                        <Button 
                                            children="Time"
                                            variant="outline"
                                            className="!rounded-md !px-8 !py-2"
                                        />
                                    </motion.div>
                                }
                            </div>
                            <div className="flex items-center gap-8">
                                <Button
                                    variant="link"
                                    children="Drafts"
                                    className="!rounded-full font-bold !text-base text-tprimary-50"
                                />
                                <Button
                                    children="Post"
                                    className="!rounded-full !text-base bg-tprimary-50 px-6 !py-1.5 md:!px-8 md:!py-2.5"
                                />
                            </div>
                        </section>
                    </footer>
                </main>
                {
                    isChecked && 
                    <motion.p
                        key="chatbox"
                        variants={downVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        className="bg-[#FDD78D] text-xs font-semibold rounded-bl-xl rounded-br-xl p-2 flex items-center justify-center text-center">
                        You&apos;re posting anonymously. Your profile won&apos;t be shown.
                    </motion.p>
                }
            </section>

            <section className="w-2/6 px-6 hidden md:block py-4 space-y-8 h-[93dvh] min-h-[93dvh] overflow-y-auto no-scrollbar">
                <section className="flex flex-col gap-8">
                    <header className="flex flex-col gap-3">
                        <h2 className="text-base font-boldNunito leading-none border-b border-tgray-50 py-2">TalkAM Rules</h2>
                        <article className="text-tblack-50 text-sm">
                            Our community fosters respectful dialogue.
                            Be kind, avoid hate speech, and refrain from spamming or sharing personal information.
                        </article>
                    </header>
                    <ul className="flex items-start flex-col gap-4">
                        {talkAmRules.map((rule) => (
                            <RuleCard 
                                key={rule.id}
                                rule={rule.rule}
                                text={rule.text}
                            />
                        ))}
                    </ul>
                </section>
            </section>
        </div>
    )
}