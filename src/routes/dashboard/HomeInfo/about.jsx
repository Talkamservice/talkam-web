import Container from "./components/container";
import logo from "../../../assets/images/logo-vector.png";
import phone from "../../../assets/images/talk-phone.png";
import apple from "../../../assets/images/astore.png";
import google from "../../../assets/images/gplay.png";

export const About = () => {
  return (
    <Container>
      <div className="!bg-[#1D1D1D] rounded-xl w-full max-w-[1101px] xl:h-[459px] overflow-hidden flex px-4">
        <div className="w-full xl:w-[50%] h-full flex justify-center items-center py-8 md:py-12">
          <img
            src={logo}
            alt="talkAM logo"
            className=" max-w-[218px] xl:max-w-[290px]"
          />
        </div>
        <div className="hidden xl:flex pt-[38px] pl-16">
          <img src={phone} alt="example" className="w-[376px] h-fit" />
        </div>
      </div>
      <div className="mt-10 mb-20">
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
