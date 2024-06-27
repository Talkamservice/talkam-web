export const CardVariants = {
    initial: {
      opacity: 0,
      y: 100,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ease: "easeOut",
        duration: 0.2,
      },
    },
  };