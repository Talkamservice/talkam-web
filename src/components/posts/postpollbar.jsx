import { motion } from "framer-motion";
import * as Icon from 'react-feather'

export const PostPollBar = ({ color, option, selected, percentage, handlePollVote, id, selectedPoll }) => {
  const containerStyles = {
    height: 38,
    width: '100%',
    backgroundColor: "#FFF",
    borderRadius: 100,
    position: 'relative',
  };

  const fillerStyles = {
    height: '100%',
    backgroundColor: selectedPoll ? '#ccc' : color,
    borderRadius: 'inherit',
    textAlign: 'right',
  };

  const fillerVariants = {
    initial: { width: '0%' },
    animate: { width: `${percentage}%` }
  };

  const textVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  return (
    <div
      style={containerStyles}
      className={` ${selectedPoll ? "border border-[#D2D2D2]" : "border border-[#86AAEE]" }
        border border-[#86AAEE] ${ selectedPoll ? "cursor-default" : "cursor-pointer" } transition-all duration-700 ease-in-out overflow-hidden flex items-center
        ${selectedPoll ? "justify-between" : "justify-center"} px-3`
      }
      onClick={() => !selectedPoll && handlePollVote(id)}
    >
      {selectedPoll  ? (
        <motion.div
          style={fillerStyles}
          className="absolute inset-0 w-full flex items-center justify-between"
          initial="initial"
          animate="animate"
          variants={fillerVariants}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        ></motion.div>
      ) : null}
      <span className="z-[9] text-sm p-0 font-medium text-black px-1 flex items-center gap-2">{option}{ selected ? <Icon.CheckCircle color="#444444" size={15} /> : null }</span>
      {selectedPoll ? (
        <motion.span
          className="z-[9] text-sm p-0 font-medium text-black px-1"
          initial="initial"
          animate="animate"
          variants={textVariants}
          transition={{ duration: 0.5 }}
        >
          {`${percentage.toFixed(0)}%`}
        </motion.span>
      ) : null}
    </div>
  );
};
