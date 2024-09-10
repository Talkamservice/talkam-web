import { useState } from "react";
import Container from "./components/container";
import AccordionItem from "./components/accordionItem";
import FaqCards from "./components/faqCards";
import InTouchCard from "./components/inTouchCard";
import { useFaqQuestionsQuery } from "../../../services/helpInfoSlice";
import { ColoredLoader } from "../../../components/global/loader";
import { useParams } from "react-router-dom";

export const AccordionPage = () => {
  const { name } = useParams();

  //     {
  //       question: "Is there a subscription fee for talents on Prodevs?",
  //       answer:
  //         "No, there's no subscription fee for talents. ProDevs is free to join, and you only pay for optional premium features like ProDevsAI tools to enhance your chances of securing a job",
  //     },
  //     {
  //       question: "How frequently are new GIG’s posted?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "Can I showcase my portfolio on ProDev’s",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "How long does it take to get verified as a talent on ProDevs?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "What percentage does ProDevs charge on each gig or milestone?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question:
  //         "Can I use ProDevsAI tools if I'm not actively seeking gigs on the platform?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "How do I increase my chances of getting hired on ProDevs?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "Is there a limit to the number of jobs I can apply for?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question:
  //         "Can I receive payments directly from clients without going through ProDevs?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //     {
  //       question: "Are there any additional fees for using ProDevsAI tools?",
  //       answer:
  //         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut at commodi consectetur. In corrupti veniam, eveniet officiis ducimus, quis earum officia consequatur soluta quibusdam harum sed hic error doloremque quisquam eligendi! Eaque, tempora quibusdam! Velit!",
  //     },
  //   ];

  const [isOpen, setIsOpen] = useState([]);

  const { data: faqData, error, isLoading } = useFaqQuestionsQuery();

  if (isLoading)
    return (
      <Container>
        <div className="w-full flex justify-center items-center">
          <ColoredLoader />
        </div>
      </Container>
    );
  if (error) {
    throw new Error("An error occurred!");
  }

  return (
    <Container>
      <div className="text-center">
        <h2 className="font-semibold capitalize text-3xl md:text-4xl text-[#101828]">
          {name} FAQs
        </h2>
        <p className=" pt-3 md:pt-5 text-lg md:text-xl leading-[30px] text-[#475467]">
          Everything you need to know.
        </p>
      </div>
      <div className="w-full max-w-screen-md mx-auto mt-12 md:mt-[74px] xl:mt-[110px]">
        <div className="w-full mt-7 space-y-7 ">
          {faqData?.data
            ?.filter((item) => item.name.toLowerCase() === name.toLowerCase())
            .map((item, index) => (
              <AccordionItem
                key={index}
                index={index}
                isOpenArray={isOpen}
                setIsOpen={setIsOpen}
                question={item.question}
                answer={item.answer}
              />
            ))}
        </div>
      </div>
      <div className="mt-8 md:mt-12 xl:mt-[75px] border-t border-[#EAECF0] pt-9 md:pt-14 xl:pt-[95px]">
        <FaqCards />
      </div>
      <div className="mt-9 md:mt-14 xl:mt-[85px] mb-7 md:mb-12">
        <InTouchCard />
      </div>
    </Container>
  );
};
