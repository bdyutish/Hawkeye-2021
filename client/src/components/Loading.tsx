import React, { ReactElement } from 'react';
import Lottie from 'react-lottie';
//@ts-ignore
import loading from '../assets/animations/loading.mp4';
import hawk from '../assets/hawk.png';
import { Circle } from 'react-spinners-css';

interface Props {
  height?: number;
  width?: number;
}

export default function Loading({
  height = 1920,
  width = 1080,
}: Props): ReactElement {
  React.useEffect(() => {
    //@ts-ignore
    // document.querySelector('video').playbackRate = 1.35;
  }, []);

  return (
    <div className="loading-page">
      {/* <video width={'100%'} height={'100%'} playsInline autoPlay muted loop> */}
      {/* <source src={loading} type="video/mp4" /> */}
      {/* RELACE THIS WITH IMAGE */}
      {/* </video> */}
      <div className="fallback">
        <img src={hawk} alt="" />
        <div className="loading-circle">
          <Circle color=" #5157E7" />
        </div>
      </div>
    </div>
  );
}
