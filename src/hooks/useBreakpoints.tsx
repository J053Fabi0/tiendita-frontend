import useMediaQuery from "./useMediaQuery";

const useBreakpoints = () => {
  const toReturn = {
    lessThan: {
      xSmall: useMediaQuery("(max-width: 575px)", true),
      small: useMediaQuery("(max-width: 767px)", true),
      medium: useMediaQuery("(max-width: 991px)", true),
      large: useMediaQuery("(max-width: 1199px)", true),
      xLarge: useMediaQuery("(max-width: 1399px)", true),
      xxLarge: true,
    },
    greaterThan: {
      xSmall: true,
      small: useMediaQuery("(min-width: 576px)", true),
      medium: useMediaQuery("(min-width: 768px)", true),
      large: useMediaQuery("(min-width: 992px)", true),
      xLarge: useMediaQuery("(min-width: 1200px)", true),
      xxLarge: useMediaQuery("(min-width: 1400px)", true),
    },
  };

  return {
    ...toReturn,
    on: {
      xSmall: toReturn.lessThan.xSmall,
      small: toReturn.lessThan.small && toReturn.greaterThan.small,
      medium: toReturn.lessThan.medium && toReturn.greaterThan.medium,
      large: toReturn.lessThan.large && toReturn.greaterThan.large,
      xLarge: toReturn.lessThan.xLarge && toReturn.greaterThan.xLarge,
      xxLarge: toReturn.lessThan.xxLarge && toReturn.greaterThan.xxLarge,
    },
  };
};

export default useBreakpoints;
