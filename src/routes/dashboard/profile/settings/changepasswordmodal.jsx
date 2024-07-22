import { Button } from "../../../../components/forms/button";
import { Input } from "../../../../components/forms/input"

export const ChangePasswordModal = ({ onClose }) => {

    let isValidForm = false;

    return (
        <main className="flex flex-col gap-4 p-6">
            <header className="flex items-center justify-center">
                <p className="text-xl font-bold">Change Password</p>
            </header>

            <form className="flex flex-col gap-2">
            <Input 
                    type="password"
                    name="password"
                    label= "Enter new password"
                    placeholder ="Enter your New password..."
                />
                <Input 
                    type="password"
                    name="password"
                    label= "Confirm new password"
                    placeholder ="Enter your New password..."
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
                        variant="primary"
                        children="Save New Password"
                        fullWidth
                        disabled={!isValidForm}
                    />
                </section>
            </footer>
        </main>
    )
}