import { ColorRing } from "react-loader-spinner"
import { useMediaQuery } from "../../hooks/useMediaQuery";

export const Loader = () => {

  let isMonitor = useMediaQuery("(min-width: 2560px)");

    return (
        <ColorRing
          colors={["#FFF", "#FFF", "#FFF", "#FFF", "#FFF"]}
          ariaLabel="blocks-loading"
          animationDuration="0.75"
          width={isMonitor ? 40 : 20}
          height={isMonitor ? 40 : 20}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
    )
}

export const ColoredLoader = () => {

  let isMonitor = useMediaQuery("(min-width: 2560px)");

    return (
        <ColorRing
          colors={["#0365A1", "#0365A1", "#0365A1", "#0365A1", "#0365A1"]}
          ariaLabel="blocks-loading"
          animationDuration="0.75"
          width={isMonitor ? 40 : 20}
          height={isMonitor ? 40 : 20}
          wrapperClass="blocks-wrapper"
          visible={true}
        />
    )
}