import useMediaQuery from "./useMediaQuery";

const useBreakpoints = () => {
  const toReturn = {
    lessOrEqualThan: {
      xSmall: useMediaQuery("(max-width: 575px)", true),
      small: useMediaQuery("(max-width: 767px)", true),
      medium: useMediaQuery("(max-width: 991px)", true),
      large: useMediaQuery("(max-width: 1199px)", true),
      xLarge: useMediaQuery("(max-width: 1399px)", true),
      xxLarge: true,
    },
    greaterOrEqualThan: {
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
      xSmall: toReturn.lessOrEqualThan.xSmall,
      small: toReturn.lessOrEqualThan.small && toReturn.greaterOrEqualThan.small,
      medium: toReturn.lessOrEqualThan.medium && toReturn.greaterOrEqualThan.medium,
      large: toReturn.lessOrEqualThan.large && toReturn.greaterOrEqualThan.large,
      xLarge: toReturn.lessOrEqualThan.xLarge && toReturn.greaterOrEqualThan.xLarge,
      xxLarge: toReturn.lessOrEqualThan.xxLarge && toReturn.greaterOrEqualThan.xxLarge,
    },
  };
};

export default useBreakpoints;
