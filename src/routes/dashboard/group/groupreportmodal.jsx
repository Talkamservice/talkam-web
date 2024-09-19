import { Button } from "../../../components/forms/button";
import { CustomRadio } from "../../../components/forms/customradio";
import { Modal } from "../../../components/global/modal";


const reportSchema = [
    "Spam", "Pornography", "Hatred and Bullying",
    "Gory or harmful content", "Child abuse", "Deceptive content",
    "Illegal activities (eg, drug use)", "Self Promotion", "Copyright & trademark infringement"
];

const reportMap = {
    "Spam": "We take action based on our guidelines against impersonation or falsifying information with the intention to deceive.",
    "Pornography": "We do not allow pornographic contents and would take it down as soon as reported",
}

export const GroupReportModal = ({ onClose, checkedValue, setCheckedValue, confirmationModal, setConfirmationModal, handleReport, isLoading }) => {

    const checkBoxHandler = (event) => {
        setCheckedValue(event.target.value)
    };

    const handleConfirmationModal = () => {
        setConfirmationModal((prev) => !prev)
    }

    return (
        <main className="flex flex-col gap-4 py-8">
            <header className="flex items-center flex-col gap-3 px-6">
                <p className="text-xl font-bold">Submit a report</p>
                <span className="text-base">If you report someone, TalkAM doesn&apos;t tell them who file a report against them.</span>
            </header>

            <section className="flex flex-col divide-y divide-tgray-light">
                {
                    reportSchema.map((report, index) => (
                        <CustomRadio
                            key={index}
                            checkBoxHandler={checkBoxHandler}
                            name="report"
                            label={report}
                            value={report}
                            checked={checkedValue === report}
                        />
                    ))
                }
            </section>
            {/* {
                checkedValue ?
                    <section className="text-left flex flex-col gap-2 px-6">
                        <p className="text-base font-bold">Report for {checkedValue}</p>
                        <p className="text-base font-normal">{reportMap[checkedValue]}</p>
                    </section>
                    :
                    null
            } */}
            <footer className="w-full flex items-end justify-end px-6">
                <section className="w-full md:w-2/3 flex items-center gap-4">
                    <Button
                        children="Cancel"
                        variant="outline"
                        className="!border-error-500 !text-error-500"
                        fullWidth
                        onClick={onClose}
                    />

                    <Button
                        children="Report"
                        className="!bg-[#272727] disabled:!bg-opacity-40"
                        fullWidth
                        disabled={!checkedValue || isLoading}
                        onClick={handleReport}
                        isLoading={isLoading}
                    />
                </section>
            </footer>
            <Modal
                show={confirmationModal}
                shouldCloseOnEscPress={false}
                shouldCloseOnOverlayClick={false}
                onClose={handleConfirmationModal}
                position='center'
                contentWidth='w-full md:w-3/5 lg:w-2/5'
            >
                <div className="flex flex-col items-center gap-8 p-4 md:p-12">
                    <p className="text-xl font-bold text-center">We&apos;ve received your report</p>
                    <section className="flex flex-col items-center justify-center text-center gap-8 text-base">
                        <p>We take action based on our guidelines against impersonation or falsifying information with the intention to deceive.</p>
                        <p>If you report someone, TalkAM doesn&apos;t tell them who file a report against them.</p>
                    </section>
                    <Button
                        variant="primary"
                        children="Done"
                        className="!bg-[#272727] disabled:!bg-opacity-40 !px-20"
                        onClick={onClose}
                    />
                </div>
            </Modal>
        </main>
    )
}