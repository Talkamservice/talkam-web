import { useCallback, useState } from "react";
import { useGetCategoriesQuery } from "../services/userApiSlice";
import { useCreateGroupMutation, useGetAllGroupsQuery, useGetFollowingGroupsQuery } from "../services/groupApiSlice";
import { randomId } from "../helpers/randomid";
import { storageDB } from "../utils/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";

export const useGroupController = (groupTab) => {

    let isValid = false;
    let isRuleValid = false;
    const [search, setSearch] = useState(null);
    const [categoryId, setCategoryId] = useState("")
    const [imageLoading, setImageLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [groupDetails, setGroupDetails] = useState({
        name: "",
        banner: null,
        purpose: "",
        information: "",
        access: "",
        categoryId: null,
        rulesSummary: "",
    });
    const [ruleBody, setRuleBody] = useState({
        title: "",
        description: "",
    });
    const [rules, setRules] = useState([]);

    const setFormattedDetailsContent = useCallback(
        (text, name, limit) => {
            setGroupDetails({ ...groupDetails, [name]: text?.slice(0, limit) });
        },
        [groupDetails, setGroupDetails]
    );
    const setFormattedRuleContent = useCallback(
        (text, name, limit) => {
            setRuleBody({ ...ruleBody, [name]: text?.slice(0, limit) });
        },
        [ruleBody, setRuleBody]
    );
    const { data: categories, isLoading: categoriesLoading } = useGetCategoriesQuery({
        sort: ""
    });
    const [createGroup, { isLoading: createGroupLoading }] = useCreateGroupMutation();
    const { data: allGroups, isLoading: allGroupsLoading, isFetching: fetchingGroups } = useGetAllGroupsQuery({
        categoryId: categoryId,
        tab: groupTab ?? "",
        search: ""
    });
    const { data: following, isLoading: followingGroupsLoading } = useGetFollowingGroupsQuery({
        categoryId: "",
        tab: "",
        search: ""
    });

    const transformedCategories = categories && categories?.data?.map((category) => {
        return {
            id: category.id,
            name: category.name,
            value: category.name
        }
    });

    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if (!files[0]) return;
        savePostImage(files[0]);
    };

    const savePostImage = async (file) => {
        setImageLoading(true)
        const imageRef = ref(storageDB, `web-images/${randomId()}`);
        const snapshot = await uploadBytes(imageRef, file);
        const url = await getDownloadURL(
            ref(storageDB, snapshot.metadata.fullPath)
        );
        setGroupDetails({ ...groupDetails, banner: url })
        setImageLoading(false)
    }

    const handleCategoryselect = (option) => {
        setGroupDetails((prev) => ({ ...prev, categoryId: option.id }))
    }
    const handleDiscoverabiltySelect = (option) => {
        setGroupDetails((prev) => ({ ...prev, access: option.value }))
    }

    const handleCreateGroup = async (event) => {
        event.preventDefault();

        try {

            const groupInformation = {
                category_id: groupDetails.categoryId,
                name: groupDetails.name,
                description: groupDetails.purpose,
                about: groupDetails.information,
                image: groupDetails.banner,
                guidelines: rules,
                group_access: groupDetails.access,
                status: "Active",
                tags: null,
                can_post: 1,
            }
            const res = await createGroup({ ...groupInformation }).unwrap();
            toast.success(res?.message);
            setGroupDetails(() => ({
                name: "",
                banner: null,
                purpose: "",
                information: "",
                access: "",
                categoryId: null,
                rulesSummary: "",
            }));
            setRules([]);

        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    };

    const handleSaveRule = (event) => {
        event.preventDefault();
        setRules(() => [...rules, ruleBody])
        setRuleBody({
            id: randomId(),
            title: "",
            description: "",
        })
        setShowModal(false);
    }

    const handleRemoveRule = (id) => {
        const newRules = rules.filter((rule) => rule.id !== id);
        setRules(() => newRules)
    }
    const toggleModal = () => {
        setShowModal((prev) => !prev)
    }
    if (groupDetails.banner && groupDetails.name
        && groupDetails.access && groupDetails.information
        && groupDetails.purpose && groupDetails.categoryId
        && rules.length > 1) {
        isValid = true
    }

    if (ruleBody.title && ruleBody.description) {
        isRuleValid = true
    }

    return {
        imageLoading,
        setImageLoading,
        showModal,
        setShowModal,
        groupDetails,
        setGroupDetails,
        rules,
        categoryId,
        setRules,
        setFormattedDetailsContent,
        setFormattedRuleContent,
        setCategoryId,
        categoriesLoading,
        createGroupLoading,
        allGroupsLoading,
        followingGroupsLoading,
        fetchingGroups,
        categories,
        transformedCategories,
        handleFileUpload,
        handleSaveRule,
        savePostImage,
        handleCategoryselect,
        handleDiscoverabiltySelect,
        handleCreateGroup,
        handleRemoveRule,
        following,
        allGroups,
        toggleModal,
        ruleBody,
        setRuleBody,
        isValid,
        isRuleValid,
        search,
        setSearch,
    }
}