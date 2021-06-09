import React, { ReactElement } from 'react';
import { useAuth } from '../context/AuthContext';
import hawk from '../assets/hawk.png';
import useFetch from '../hooks/useFetch';
import { useToasts } from 'react-toast-notifications';
import { useHistory } from 'react-router-dom';
import useInputState from '../hooks/useInputState';
import Loading from '../components/Loading';
import { post } from '../utils/requests';
import { powerUps } from '../utils/data';
import ReactTooltip from 'react-tooltip';
import Button from '../components/Button';
import HUD from '../components/HUD';
import Img from '../components/Img';
import nestBG from '../assets/backround/nest.png';
//@ts-ignore
import Typewriter from 'typewriter-effect/dist/core';

interface Props {}

export default function Nest({}: Props): ReactElement {
  const questionFetcher = useFetch(`/nest`);
  const [answer, setAnswer, resetAnswer] = useInputState();
  const [welcome, setWelcome] = React.useState(() => {
    const bool = localStorage.getItem('welcome-to-nest');
    return bool !== 'true';
  });

  const { addToast } = useToasts();
  const auth = useAuth();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (!answer) return;

    try {
      const data = await post(
        `/nest/submit/${questionFetcher.data.question._id}`,
        {
          attempt: answer,
        }
      );

      if (!data.success) {
        questionFetcher.fetch(false);
        addToast(data.message, { appearance: 'error' });
        resetAnswer();
        return;
      }

      addToast('Correct answer', { appearance: 'success' });
      questionFetcher.fetch();
      resetAnswer();
    } catch (err) {
      auth?.check();
    }
  };

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  React.useEffect(() => {
    const typewriter = new Typewriter(headingRef.current, {
      loop: false,
    });

    typewriter
      .typeString("Welcome to the <span class='hawk-name'>Hawk</span>'s nest")
      .start()
      .pauseFor(500)
      .callFunction(() => {
        setWelcome(false);
        localStorage.setItem('welcome-to-nest', 'true');
      });
  }, []);

  if (welcome) {
    return (
      <div className="nest-welcome">
        <img src={hawk} alt="" />
        <h1 ref={headingRef}></h1>
      </div>
    );
  }

  if (questionFetcher.isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="question question--nest">
      <HUD />
      <Img src={nestBG} className="background" />
      <h1>Hawkeye</h1>
      <main>
        <Hints
          hints={questionFetcher.data.qhints.map((hint: any) => hint.hintText)}
        />
        <form className="answer" onSubmit={handleSubmit}>
          <div className="top">
            <h2>Level {questionFetcher.data.question.level}</h2>
            <p>{questionFetcher.data.question.text}</p>
          </div>
          <div className="bottom">
            <input type="text" value={answer} onChange={setAnswer} />
            <Button name="Submit" />
          </div>
        </form>
        <Stats
          stats={questionFetcher.data.stats}
          attempts={questionFetcher.data.nestAttempts}
        />
      </main>
    </div>
  );
}

interface IStatsProps {
  attempts: any[];
  stats: {
    atPar: number;
    leading: number;
    lagging: number;
  };
}

function Stats({ attempts, stats }: IStatsProps): ReactElement {
  const [attemptsOpen, setAttemptsOpen] = React.useState(true);

  const percentage =
    (100 / (stats.leading + stats.lagging)) * stats.lagging || 0;

  return (
    <div className="data">
      <div className="top">
        <h2
          className={attemptsOpen ? 'active' : ''}
          onClick={() => setAttemptsOpen(true)}
        >
          Attempts
        </h2>
        <h2
          className={!attemptsOpen ? 'active' : ''}
          onClick={() => setAttemptsOpen(false)}
        >
          Stats
        </h2>
      </div>
      {attemptsOpen && (
        <section className="attempts">
          {attempts.reverse().map((attempt: string) => {
            return (
              <div key={attempt} className="attempt">
                {attempt}
              </div>
            );
          })}
          {!attempts.length && (
            <h2 className="zero">You're attempts will show up here</h2>
          )}
        </section>
      )}
      {!attemptsOpen && (
        <section className="stats">
          <div className="graph">
            <div className="bar">
              <div
                style={{
                  transform: `translateX(${percentage}%)`,
                }}
                className="user"
              >
                <i
                  data-tip={`You are at par with ${stats.atPar} ${
                    stats.atPar > 1 ? 'players' : 'player'
                  }`}
                  className="fas fa-user"
                ></i>
              </div>
            </div>
            <div
              style={{
                transform: `translateX(${percentage}%)`,
              }}
              className="indicator"
            >
              <i className="fas fa-sort-up"></i>
            </div>
            <ReactTooltip effect="solid" type="light" />
          </div>
          <div className="bottom">
            <div className="card">
              <span style={{ color: '#5157E7' }}>
                {stats.lagging} <i className="fas fa-users"></i>
              </span>
              <h3>Lagging</h3>
            </div>
            <div className="card">
              <span style={{ color: '#5157E7' }}>
                {stats.atPar} <i className="fas fa-users"></i>
              </span>
              <h3>At Par</h3>
            </div>
            <div className="card">
              <span style={{ color: '#5157E7' }}>
                {stats.leading} <i className="fas fa-users"></i>
              </span>
              <h3>Leading</h3>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Hints({ hints }: { hints: string[] }): ReactElement {
  return (
    <div className="hints">
      <h2>Hints</h2>
      <section>
        {hints.map((hint: string) => {
          return <div className="hint-unlocked">{hint}</div>;
        })}

        {[...Array(3 - hints.length)].map((_: undefined) => {
          return (
            <div className="hint-locked">
              <i data-tip="Hint Locked" className="fas fa-lock"></i>
            </div>
          );
        })}

        <ReactTooltip effect="solid" type="light" />
      </section>
    </div>
  );
}
