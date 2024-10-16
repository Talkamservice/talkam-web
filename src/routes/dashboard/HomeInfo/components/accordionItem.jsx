import openImage from "../../../../assets/images/acc-plus.png";
import closeImage from "../../../../assets/images/acc-minus.png";

function AccordionItem({ index, isOpenArray, setIsOpen, question, answer }) {


  function handleClick(index) {
    if (isOpenArray.includes(index)) {
      setIsOpen((opens) => opens.filter((num) => num !== index));
    } else {
      setIsOpen((opened) => [...opened, index]);
    }
  }
  return (
    <div className="pb-7 md:pb-8 border-b-[0.5px] last:border-none border-[#EAECF0]">
      <div
        className="flex cursor-pointer justify-between items-center"
        onClick={() => handleClick(index)}
      >
        <h2 className="text-[#040A33] w-[80%] font-bold text-base md:text-lg md:leading-[26px]  ">
          {question}
        </h2>
        <img
          src={isOpenArray.includes(index) ? closeImage : openImage}
          alt="open or close"
          className={`w-6 `}
        />
      </div>
      <div
        className={`transition-all grid  ease-in-out duration-500 ${
          isOpenArray.includes(index)
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p
            className="text-[#555973] text-base md:text-lg mt-7 md:leading-[26px]   "
            dangerouslySetInnerHTML={{ __html: answer }}
          ></p>
        </div>
      </div>
    </div>
  );
}

export default AccordionItem;
