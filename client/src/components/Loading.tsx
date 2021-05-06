import React, { ReactElement } from "react";
import Lottie from "react-lottie";
import animation from "../assets/animations/loading.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface Props {
  height?: number;
  width?: number;
}

export default function Loading({
  height = 200,
  width = 200,
}: Props): ReactElement {
  return (
    <div>
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
}
