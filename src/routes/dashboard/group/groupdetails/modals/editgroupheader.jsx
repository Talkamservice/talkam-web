import { useCallback, useState } from "react"
import { Button } from "../../../../../components/forms/button"
import { Input } from "../../../../../components/forms/input"
import { TextArea } from "../../../../../components/forms/textarea"
import { Loader } from "../../../../../components/global/loader"
import { handleError } from "../../../../../utils/handleError"
import { toast } from "sonner"
import { useUpdateGroupDetailsMutation } from "../../../../../services/groupApiSlice"
import { TrashIcon } from "../../../../../assets/icons/generated"
import { randomId } from "../../../../../helpers/randomid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storageDB } from "../../../../../utils/firestore"
import * as Icon from "react-feather"

export const EditGroupHeader = ({ groupId, onClose }) => {

    const [imageLoading, setImageLoading] = useState();
    const [details, setDetails] = useState({
        banner: null,
        title: "",
        description: "",
    });

    const setFormattedDetailsContent = useCallback(
        (text, name, limit) => {
            setDetails({ ...details, [name]: text?.slice(0, limit) });
        },
        [details, setDetails]
    );
    const [updateGroupDetails, { isLoading }] = useUpdateGroupDetailsMutation();

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
        setDetails({ ...details, banner: url })
        setImageLoading(false)
    }

    const handleUpdateGroupDetails = async (event) => {
        event.preventDefault();
        try {
            const body = {
                group_id: groupId,
                name: details?.title,
                about: details?.description,
                image: details?.banner
            }
            const res = await updateGroupDetails({ id: groupId, body }).unwrap()
            toast.success(res?.message);
            onClose();
        } catch (error) {
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
    }

    return (
        <main className="w-full flex flex-col gap-4 p-6 md:p-8">
            <header className="w-full flex items-start border-b border-tgray-50 ">
                <h4 className="text-lg font-boldNunito">Edit Group Details</h4>
            </header>

            <section className="relative">
                <div
                    className="relative w-full overflow-hidden cursor-pointer min-h-[150px] max-h-[160px] border-tgray-200 rounded-sm flex items-center justify-center">
                    <img
                        className="border-none h-full w-full"
                        src={details?.banner ?? null}
                        style={{
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: "cover",
                            objectFit: 'cover',
                        }}
                    />
                    {
                        imageLoading ?
                            <div className="w-full h-full bg-gradient-to-b from-[#a99daa] to-[#563e58] absolute flex items-center justify-center m-auto pointer-events-none">
                                <Loader />
                            </div>
                            :
                            !details?.banner ?
                                <label className="w-full h-full bg-gradient-to-b from-[#7D3881] to-[#9A4FA1] absolute flex items-end justify-end p-4">
                                    <Input
                                        className='hidden'
                                        type='file'
                                        name="img"
                                        id="img"
                                        accept='image/*'
                                        onChange={handleFileUpload}
                                    />
                                    <div className="flex items-center gap-4 bg-twhite-100 py-2.5 px-3.5 rounded-full cursor-pointer">
                                        <Icon.Plus size={18} />
                                        <span className="text-sm">Add banner</span>
                                    </div>
                                </label>
                                : null
                    }
                </div>
                {details?.banner ?
                    <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                        <span
                            className="absolute top-2 right-2 text-white bg-white p-2 rounded-full"
                            onClick={() => setDetails({ ...details, banner: null })}
                        >
                            <TrashIcon className="" style={{ paddingLeft: '2px', color: "#FF0000" }} />
                        </span>
                    </span> : null
                }
            </section>

            <form id="update" onSubmit={handleUpdateGroupDetails} className="flex flex-col gap-5">
                <TextArea
                    label="Name"
                    placeholder="Enter your new group name"
                    rounded="rounded-lg"
                    value={details.title}
                    onChange={(event) => setFormattedDetailsContent(event.target.value, 'title', 50)}
                    limit={80}
                    limitPosition="top"
                    rows={1}
                    required
                />

                <TextArea
                    label="Description"
                    type="text"
                    rounded="rounded-lg"
                    placeholder='A short description of your group'
                    value={details.description}
                    onChange={(event) => setFormattedDetailsContent(event.target.value, 'description', 500)}
                    rows={4}
                    limit={500}
                    limitPosition="bottom"
                    required
                />
            </form>

            <footer className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
                <Button
                    children="Cancel"
                    variant="outline"
                    className="!border-error-500 !text-error-500"
                    fullWidth
                    onClick={onClose}
                />

                <Button
                    form="update"
                    children="Save"
                    className="!bg-[#272727] disabled:!bg-opacity-50"
                    fullWidth
                    disabled={isLoading}
                    isLoading={isLoading}
                />
            </footer>
        </main>
    )
}