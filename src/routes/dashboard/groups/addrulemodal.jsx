import { useState } from "react"
import { Button } from "../../../components/forms/button"
import { Input } from "../../../components/forms/input"
import { TextArea } from "../../../components/forms/textarea"
import { randomId } from "../../../helpers/randomid"

export const AddRuleModal = ({  rules, setRules, onClose }) => {

    const [ ruleBody, setRuleBody ] = useState({
        id: randomId(),
        ruleBody: "",
        descriptionBody: "",
    })

    const handleSaveRule = (event) => {
        event.preventDefault();
        setRules(() => [ ruleBody, ...rules ])
        setRuleBody({
            id: randomId(),
            ruleBody: "",
            descriptionBody: "",
        })
        onClose();
    }

    let isValid = false;

    if(ruleBody.ruleBody){
        isValid = true
    }

    return (
        <main className="w-full flex flex-col gap-4 p-6 md:p-8">
            <header className="w-full flex items-start border-b border-tgray-50 ">
                <h4 className="text-lg font-boldNunito">Add Rule</h4>
            </header>

            <form id="rule" onSubmit={handleSaveRule}  className="flex flex-col gap-5">
                <Input
                    label="Name"
                    placeholder="Enter your group name"
                    rounded="rounded-lg"
                    value={ruleBody.ruleBody}
                    onChange={(event) => setRuleBody({ ...ruleBody, ruleBody: event.target.value })}
                    required
                />

                <TextArea
                    label="Description (optional)"
                    type="text"
                    rounded="rounded-lg"
                    placeholder = 'A short description of your group'
                    value={ruleBody.descriptionBody}
                    onChange={(event) => setRuleBody({...ruleBody, descriptionBody: event.target.value  })}
                    rows={4}
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
                    className="!bg-[#272727]"
                    fullWidth
                    disabled={!isValid}
                />
            </footer>
        </main>
    )
}