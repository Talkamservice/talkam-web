import { JoinGroupCard } from "../../../components/global/joingroupcard"
import { PostCardVariants } from "../../../helpers/cardanimation"
import { motion } from "framer-motion"

export const SearchGroup = () => {
    return (
        <motion.div
            key="chatbox"
            variants={PostCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} 
            className="flex flex-col gap-4 py-3">
            <JoinGroupCard />
            <JoinGroupCard />
            <JoinGroupCard />
        </motion.div>
    )
}