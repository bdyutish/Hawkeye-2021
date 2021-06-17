import React, { ReactElement } from 'react';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import useInputState from '../hooks/useInputState';
import Img from '../components/Img';
import desktopBG from '../assets/backround/desktop.svg';
import phoneBG from '../assets/backround/mobile.svg';
import Button from '../components/Button';
import { useMediaQuery } from 'react-responsive';

type TProps = { id: string };

export default function ReadyToPlay({ id }: TProps): ReactElement {
  const [answer, setAnswer, resetAnswer] = useInputState();
  const history = useHistory();

  function handleClick(): any {
    localStorage.setItem('hawk-ready', '1');
  }

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  return (
    <div className="question question--ready">
      <Img src={isPhone ? phoneBG : desktopBG} className="background" />
      <h1>Hawkeye</h1>
      <main className="mainr">
        <form className="answer">
          <div className="top">
            <h2>Level 0</h2>
            <p>Are you ready?</p>
          </div>
          <div className="bottomr">
            <Button
              name="Yes"
              pathname={`/question/${id}`}
              onClick={handleClick}
            />
            <Button
              onClick={() => {
                history.push('/');
              }}
              name="No"
            />
          </div>
        </form>
      </main>
    </div>
  );
}
