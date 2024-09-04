function InTouchCard() {
  return (
    <div className="bg-white flex flex-col md:flex-row justify-between w-full gap-6 lg:gap-10 items-center rounded-2xl px-5 py-[30px] sm:p-8 border border-[#DDDDDD]">
      <div className="md:max-w-[68%]">
        <h2 className="text-xl font-bold text-[#101828] leading-[30px]">
          Still have questions?
        </h2>
        <p className="text-lg text-[#475467] pt-2">
          Can’t find the answer you’re looking for? Please chat to our friendly
          team.
        </p>
      </div>
      <button className="rounded-lg bg-[#0365A1] text-white text-base py-3 w-full md:w-fit px-5">
        Get in touch
      </button>
    </div>
  );
}

export default InTouchCard;
