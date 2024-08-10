import { useState } from "react";
import { Storage } from "../../../app/storage";
import { Button } from "../../../components/forms/button";
import { DropDownSelect } from "../../../components/forms/dropdown";
import { TextRadioButton } from "../../../components/forms/textradiobutton";
import { motion } from "framer-motion";
import { downVariants, PostCardVariants } from "../../../helpers/cardanimation";

export const SelectCategoryModal = ({ onClose, transformedCategories, onChangeCategory, onChangeGroup, transformedGroups, post, setPost }) => {

    let isValid = false;
    const [showOptions, setShowOptions] = useState(null);

    const toggleDropdownView = (event) => {
        const { name, checked, value } = event.target;
        if (checked) {
            setShowOptions(() => value)
        }
    }

    const handleCancel = () => {
        const newPost = [{
            ...post,
            category: null,
            group: null
        }]
        setPost(() => newPost);
        Storage.removeItem("post_category")
        Storage.removeItem("post_group");
        onClose();
    }

    if (post.category?.id || post?.group?.id) {
        isValid = true
    }

    return (
        <div className="flex flex-col items-center h-full gap-12 py-6">
            <header className="border-b border-tgray-50">
                <p className="text-lg font-bold">Select a Subcategory/Group</p>
            </header>

            <main className="w-full flex flex-col items-start gap-5">
                <section className="px-6 w-full flex flex-col items-start justify-between md:flex-row gap-5 sm:w-1/2">
                    <TextRadioButton
                        label="Subcategory"
                        name="categories"
                        onChange={toggleDropdownView}
                        value="subcategory"
                    />
                    <TextRadioButton
                        label="Group"
                        name="categories"
                        onChange={toggleDropdownView}
                        value="group"
                    />
                </section>

                {
                    showOptions ?
                        <motion.section
                            key="chatbox"
                            variants={PostCardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                            className="w-full flex flex-col gap-6 px-6">
                            {
                                showOptions === "subcategory" ?
                                    <motion.section
                                        key="chatbox"
                                        variants={downVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    >
                                        <DropDownSelect
                                            label="Select a subcategory"
                                            value={post.category?.value}
                                            node={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                                            defaultValue={post.category?.value ?? "Select a subcategory"}
                                            options={transformedCategories}
                                            onChange={onChangeCategory}
                                            required
                                        />
                                    </motion.section>
                                    :
                                    null
                            }

                            {
                                showOptions === "group" ?
                                    <motion.section
                                        key="chatbox"
                                        variants={downVariants}
                                        initial="initial"
                                        animate="animate"
                                        exit="exit"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                        className=""
                                    >
                                        <DropDownSelect
                                            label="Select a group"
                                            value={post.group?.value}
                                            node={<span className="p-2.5 rounded-full bg-[#bc1f1f]" />}
                                            defaultValue={post.group?.value ?? "Select a group"}
                                            options={transformedGroups}
                                            onChange={onChangeGroup}
                                        />
                                    </motion.section>
                                    :
                                    null
                            }
                        </motion.section>
                        :
                        null
                }
            </main>


            {/* Footer */}
            <div className="w-full flex items-center gap-4 px-6">
                <Button
                    onClick={onClose}
                    fullWidth
                    disabled={!isValid}
                >
                    Done
                </Button>

                <Button
                    variant="error-outline"
                    onClick={handleCancel}
                    fullWidth
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}