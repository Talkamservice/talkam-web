import { useEffect, useState } from "react";
import { DropDownSelect } from "../../../components/forms/dropdown"
import { Tabs } from "../../../components/global/tabs"
import { PostsText } from "./poststext";
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
import { useGetCategoriesQuery, useGetTrendingTagsQuery } from "../../../services/userApiSlice";
import { useCreatePostMutation } from "../../../services/posts/postsApiSlice";
import { handleError } from "../../../utils/handleError";
import { useNavigate } from "react-router-dom";
import { MultiSelect } from "../../../components/forms/multiselect";
import { ScheduleModal } from "./schedulemodal";
import { Modal } from "../../../components/global/modal";
import { storageDB } from "../../../utils/firestore";
import { randomId } from "../../../helpers/randomid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Storage } from "../../../app/storage";
import { SelectCategoryModal } from "./selectcategorymodal";
import { useGetFollowingGroupsQuery } from "../../../services/groupApiSlice";

const storageKeys = [
    "post_title", "post_comment",
    "post_image", "post_tags",
    "post_publish", "post_anonymous",
    "post_polls", "post_category",
    "post_group", "post_image_url"
];

export const CreatePost = () => {

    let isValid = false;
    const navigate = useNavigate();
    const [categoryModal, setCategoryModal] = useState();
    const [imageLoading, setImageLoading] = useState();
    const [isChecked, setIsChecked] = useState(false)
    const [scheduleCheck, setScheduleCheck] = useState(false);
    const [publishDate, setPublishDate] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [pollDuration, setPollDuration] = useState({
        days: null,
        hours: null
    });
    const [poll, setPoll] = useState([
        {
            index: 1,
            option: '',
        },
        {
            index: 2,
            option: '',
        },
    ])

    const [post, setPost] = useState({
        title: "",
        comment: "",
        image: null,
        category: "",
        group: "",
        tags: ""
    });

    //server calls
    const [createPost, { isLoading: createLoading }] = useCreatePostMutation()
    const { data: categories } = useGetCategoriesQuery({
        sort: "",
        categoryId: ""
    });
    const { data: following } = useGetFollowingGroupsQuery({
        categoryId: "",
        tab: "",
        search: ""
    });
    const { data: trending } = useGetTrendingTagsQuery();

    //Functions
    const toggleModal = () => {
        setScheduleCheck(prev => !prev)
    }

    const toggleCategoryModal = () => {
        setCategoryModal((prev) => !prev)
    }

    const convertedtTrendsArray = trending && trending.data?.map((trend) => trend.tag)

    const convertedTime = (days, hours) => {
        let totalHours;
        const totalMinutesInADay = 24 * 60
        const totalMinutesInHours = hours * 60;
        const daysToMinutes = days * totalMinutesInADay;

        totalHours = daysToMinutes + totalMinutesInHours;
        return (totalHours)
    }

    const transformedCategories = categories && categories?.data?.map((category) => {
        return {
            id: category.id,
            name: category.name,
            value: category.name
        }
    });
    const transformedGroups = following && following?.data?.data?.map((group) => {
        return {
            id: group.id,
            name: group.name,
            value: group.name
        }
    });

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if (!files[0]) return;
        // setImagePreview(() => URL.createObjectURL(files[0]))
        // Storage.setItem("post_image", URL.createObjectURL(files[0]))
        savePostImage(files[0]);
    };

    const savePostImage = async (file) => {
        setImageLoading(true)
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        setPost({ ...post, image: url })
        Storage.setItem("post_image_url", url)
        setImageLoading(false)
    }

    const addPollHandler = () => {
        const newPoll = [...poll, { index: poll.length + 1, options: '' }]
        setPoll(newPoll)
    };

    const removePollHandler = (index) => {
        const deleteInput = [...poll];
        const itemIndex = deleteInput.findIndex((input) => input.index === index);
        if (itemIndex < 0) toast.error("item index not found.")
        deleteInput.splice(itemIndex, 1)
        setPoll(deleteInput)
    }

    const getInputValue = (event, index) => {
        const { name, value } = event.target
        onChangePoll(index, name, value)
    }

    const onChangePoll = (index, key, value) => {
        const result = poll?.reduce((prev, current) => {
            if (current.index === index) {
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
        Storage.setItem("post_polls", result)
    }

    const tabs = [
        {
            id: 0,
            title: "Text",
            component: <PostsText post={post} setPost={setPost} />
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
                    imageLoading={imageLoading}
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
                    pollDuration={pollDuration}
                    setPollDuration={setPollDuration}
                />
        },
    ];

    const handleSelectedCategory = (category) => {
        setPost({ ...post, category: category })
        Storage.setItem("post_category", category)
    }

    const handleSelectedGroup = (group) => {
        setPost({ ...post, group: group })
        Storage.setItem("post_group", group)
    }

    const handleCreatePost = async () => {
        const transformedPollOptions = poll && poll.map((item) => [
            item.option
        ]).flat(2);
        const PostType = poll.some(item => item.option !== "") ? "Poll" : "Text";

        try {
            const newPost = {
                category_id: post.category?.id,
                group_id: post.group?.id,
                type: PostType,
                title: post.title,
                body: post.comment,
                status: "Active",
                publish_at: publishDate ?? null,
                is_anonymous: isChecked ? 1 : 0,
                attachments: !post.image ? null : [{ url: post.image, type: "Image" }],
                poll: PostType === "Poll" ? {
                    duration: convertedTime(pollDuration.days, pollDuration.hours),
                    options: transformedPollOptions,
                    type: "Text"
                } : null,
                tags: selectedItems
            }
            const postRes = await createPost({ ...newPost }).unwrap();
            toast.success(postRes.message);
            storageKeys.forEach((key) => Storage.removeItem(key))
            navigate("/home/new", { replace: true })
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    useEffect(() => {

        const post_title = Storage.getItem('post_title');
        const post_comment = Storage.getItem('post_comment');
        // const post_image = Storage.getItem('post_image');
        const post_image_url = Storage.getItem('post_image_url');
        const post_tags = Storage.getItem('post_tags');
        const post_category = Storage.getItem('post_category');
        const post_group = Storage.getItem('post_group');

        setPost((prev) => {
            return {
                ...prev,
                title: post_title,
                comment: post_comment,
                image: post_image_url,
                tags: post_tags,
                category: post_category,
                group: post_group
            }
        })
        // setImagePreview(post_image)
        setSelectedItems(post_tags ?? [])
    }, [])

    if ((post.comment || post.title) && post?.category?.id) {
        isValid = true
    }

    return (
        <div className="w-full flex divide-x divide-tgray-light relative">
            <section className=" w-full h-[93dvh] min-h-[93dvh] md:w-4/6 overflow-auto no-scrollbar px-6 py-0 sm:py-6">
                {/*left side card here */}
                <main className={`flex flex-col  gap-3 py-3 px-0 sm:px-6 sm:border border-tgray-xlight rounded-tr-xl rounded-tl-xl ${!isChecked && "rounded-xl"} pb-6 transition-all duration-300 ease-out`}>
                    <header className="w-full flex flex-col items-start md:flex-row gap-4 md:items-center justify-between">
                        <h2 className="font-bold text-2xl">Create post</h2>
                        <div className="w-3/7">
                            {/* <DropDownSelect
                                value={post.category?.value}
                                node={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                                defaultValue={ post.category?.value ?? "Select group or category" }
                                options={transformedCategories}
                                onChange={handleSelectedCategory}
                            /> */}
                            <Button
                                variant="outline"
                                onClick={toggleCategoryModal}
                                leftIcon={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                            >
                                {
                                    (post?.category?.name && post?.group?.name) ?
                                        post?.category?.name + '/' + (post?.group?.name ?? "")
                                        :
                                        (post?.category?.name || post?.group?.name) ?
                                            post?.category?.name
                                            :
                                            'Select a category or group'
                                }
                            </Button>
                        </div>
                    </header>

                    <section className="relative">
                        <Tabs tabs={tabs} />
                        <span className="absolute top-0 right-0 z-[12]">
                            <AnonToggleButton
                                checked={isChecked}
                                onChange={(event) => setIsChecked(event.target.checked)}
                            />
                        </span>
                    </section>
                    <footer className="w-full flex flex-col gap-4 bg-white">
                        <section className="flex flex-col gap-2">
                            <label
                                className='text-sm font-medium text-tblack-100'
                            >
                                Tags <span className="text-xs text-tgray-75 px-1">(Maximum: 4)</span>
                            </label>
                            <MultiSelect
                                rounded="rounded-[4px]"
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                                options={convertedtTrendsArray ?? []}
                            />
                        </section>

                        <section className="w-full flex flex-col items-start md:flex-row justify-between gap-3">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4">
                                    <p className="text-[#272727] font-normal text-base">Schedule this post</p>
                                    <BasicToggleButton checked={scheduleCheck} onChange={(event) => setScheduleCheck(event.target.checked)} />
                                </div>
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
                                    onClick={handleCreatePost}
                                    isLoading={createLoading}
                                    disabled={!isValid || createLoading}
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

            {/* Right side */}
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
            <Modal
                show={scheduleCheck}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-3/6 xl:w-3/12'
            >
                <ScheduleModal
                    setPublishDate={setPublishDate}
                    onClose={toggleModal}
                />
            </Modal>

            <Modal
                show={categoryModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleCategoryModal}
                position='center'
                contentWidth='w-full md:w-2/5'
            >
                <SelectCategoryModal
                    onClose={(toggleCategoryModal)}
                    post={post}
                    setPost={setPost}
                    transformedCategories={transformedCategories}
                    onChangeCategory={handleSelectedCategory}
                    transformedGroups={transformedGroups}
                    onChangeGroup={handleSelectedGroup}
                />
            </Modal>
        </div>
    )
}