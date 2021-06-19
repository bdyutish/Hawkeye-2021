import React, { ReactElement, useEffect } from 'react';
import Button from '../components/Button';
import HUD from '../components/HUD';
import hawk from '../assets/hawk.png';
//@ts-ignore
import Typewriter from 'typewriter-effect/dist/core';
import { useHistory } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
//@ts-ignore
import loading from '../assets/animations/loading.mp4';

export default function Landing(): ReactElement {
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const histroy = useHistory();

  useEffect(() => {
    const typewriter = new Typewriter(headingRef.current, {
      loop: false,
    });

    typewriter
      .typeString('The <span class="hawk-name" >Hawk</span> has landed')
      .start()
      .pauseFor(500)
      .callFunction(() => {
        histroy.push(
          localStorage.getItem('hawk-ready') ? '/login' : '/register'
        );
      });

    return () => {
      localStorage.setItem('hawk-landing', 'true');
    };
  }, []);

  if (localStorage.getItem('hawk-landing')) {
    return (
      <Redirect
        to={localStorage.getItem('hawk-ready') ? '/login' : '/register'}
      />
    );
  }

  return (
    <div className="landing">
      <video width={'100%'} height={'100%'} playsInline autoPlay muted loop>
        <source src={loading} type="video/mp4" />
        <img className="hawk" src={hawk} alt="" />
      </video>
      <h1 ref={headingRef}></h1>
    </div>
  );
}
