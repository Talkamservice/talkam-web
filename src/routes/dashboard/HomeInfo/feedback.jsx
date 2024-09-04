import { useState } from "react";
import Container from "./components/container";
import { DropDownSelect } from "../../../components/forms/dropdown";
import { Input } from "../../../components/forms/input";
import { TextArea } from "../../../components/forms/textarea";

export const Feedback = () => {
  const [platform, setPlatform] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const platformOptions = [
    { id: 1, name: "desktop", value: "Desktop Web" },
    { id: 2, name: "mobile", value: "Mobile" },
  ];
  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl text-center ">
          Feedback
        </h2>
        <form className="mt-7 md:mt-8 xl:mt-[35px] mb-7 md:mb-12 bg-white w-full max-w-[624px] mx-auto rounded-lg p-4 sm:p-6 border space-y-5 border-[#DDDDDD]">
          <DropDownSelect
            buttonStyles="!py-2 h-[44px]"
            label="Platform"
            defaultValue="Select hours"
            options={platformOptions}
            required
            onChange={(option) => setPlatform(option)}
          />
          <Input
            type="text"
            label="Your Full Name"
            rounded="rounded-[6px]"
            placeholder="Enter your full name"
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
            required
            paddingX="px-3"
            height="h-[44px]"
            textSize="text-sm"
          />
          <Input
            type="email"
            label="Email Address"
            rounded="rounded-[6px]"
            placeholder="Enter your email address"
            onChange={(event) => setEmail(event.target.value)}
            value={email}
            required
            paddingX="px-3"
            height="h-[44px]"
            textSize="text-sm"
          />
          <TextArea
            type="text"
            textSize="text-sm"
            rounded="rounded-[6px]"
            placeholder="A sharp title for your post works best."
            label="Tell us what you have in mind"
            value={message}
            rows={2}
            limitPosition="top"
            limit={280}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            required
          />
          <div className={`transition duration-150 ease-in-out space-y-1`}>
            <header className="flex items-center justify-between gap-4">
              <h3 className="text-sm text-doc-gray4 font-normal">
                Attach files (optional)
              </h3>

              <p className={`text-tgray-75 text-xs`}>
                Maximum file size: 25 MB
              </p>
            </header>
            <>
              <div className="h-[44px] flex justify-start items-center border border-dashed border-tgray-50 text-tgray-250 rounded-md text-sm px-3">
                <p>Attach an image of what you’re describing</p>
              </div>
            </>
          </div>
          <button className="bg-[#0365A1] text-center h-[44px] rounded-md text-white font-bold text-base px-3 w-full">
            Submit
          </button>
        </form>
      </div>
    </Container>
  );
};
