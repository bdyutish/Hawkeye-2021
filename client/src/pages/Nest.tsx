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
import desktopBG from '../assets/backround/desktop.png';

interface Props {}

export default function Nest({}: Props): ReactElement {
  const questionFetcher = useFetch(`/nest`);
  const [answer, setAnswer, resetAnswer] = useInputState();

  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();
    if (!answer) return;

    try {
      const data = await post(
        `questions/submit/${questionFetcher.data.question._id}`,
        {
          attempt: answer,
        }
      );

      if (!data.success) {
        questionFetcher.fetch(false);
        if (data.close) {
          //TODO
          resetAnswer();
          return;
        }
        addToast(data.message, { appearance: 'error' });
        resetAnswer();
        return;
      }

      if (questionFetcher.data.question.level === 6) {
        history.push('/');
        addToast('New Region Unlocked!', { appearance: 'success' });
        await auth?.fetchMe();
        return;
      }

      addToast('Correct answer', { appearance: 'success' });
      questionFetcher.fetch();
      resetAnswer();
    } catch (err) {
      auth?.check();
    }
  };

  if (questionFetcher.isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  if (!auth?.user?.hawksNest) {
    return (
      <div className="nest-illegal">
        <img src={hawk} alt="" />
        <h1>Hawk thinks you're not worthy</h1>
      </div>
    );
  }

  return (
    <div className="question question--nest">
      <HUD />
      <Img src={desktopBG} className="background" />
      <h1>Hawkeye</h1>
      <main>
        <Hints />
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
        </section>
      )}
    </div>
  );
}

function Hints(): ReactElement {
  return (
    <div className="hints">
      <h2>Hints</h2>
      <section>
        <div className="hint-locked">
          <i data-tip="Hint Locked" className="fas fa-lock"></i>
        </div>
        <div className="hint-locked">
          <i data-tip="Hint Locked" className="fas fa-lock"></i>
        </div>
        <div className="hint-locked">
          <i data-tip="Hint Locked" className="fas fa-lock"></i>
        </div>
        <ReactTooltip effect="solid" type="light" />
      </section>
    </div>
  );
}
