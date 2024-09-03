import { Link } from "react-router-dom";

function FaqCards() {
  const faqData = [
    {
      link: "general",
      title: "General",
      content:
        "Yes, you can try us for free for 30 days. Our friendly team will work with you to get you up and running as soon as possible.",
    },
    {
      link: "general",
      title: "Posts, Media, and Polls",
      content:
        "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you.",
    },
    {
      link: "general",
      title: "TalkAM Rules Enforcement",
      content:
        "We understand that things change. You can cancel your plan at any time and we’ll refund you the difference already paid.",
    },
    {
      link: "general",
      title: "Groups and Moderation",
      content:
        "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name.",
    },
    {
      link: "general",
      title: "Privacy & Security",
      content:
        "Plans are per workspace, not per account. You can upgrade one workspace, and still have any number of free workspaces.",
    },
    {
      link: "general",
      title: "How do I change my account email?",
      content:
        "You can change the email address associated with your account by going to untitled.com/account from a laptop or desktop.",
    },
  ];
  return (
    <div className="  w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-x-8 sm:gap-y-10 lg:gap-y-16">
      {faqData.map((card, index) => (
        <Link to={card.link} key={index}>
          <h2 className="text-[#101828] text-xl font-bold leading-[30px] pb-3">
            {card.title}
          </h2>
          <p className="text-base text-[#475467]">{card.content}</p>
        </Link>
      ))}
    </div>
  );
}

export default FaqCards;
