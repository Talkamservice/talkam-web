import Container from "./components/container";
import InTouchCard from "./components/inTouchCard";

export const Faqs = () => {
  const faqData = [
    {
      title: "General",
      content:
        "Yes, you can try us for free for 30 days. Our friendly team will work with you to get you up and running as soon as possible.",
    },
    {
      title: "Posts, Media, and Polls",
      content:
        "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.",
    },
    {
      title: "TalkAM Rules Enforcement",
      content:
        "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.",
    },
    {
      title: "Groups and Moderation",
      content:
        "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name.",
    },
    {
      title: "Privacy & Security",
      content:
        "Plans are per workspace, not per account. You can upgrade one workspace, and still have any number of free workspaces.",
    },
    {
      title: "How do I change my account email?",
      content:
        "You can change the email address associated with your account by going to untitled.com/account from a laptop or desktop.",
    },
  ];

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
        <div className=" mt-9 md:mt-14 xl:mt-[85px] w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-x-8 sm:gap-y-10 lg:gap-y-16">
          {faqData.map((card, index) => (
            <div key={index}>
              <h2 className="text-[#101828] text-xl font-bold leading-[30px] pb-3">
                {card.title}
              </h2>
              <p className="text-base text-[#475467]">{card.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-9 md:mt-14 xl:mt-[85px] mb-5 md:mb-8">
          <InTouchCard />
        </div>
      </div>
    </Container>
  );
};
