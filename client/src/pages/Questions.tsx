import React, { ReactElement } from 'react';
import { get, post } from '../utils/requests';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading';
import useInputState from '../hooks/useInputState';
import Img from '../components/Img';

import desktopBG from '../assets/backround/desktop.png';
import ReactTooltip from 'react-tooltip';
import Button from '../components/Button';
import { useToasts } from 'react-toast-notifications';
import { useAuth } from '../context/AuthContext';
import HUD from '../components/HUD';
import { powerUps } from '../utils/data';

type TParams = { id: string };

export default function Questions({
  match,
}: RouteComponentProps<TParams>): ReactElement {
  const questionFetcher = useFetch(`/questions/${match.params.id}`);
  const [answer, setAnswer, resetAnswer] = useInputState();
  const inventoryFetcher = useFetch(`/shop/inventory`);

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

  if (questionFetcher.isLoading || inventoryFetcher.isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  // console.log(questionFetcher.data);

  // console.log(JSON.parse(questionFetcher.data.question.region.colorData).color);

  const handleUsePowerUp = async (id: number) => {
    try {
      const res = await post(`/shop/apply/${id}`, {
        regionid: match.params.id,
        questionid: questionFetcher.data.question._id,
      });

      if (res.success) {
        addToast('Applied Successfully', { appearance: 'success' });
      } else {
        addToast('Something went wrong', { appearance: 'error' });
      }
    } catch (err) {
      auth?.check();
    }
  };

  return (
    <div className="question">
      <HUD />
      <Img src={desktopBG} className="background" />
      <h1>Hawkeye</h1>
      <div className="top-bar">
        <div className="region">
          <Link to="/">
            <i className="fas fa-chevron-left"></i>
          </Link>
          <p>{questionFetcher.data.question.region.name}</p>
          <i className="fas fa-map-marker-alt marker"></i>
        </div>
        <div className="points">
          <span>Reputation points : </span> {auth?.user?.score}
        </div>
      </div>
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
          attempts={questionFetcher.data.attempts}
        />
      </main>
      <BottomBar
        refresh={() => questionFetcher.fetch(false)}
        handleUsePowerUp={handleUsePowerUp}
        data={inventoryFetcher.data}
      />
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

interface IBottomBarProps {
  data: any[];
  handleUsePowerUp: (id: number) => Promise<void>;
  refresh: () => any;
}

function BottomBar({
  data,
  handleUsePowerUp,
  refresh,
}: IBottomBarProps): ReactElement {
  const [selected, setSelected] = React.useState(0);

  const hasPoweUps = data.filter((powerUp: any) => powerUp.owned).length > 0;

  const handleClick = () => {
    handleUsePowerUp(selected);
    refresh();
  };

  return (
    <div className={!hasPoweUps ? 'bottom-bar empty-bar' : 'bottom-bar'}>
      {!hasPoweUps && <h1 className="empty">You own no power ups</h1>}
      {hasPoweUps && (
        <>
          <aside>
            {data.map((powerUp: any, index: number) => {
              return powerUp.owned ? (
                <div
                  onClick={() => setSelected(powerUp.id)}
                  key={powerUp._id}
                  className={
                    selected === powerUp.id
                      ? 'square square--selected'
                      : 'square'
                  }
                >
                  <img src={powerUps[index].image} alt="" />
                </div>
              ) : null;
            })}
          </aside>
          <div className="right">
            <Button onClick={handleClick} name="Use" />
          </div>{' '}
        </>
      )}
    </div>
  );
}
