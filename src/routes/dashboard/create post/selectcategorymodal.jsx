import { Storage } from "../../../app/storage";
import { Button } from "../../../components/forms/button";
import { DropDownSelect } from "../../../components/forms/dropdown";

export const SelectCategoryModal = ({ onClose, transformedCategories, onChangeCategory, onChangeGroup, transformedGroups, post, setPost }) => {

    let isValid = false;

    if (post.category?.id) {
        isValid = true
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

    return (
        <div className="flex flex-col items-center h-full gap-6 p-6">
            <header className="">
                <p className="text-base font-bold">Select a Category</p>
            </header>
            <section className="w-full flex flex-col gap-6 p-6">
                <DropDownSelect
                    label="Select a category"
                    value={post.category?.value}
                    node={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                    defaultValue={post.category?.value ?? "Select a category"}
                    options={transformedCategories}
                    onChange={onChangeCategory}
                    required
                />

                <DropDownSelect
                    label="Select a group"
                    value={post.group?.value}
                    node={<span className="p-2.5 rounded-full bg-[#bc1f1f]" />}
                    defaultValue={post.group?.value ?? "Select a group"}
                    options={transformedGroups}
                    onChange={onChangeGroup}
                />
            </section>
            <div className="w-full flex items-center gap-4 p-6">
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