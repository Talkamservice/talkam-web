import { useState } from "react";
import Container from "./components/container";
import { DropDownSelect } from "../../../components/forms/dropdown";
import { Input } from "../../../components/forms/input";
import { TextArea } from "../../../components/forms/textarea";
import addImg from "../../../assets/images/file-add.png";
import removeImg from "../../../assets/images/file-remove.png";
import { toast } from "sonner";
import { useGiveFeedbackMutation } from "../../../services/helpInfoSlice";

export const Feedback = () => {
  const [platform, setPlatform] = useState("");
  const [fullName, setFullName] = useState("");
  const [fullNameError, setFullNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [message, setMessage] = useState();
  const [messageError, setMessageError] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesMaxed, setFilesMaxed] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes

    // Calculate the total size of the current files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);

    if (
      selectedFile &&
      !files.some((f) => f.name === selectedFile.name) &&
      totalSize + selectedFile.size <= maxSize
    ) {
      setFiles((prevFiles) => [...prevFiles, selectedFile]);
    } else {
      // Set filled state to true if size limit is exceeded
      setFilesMaxed(true);
    }
  };

  const handleDeleteFile = (name) => {
    const newFiles = files.filter((f) => f.name !== name);
    setFiles(newFiles);
  };

  const platformOptions = [
    { id: 1, name: "desktop", value: "Desktop Web" },
    { id: 2, name: "mobile", value: "Mobile" },
  ];

  const [giveFeedback, { isLoading }] = useGiveFeedbackMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!platform) {
        toast.error("Platform is required");
      }
      if (!fullName) {
        setFullNameError(true);
      } else {
        setFullNameError(false);
      }
      if (!email) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
      if (!message) {
        setMessageError(true);
      } else {
        setMessageError(false);
      }

      if (platform && fullName && email && message) {
        const formData = new FormData();
        formData.append("name", fullName);
        formData.append("email", email);
        formData.append("platform", platform);
        formData.append("content", message);

        // Append each file in the files array
        files.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });

        await giveFeedback(formData).unwrap(); // Submit the feedback using the mutation
        toast.success("Feedback submitted successfully!");

        setFullName("");
        setEmail("");
        setPlatform("");
        setMessage("");
        setFiles([]);
      }
    } catch (error) {
      toast.error(`Failed to submit feedback, ${error?.data?.message}`);
      console.error("Failed to submit feedback", error);
    }
  };

  return (
    <Container>
      <div className="w-full mx-auto max-w-screen-md">
        <h2 className="text-[#101828] font-bold text-2xl sm:text-4xl text-center ">
          Feedback
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mt-6 mb-7 md:mb-12 bg-white w-full max-w-[624px] mx-auto rounded-lg p-4 sm:p-6 border space-y-5 border-[#DDDDDD]"
        >
          <DropDownSelect
            buttonStyles="!py-2 h-[44px]"
            label="Platform"
            defaultValue="Select platform"
            options={platformOptions}
            required
            onChange={(option) => setPlatform(option.name)}
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
            error={fullNameError}
            errorText={fullNameError ? "Fullname is required" : ""}
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
            error={emailError}
            errorText={emailError ? "Email is required" : ""}
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
            error={messageError}
            errorText={messageError ? "Message is required" : ""}
          />
          <div className={`transition duration-150 ease-in-out space-y-1`}>
            <header className="flex items-center justify-between gap-4">
              <h3 className="text-sm text-doc-gray4 font-normal">
                Attach files (optional)
              </h3>

              <p
                className={`${
                  filesMaxed ? "text-red-600" : "text-tgray-75"
                } text-xs`}
              >
                Maximum file size: 25 MB
              </p>
            </header>
            <>
              <div className="min-h-[44px] h-fit grid grid-cols-[86%_14%] sm:grid-cols-[90%_10%] border border-dashed border-tgray-50 text-tgray-250 rounded-md text-sm pl-3">
                <div className=" py-2 pr-2 flex gap-2 items-center justify-start flex-wrap h-fit min-h-full">
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-start items-center gap-2 border border-[#212121] rounded-[50px] pl-2 pr-1.5 py-1.5"
                      >
                        <p className="leading-[16px] text-[#212121] line-clamp-1">
                          {file.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.name)}
                        >
                          <img src={removeImg} alt="remove" className="w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>Attach an image of what you’re describing</p>
                  )}
                </div>

                <div className="relative overflow-hidden">
                  <label
                    htmlFor="exampleFiles"
                    className="cursor-pointer  border-l border-dashed border-tgray-50 flex items-center justify-center  h-fit min-h-full"
                  >
                    <img className="w-4" src={addImg} alt="add" />
                  </label>
                  <input
                    type="file"
                    id="exampleFiles"
                    accept=".jpg, .jpeg, .png, .pdf, .doc, .docx"
                    onChange={handleFileChange}
                    className="absolute top-0 left-0 opacity-0"
                  />
                </div>
              </div>
            </>
          </div>
          <button
            type="submit"
            className="bg-[#0365A1] text-center h-[44px] rounded-md text-white font-bold text-base px-3 w-full"
          >
            {isLoading ? "Submiting..." : "Submit"}
          </button>
        </form>
      </div>
    </Container>
  );
};
