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
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ease: "easeOut",
        duration: 0.4,
      },
    },
  };

  export const PostCardVariants = {
    initial: {
      opacity: 0.5,
      y: 80,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeInOut",
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0.3,
      transition: {
        ease: "easeOut",
        duration: 0.3,
      },
    },
  };

  export const downVariants = {
    initial: {
      opacity: 0.2,
      y: -30,
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
      opacity: 0.5,
      transition: {
        ease: "easeOut",
        duration: 0.5,
      },
    },
  };

  // const visible = { opacity: 1, y: 0, transition: { duration: 1, }};
  // export const downVariants = {
  //   hidden: { opacity: 0, y: 100 },
  //   visible
  // };