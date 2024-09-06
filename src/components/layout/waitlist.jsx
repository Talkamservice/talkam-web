import { Link } from "react-router-dom";
import logo from "../../assets/images/waitlist-logo.png";
import sideImg from "../../assets/images/waitlist-side.svg";
import { Input } from "../forms/input";
import { useState } from "react";
import { toast } from "sonner";
import { useJoinWaitlistMutation } from "../../services/waitlistSlice";

export const WaitlistPage = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [joinWaitlist, { isLoading }] = useJoinWaitlistMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name) {
        setNameError(true);
      } else {
        setNameError(false);
      }
      if (!email) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }

      if (name && email) {
        const data = {
          name: name,
          email: email,
        };

        await joinWaitlist(data).unwrap(); // Submit the feedback using the mutation
        toast.success("You are on our waitlist!");
      }
    } catch (error) {
      toast.error("An error occured", error?.data?.message);
      console.error("Failed to Join Waitlist", error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex justify-center flex-col xl:flex-row *:xl:min-h-[500px] *:xl:h-screen">
      <div className="bg-white w-full xl:w-[50%] px-[5vw] h-fit  xl:px-[2vw] py-8 xl:py-7 no-scrollbar overflow-y-auto">
        <div className="w-full xl:max-w-[558px] mx-auto gap-10 flex flex-col justify-between items-start min-h-full">
          <Link to="/home">
            <img src={logo} alt="logo" className="w-[111px] sm:w-[127px]" />
          </Link>
          <div className="flex flex-col items-center justify-center max-w-[558px] mx-auto">
            <h2 className="text-[#000000] text-center font-bold text-3xl sm:text-[34px] sm:leading-[44px]">
              Join the waitlist and get early access.
            </h2>
            <p className="text-[#212121] text-lg text-center pt-1">
              Get notified when we launch.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-6 bg-white w-full max-w-[433px] mx-auto rounded-lg px-5 py-[30px] sm:px-6 sm:py-8 border space-y-5 border-[#DDDDDD]"
            >
              <Input
                type="text"
                label="Please tell us your name"
                rounded="rounded-[6px]"
                placeholder="Enter your name"
                onChange={(event) => setName(event.target.value)}
                value={name}
                height="h-[44px]"
                textSize="text-sm"
                error={nameError}
                errorText={nameError ? "Your name is required" : ""}
              />
              <Input
                type="email"
                label="Email Address"
                rounded="rounded-[6px]"
                placeholder="Enter your email address"
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                height="h-[44px]"
                textSize="text-sm"
                error={emailError}
                errorText={emailError ? "Your email is required" : ""}
              />

              <button
                type="submit"
                className="bg-[#0365A1] text-center h-[44px] rounded-md text-white font-bold text-base px-3 w-full"
              >
                {isLoading ? "Joining..." : "Join Waitlist"}
              </button>
              <p className="text-[#212121] text-center text-sm font-medium">
                By continuing, you consent to and agree to TalkAM’s{" "}
                <span className="font-bold text-[#0365A1]">
                  Privacy Policy.
                </span>
              </p>
            </form>
            <p className="text-[#212121] text-base sm:text-lg text-center mt-6 w-full max-w-[527px] mx-auto">
              Need a safe space to talk? TalkAM offers anonymous, non-judgmental
              support. Connect with others and find the understanding you
              deserve.
            </p>
          </div>
          <div className="border-t w-full border-[#D7D7D7] pt-5 hidden xl:flex justify-between flex-wrap gap-5 items-center *:text-sm *:text-[#212121] *:font-semibold">
            <Link to="">Copyright</Link>
            <Link to="/help&info/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="bg-[linear-gradient(180deg,#005783_0%,#00131D_100%)] no-scrollbar overflow-y-auto w-full h-fit xl:w-[50%] py-8 xl:py-7 px-[5vw] xl:px-[2vw] overflow-hidden">
        <div className="w-full  mx-auto xl:max-w-[558px] ">
          <div className="w-fit h-[38px] flex items-center justify-center ml-auto mb-6 xl:mb-0">
            <p className="text-base sm:text-xl text-[#1290CF]">
              What talkAm offers you
            </p>
          </div>
          <div className="w-full h-fit xl:h-[calc(100vh-94px)] xl:min-h-[650px] flex items-center justify-center">
            <img
              src={sideImg}
              alt="what we offer"
              className="w-full max-w-[546px] xl:max-h-[calc(100vh-94px)] xl:min-h-[600px] mx-auto xl:ml-auto"
            />
          </div>

          <div className="border-t w-full border-[#0C374D] pt-5 mt-10  flex xl:hidden justify-between flex-wrap gap-5 items-center *:text-sm *:text-white *:font-semibold">
            <Link to="">Copyright</Link>
            <Link to="/help&info/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
