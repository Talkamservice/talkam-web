import { useCallback, useState } from "react"
import { Button } from "../../../components/forms/button"
import { LockIcon, TrashIcon } from "../../../assets/icons/generated"
import { Input } from "../../../components/forms/input"
import { DropDownSelect } from "../../../components/forms/dropdown"
import { TextArea } from "../../../components/forms/textarea"
import { Modal } from "../../../components/global/modal"
import { AddRuleModal } from "./addrulemodal"
import { GroupRuleItem } from "../../../components/global/groupruleitem"
import { EmptyState } from "../../../components/global/emptystate"
import EmptyListIcon from "../../../assets/images/emptylist.png"
import * as Icon from 'react-feather'

const purposeLimit = 100
const InformationLimit = 500

export const CreateGroup = () => {

    const [ showModal, setShowModal ] = useState(false)
    const [ groupDetails, setGroupDetails ] = useState({
        banner: null,
        purpose: "",
        information: "",
        rulesSummary: "",
    });
    const [ rules, setRules ] = useState([]);

    const setFormattedDetailsContent = useCallback(
        (text, name, limit) => {
        setGroupDetails({...groupDetails, [name]: text?.slice(0, limit)});
        },
        [groupDetails, setGroupDetails]
    );
    const handleFileUpload = (event) => {
        event.preventDefault()
        const { files } = event.target;
        if(!files[0]) return;
        setGroupDetails({...groupDetails, banner: URL.createObjectURL(files[0])})
    };
    const handleRemoveRule = (id) => {
        const newRules = rules.filter((rule) => rule.id !== id);
        setRules(() => newRules)
    }
    const toggleModal = ()=> {
        setShowModal((prev) => !prev)
    }

    return (
        <main className="absolute top-0 left-0 bg-white z-[35] lg:z-[39] w-full h-full flex flex-col md:flex-row divide-x divide-tgray-50 overflow-auto no-scrollbar">
            <section className="hidden lg:block md:w-3/6" />

            <section className=" w-full md:w-11/12 md:overflow-auto no-scrollbar flex flex-col gap-2 py-3 px-6 md:pb-6">
                <header className="flex items-center justify-between gap-4 w-full">
                    <p className="text-lg font-bold text-tblack-100">Create new group</p>
                    <Button
                        children="Save and Publish"
                        className="!rounded-full !py-2.5 !px-3.5" 
                    />
                </header>
                <main className="flex flex-col gap-6">
                    <section className="relative">
                        <div
                            className="relative w-full overflow-hidden cursor-pointer min-h-[150px] max-h-[160px] border-tgray-200 rounded-sm flex items-center justify-center">
                            <img
                                className="border-none h-full w-full"
                                src={ groupDetails.banner ?? null}
                                style={{
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: "cover",
                                    objectFit: 'cover',
                                }}
                            />
                            {
                                !groupDetails.banner ?
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
                        { groupDetails.banner ? 
                            <span className="w-full h-full bg-[#000000] bg-opacity-10 absolute top-0 flex items-center justify-center m-auto cursor-pointer rounded-md">
                                <span className="absolute top-2 right-2 text-white bg-white p-2 rounded-full" onClick={() => setGroupDetails({...groupDetails, banner: null })}>
                                    <TrashIcon className=""  style={{paddingLeft: '2px', color:"#FF0000"}} />
                                </span>
                            </span> : null
                        }
                    </section>

                    <form className="flex flex-col gap-3 w-full md:w-3/5">
                        <Input 
                            label="Name"
                            placeholder="Enter your group name"
                            rounded="rounded-lg"
                            required
                        />
                        <DropDownSelect
                            label="Category"
                            node={<span className="p-2.5 rounded-full bg-[#1F96BC]" />}
                            defaultValue="Select category"
                            required
                        />
                        <TextArea
                            label="Group Purpose"
                            type="text"
                            rounded="rounded-lg"
                            placeholder = 'A short description of your group'
                            value={groupDetails?.purpose}
                            limit = {purposeLimit}
                            limitPosition="top"
                            rows={3}
                            onChange={(event) => setFormattedDetailsContent(event.target.value, 'purpose', purposeLimit)}
                            required
                        />
                        <TextArea
                            label="Group Information"
                            type="text"
                            rounded="rounded-lg"
                            placeholder = 'Any and all information for this group'
                            value={groupDetails?.information}
                            limit = {InformationLimit}
                            limitPosition="top"
                            rows={3}
                            onChange={(event) => setFormattedDetailsContent(event.target.value, 'information', InformationLimit)}
                            required
                        />

                        <div className="flex items-start gap-3">
                            <span className="border rounded-full p-2">
                                <LockIcon className="w-5 h-5" />
                            </span>
                            <DropDownSelect
                                label="Discoverability"
                                defaultValue="Public/Open to everyone"
                                required
                            />
                        </div>
                    </form>
                </main>
            </section>

            <section className="w-full flex flex-col gap-4 md:w-5/12 md:overflow-auto no-scrollbar py-3 px-6">
                <header className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-bold">Group Rules</h2>
                    <Button
                        children="Add Rule"
                        leftIcon={<Icon.Plus size={15} />}
                        variant="default"
                        className='!py-2 !px-3 border border-tgray-50 !rounded-full'
                        onClick={toggleModal}
                    />
                </header>

                <main className="flex flex-col gap-7">
                    <article className="text-sm font-normal">
                        You group can have up to 8 different rules.
                        Make your rules clear for healthy participation of all members
                    </article>

                    <TextArea
                        label="Rules Summary"
                        type="text"
                        rounded="rounded-lg"
                        placeholder = 'About the rules for this group'
                        value={groupDetails?.rulesSummary}
                        limit = {purposeLimit}
                        limitPosition="top"
                        rows={3}
                        onChange={(event) => setFormattedDetailsContent(event.target.value, 'rulesSummary', purposeLimit)}
                        required
                    />

                    <section className="flex flex-col gap-4">
                        {
                            !rules.length ?
                            <EmptyState
                                icon={EmptyListIcon}
                                height="h-[50px]"
                                width="h-[50px]"
                                text="No rules added yet"
                                subtext="When rules are added they would appear here"
                            />
                            :
                            rules?.map((rule, index) => (
                                <GroupRuleItem
                                    id={rule.id}
                                    key={rule.id}
                                    index={index + 1}
                                    rule={rule.ruleBody}
                                    description={rule.descriptionBody}
                                    handleRemoveRule={handleRemoveRule}
                                />
                            ))
                        }
                    </section>
                </main>
            </section> 

            <Modal
                show={showModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={toggleModal}
                position='center'
                contentWidth='w-full md:w-3/6'
            >
                <AddRuleModal
                    onClose={toggleModal}
                    rules={rules}
                    setRules={setRules}
                />
            </Modal>
        </main>
    )
}