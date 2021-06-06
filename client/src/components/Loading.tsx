import React, { ReactElement } from 'react';
import Lottie from 'react-lottie';
//@ts-ignore
import loading from '../assets/animations/loading.mp4';

interface Props {
  height?: number;
  width?: number;
}

export default function Loading({
  height = 1200,
  width = 1200,
}: Props): ReactElement {
  return (
    <div className="loading-page">
      <video width={width} height={height} playsInline autoPlay muted loop>
        <source src={loading} type="video/mp4" />
        Loading...
      </video>
    </div>
  );
}
