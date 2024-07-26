import { useState } from "react";
import { Button } from "../../../../components/forms/button";
import { Input } from "../../../../components/forms/input"
import { useForm } from "../../../../hooks/useForm";
import { confirmPasswordMatches, isNotEmpty, passwordMatcher } from "../../../../utils/formValidations";
import { useUpdateProfileMutation } from "../../../../services/userApiSlice";
import { toast } from "sonner";
import { handleError } from "../../../../utils/handleError";

export const ChangePasswordModal = ({ onClose }) => {

    const [touched, setTouched] = useState(false);

    const {
        value: enteredPassword,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        reset: resetEnteredPassword,
    } = useForm(isNotEmpty)
    
    const {
        value: enteredConfirmPassword,
        valueChangeHandler: confirmPasswordChangeHandler,
        inputBlurHandler: confirmPasswordBlurHandler,
        isValid: confirmPasswordIsValid,
        reset: resetConfirmPassword,
    } = useForm(confirmPasswordMatches(enteredPassword));

    const [ updateProfile, { isLoading } ] = useUpdateProfileMutation();

    const handleSubmit = async(event) => {
        event?.preventDefault()
        try {
            const passwordData = {
                password: enteredPassword,
                password_confirmation: enteredConfirmPassword,
            }
            const res = await updateProfile({ ...passwordData }).unwrap()
            toast.success(res?.message);
            onClose();
        } catch(err){
            setTouched(() => false)
            const errorMessage = handleError(err);
            toast.error(errorMessage)
        };
        resetEnteredPassword()
        resetConfirmPassword()
    }
    let isValidForm = passwordMatcher(enteredPassword, enteredConfirmPassword)


    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="flex items-center justify-center">
                <p className="text-xl font-bold">Change Password</p>
            </header>

            <form id="password" onSubmit={handleSubmit} className='flex items-center justify-center flex-col gap-3 w-full'>
                <Input
                    wrapperClassName='relative w-full'
                    placeholder="**************"
                    label='Enter new password'
                    required
                    type='password'
                    value={enteredPassword}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                    error={passwordHasError}
                    errorText= {passwordHasError ? "Password Must contain at least a number, an upperCase character and a special character (!, @, #, $, %, &, *)" : null }
                />

                <Input
                    onFocus={() => {
                        setTimeout(() => {
                            setTouched(true);
                        }, 3000)
                        }}
                    wrapperClassName='relative w-full'
                    placeholder="**************"
                    label='Confirm new password'
                    required
                    value={enteredConfirmPassword}
                    onChange={confirmPasswordChangeHandler}
                    onBlur={confirmPasswordBlurHandler}
                    error={touched && !confirmPasswordIsValid}
                    errorText={touched && !confirmPasswordIsValid ? "Passwords do not match" : null}
                    type='password'
                />
            </form>

            <footer className="w-full flex items-end justify-end">
                <section className="w-full lg:w-2/3 flex items-center gap-4">
                    <Button
                        children="Cancel"
                        variant="outline"
                        fullWidth
                        onClick={onClose}
                    />

                    <Button
                        form="password"
                        variant="primary"
                        children="Save New Password"
                        fullWidth
                        disabled={!isValidForm || isLoading}
                        isLoading={isLoading}
                    />
                </section>
            </footer>
        </main>
    )
}