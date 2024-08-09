import { Button } from "../../../components/forms/button"
import { TextArea } from "../../../components/forms/textarea"

export const AddRuleModal = ({ handleSaveRule, setFormattedRuleContent, onClose, isValid, ruleBody }) => {

    return (
        <main className="w-full flex flex-col gap-4 p-6 md:p-8">
            <header className="w-full flex items-start border-b border-tgray-50 ">
                <h4 className="text-lg font-boldNunito">Add Rule</h4>
            </header>

            <form id="rule" onSubmit={handleSaveRule} className="flex flex-col gap-5">
                <TextArea
                    label="Name"
                    placeholder="Enter your rule"
                    rounded="rounded-lg"
                    value={ruleBody?.title}
                    onChange={(event) => setFormattedRuleContent(event.target.value, 'title', 50)}
                    limit={80}
                    limitPosition="top"
                    rows={1}
                    required
                />

                <TextArea
                    label="Description"
                    type="text"
                    rounded="rounded-lg"
                    placeholder='A short description of your rule'
                    value={ruleBody?.description}
                    onChange={(event) => setFormattedRuleContent(event.target.value, 'description', 100)}
                    rows={4}
                    limit={100}
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
                    form="rule"
                    children="Save"
                    className="!bg-[#272727] disabled:!bg-opacity-50"
                    fullWidth
                    disabled={!isValid}
                />
            </footer>
        </main>
    )
}