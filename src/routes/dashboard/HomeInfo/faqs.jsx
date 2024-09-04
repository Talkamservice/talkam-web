import Container from "./components/container";
import FaqCards from "./components/faqCards";
import InTouchCard from "./components/inTouchCard";

export const Faqs = () => {
  

  return (
    <Container>
      <div>
        <div>
          {" "}
          <h1 className="font-bold text-3xl md:text-4xl min-[850px]:text-[42px] lg:text-5xl text-[#101828] ">
            FAQs
          </h1>
          <p className="text-[#475467] pt-3 md:pt-5 lg:pt-5 text-lg min-[850px]:text-xl  md:leading-[30px] max-w-screen-md">
            Everything you need to know about the{" "}
            <span className="font-semibold">TalkAM</span> Can’t find the answer
            you’re looking for? Please{" "}
            <span className="underline">
              <a href="http://" target="_blank" rel="noopener noreferrer">
                chat to our friendly team.
              </a>
            </span>
          </p>
        </div>
        <div className="mt-9 md:mt-14 xl:mt-[85px]">
          <FaqCards />
        </div>
        <div className="mt-9 md:mt-14 xl:mt-[85px] mb-7 md:mb-12">
          <InTouchCard />
        </div>
      </div>
    </Container>
  );
};
