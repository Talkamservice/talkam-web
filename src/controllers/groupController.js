import { useCallback, useState } from "react";
import { useGetCategoriesQuery, useGetUserProfileDetailsQuery } from "../services/userApiSlice";
import { useCreateGroupMutation, useGetAllGroupsQuery, useGetFollowingGroupsQuery, useReportGroupMutationMutation } from "../services/groupApiSlice";
import { randomId } from "../helpers/randomid";
import { storageDB } from "../utils/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/handleError";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../services/authSlice";

export const useGroupController = (groupTab, groupId) => {

    let isValid = false;
    let isRuleValid = false;
    const currentUser = useSelector(selectCurrentUser)
    const navigate = useNavigate();
    const [search, setSearch] = useState(null);
    const [categoryId, setCategoryId] = useState("")
    const [imageLoading, setImageLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [openReport, setOpenReport] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState();
    const [checkedValue, setCheckedValue] = useState("");
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
        recommend: "",
        search: ""
    });
    const { data: suggestedGroups, isLoading: suggestedGroupsLoading } = useGetAllGroupsQuery({
        categoryId: categoryId,
        tab: "",
        recommend: 1,
        search: ""
    });
    const { data: following, isLoading: followingGroupsLoading } = useGetFollowingGroupsQuery({
        categoryId: "",
        tab: "",
        search: "",
        type: "all"
    });
    const { data: user, refetch } = useGetUserProfileDetailsQuery(currentUser?.id, {
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true
    });
    const [reportGroup, { isLoading: reportLoading }] = useReportGroupMutationMutation()

    const transformedCategories = categories && categories?.data?.map((category) => {
        return {
            id: category.id,
            name: category.name,
            value: category.name
        }
    });

    const handleReportGroup = async () => {
        try {
            const reportDetails = {
                reason: checkedValue,
                group_id: groupId
            }
            const res = await reportGroup({ ...reportDetails }).unwrap();
            toast.success(res?.message);
            setConfirmationModal(true)
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage);
        }
    }

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
            navigate("/groups")
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
    const handleReportModal = () => {
        setOpenReport((prev) => !prev)
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
        suggestedGroups,
        suggestedGroupsLoading,
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
        reportLoading,
        openReport,
        setOpenReport,
        checkedValue,
        setCheckedValue,
        confirmationModal,
        setConfirmationModal,
        setCheckedValue,
        handleReportGroup,
        handleReportModal,
        navigate,
        user,
    }
}