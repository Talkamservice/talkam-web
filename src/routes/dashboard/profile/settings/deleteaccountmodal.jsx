import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../../components/forms/button";
import { Input } from "../../../../components/forms/input"
import { TextArea } from "../../../../components/forms/textarea";
import { useForm } from "../../../../hooks/useForm";
import { isNotEmpty } from "../../../../utils/formValidations";
import { handleError } from "../../../../utils/handleError";
import { useDeleteAccountMutation } from "../../../../services/settingsApiSlice";

const repercussions = [
    "Your profile information, posts, photos, and videos will be permanently removed.",
    "All your messages and comments will be deleted.",
    "Once you delete your account, there is no way to recover any of your data.",
    "You will not be able to reactivate your account.",
    "Download your data before deleting your account if you wish to keep a record of your information."
]

export const DeleteAccountModal = ({ onClose }) => {

    let isValidForm = false;

    const [ reason, setReason ] = useState("");

    const {
        hasError: usernameHasError, inputBlurHandler: usernameBlurHandler,
        value: enteredUsername, valueChangeHandler: usernameChangeHandler,
        reset: resetUsername, isValid: usernameIsValid,
      } = useForm(isNotEmpty);
    
    const {
        hasError: passwordHasError, inputBlurHandler: passwordBlurHandler,
        value: passwordValue, valueChangeHandler: passwordChangeHandler,
        reset: resetPassword, isValid: passwordIsValid,
    } = useForm(isNotEmpty);

    const [ deleteAccount, { isLoading } ] = useDeleteAccountMutation();

    const handleDeleteAccount = async (event) => {
        event.preventDefault();
        try{
            const res = await deleteAccount(reason).unwrap();
            toast.success(res.message)
            onClose();
        } catch(error){
            const errorMessage = handleError(error);
            toast.error(errorMessage)
        }
        resetUsername();
        resetPassword();
    }

    if(usernameIsValid && passwordIsValid && isNotEmpty(reason)){
        isValidForm = true
    }

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="flex items-center justify-center flex-col gap-3">
                <p className="text-xl font-bold">Delete Account</p>
                <span className="text-base font-medium text-[#E85E51]">Warning: Account Deletion is Permanent</span>
            </header>

            <p className="text-sm text-[#475467]">
                You are about to permanently delete your TalkAM account. This action is irreversible, and all your data will be lost. Please read the following carefully:
            </p>
            <ul className="flex flex-col gap-2 px-8">
                {
                    repercussions.map((item, index) => (
                        <li className="list-disc text-sm text-[#475467]" key={index}>{item}</li>
                    ))
                }
            </ul>

            <form id="delete" onSubmit={handleDeleteAccount} className="flex flex-col gap-2">
                <Input
                    wrapperClassName='w-full'
                    type="text"
                    label='Enter your username'
                    placeholder="Your username"
                    onBlur={usernameBlurHandler}
                    onChange={usernameChangeHandler}
                    value={enteredUsername}
                    error={usernameHasError}
                    errorText={usernameHasError ? "Please enter your username" : ""}
                    required
                />
                <Input
                    wrapperClassName='relative w-full'
                    label='Enter your password'
                    placeholder='********'
                    type="password"
                    onBlur={passwordBlurHandler}
                    onChange={passwordChangeHandler}
                    value={passwordValue}
                    error={passwordHasError}
                    required
                    errorText={passwordHasError ? "Please enter your password" : ""}
                />
                <TextArea
                    label="Reason for leaving"
                    type="text"
                    rounded="rounded-lg"
                    placeholder = '(optional)'
                    rows={3}
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    required
                />
            </form>

            <footer className="w-full flex items-end justify-end">
                <section className="w-full md:w-2/3 flex items-center gap-4">
                    <Button
                        children="Cancel"
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                    />

                    <Button
                        form="delete"
                        variant="error"
                        children="Delete Account"
                        fullWidth
                        disabled={!isValidForm || isLoading}
                        isLoading={isLoading}
                    />
                </section>
            </footer>
        </main>
    )
}