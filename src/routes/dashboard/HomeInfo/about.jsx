import Container from "./components/container";
import logo from "../../../assets/images/logo-vector.png";
import phone from "../../../assets/images/talk-phone3.png";
import apple from "../../../assets/images/astore.png";
import google from "../../../assets/images/gplay.png";
import sideImg from "../../../assets/images/waitlist-side.svg";
import sideImg2 from "../../../assets/images/about-offers.png";

export const About = () => {
  return (
    <Container>
      <div className="!bg-[#1D1D1D] rounded-xl w-full max-w-[1101px] xl:h-[459px] overflow-hidden flex px-5 md:px-7 xl:px-10">
        <div className="w-full xl:w-[50%] h-full flex justify-center items-center py-5 md:py-7 xl:py-10">
          <p className="text-base xl:text-lg text-white">
            TalkAM is a vibrant online community where you can freely express
            yourself, engage in meaningful discussions, and drive positive
            social change. Join a global network of like-minded individuals
            passionate about human rights, social justice, and global issues.
            <br />
            <br />
            Discover a wealth of knowledge, share your perspectives, and connect
            with people from all walks of life. Whether you're interested in the
            latest news, seeking support, or simply looking to connect with
            others, TalkAM has something for everyone
          </p>
        </div>
        <div className="hidden xl:flex pt-[38px] pl-16">
          <img src={phone} alt="example" className="w-[346px] h-fit" />
        </div>
      </div>
      <div
        style={{
          background: "linear-gradient(180deg, #005783 0%, #00131D 100%)",
        }}
        className="rounded-[12px] mt-8 sm:mt-10 p-5 md:px-7 md:py-10 xl:px-10 xl:py-14"
      >
        <h2 className="text-lg sm:text-xl text-[#1290CF] mb-2 sm:mb-3 mx-auto text-center">
          What talkAm offers you
        </h2>
        <p className="text-base sm:text-lg max-w-[702px] mx-auto text-white text-center">
          Need a safe space to talk? TalkAM offers anonymous, non-judgmental
          support. Connect with others and find the understanding you deserve.
        </p>
        <div className="w-full h-fit mt-2 sm:mt-4 flex items-center justify-center">
          <img
            src={sideImg}
            alt="what we offer"
            className="w-full max-w-[546px] sm:hidden"
          />
          <img
            src={sideImg2}
            alt="what we offer"
            className="w-full max-w-[918px] mx-auto hidden sm:inline-block"
          />
        </div>
      </div>
      <div className="mt-10 sm:mt-14 mb-5 sm:mb-10">
        <h2 className="text-[#212121] text-xl text-center font-bold pb-5 ">
          Get the App
        </h2>
        <div className=" *:w-[160px] gap-4 *:sm:w-[180px] flex justify-center items-center sm:gap-5">
          <a href="http://" target="_blank" rel="noopener noreferrer">
            <img src={apple} alt="appstore" />
          </a>
          <a href="http://" target="_blank" rel="noopener noreferrer">
            <img src={google} alt="playstore" />
          </a>
        </div>
      </div>
    </Container>
  );
};
