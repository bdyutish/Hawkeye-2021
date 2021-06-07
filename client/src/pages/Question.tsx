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
import { useConfirm } from '../hooks/useConfirm';
import Confirm from '../components/Confirm';

import hawk from '../assets/hawk.png';

type TParams = { id: string };

export default function Questions({
  match,
}: RouteComponentProps<TParams>): ReactElement {
  const questionFetcher = useFetch(`/questions/${match.params.id}`);
  const [answer, setAnswer, resetAnswer] = useInputState();

  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();
  const answerRef = React.useRef<HTMLInputElement>(null);

  const [close, setClose] = React.useState(false);
  const [coin, setCoin] = React.useState({
    fliping: false,
    className: 'tails',
  });

  React.useEffect(() => {
    answerRef.current?.focus();
  }, []);

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
          setClose(true);
          setTimeout(() => {
            setClose(false);
          }, 2500);
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

  const color = JSON.parse(questionFetcher.data.question.region.colorData)
    .color;

  // console.log(questionFetcher.data);

  // console.log(JSON.parse(questionFetcher.data.question.region.colorData).color);

  const handleUsePowerUp = async (id: number) => {
    try {
      const res = await post(`/shop/apply/${id}`, {
        regionid: match.params.id,
        questionid: questionFetcher.data.question._id,
      });

      auth?.updateUser({
        ...auth.user,
        inventory: res.inventory,
        powerupsHistory: res.updatedShop,
      });

      if (id === 4 && res.success) {
        setCoin((prev) => ({ ...prev, fliping: true, className: 'heads' }));
        setTimeout(() => {
          setCoin((prev) => ({ ...prev, fliping: false }));
          addToast('Applied Successfully', { appearance: 'success' });
        }, 5000);
      } else if (id === 4 && !res.success) {
        setCoin((prev) => ({ ...prev, fliping: true, className: 'tails' }));
        setTimeout(() => {
          setCoin((prev) => ({ ...prev, fliping: false }));
          addToast('F', { appearance: 'error' });
        }, 5000);
      }

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
          <span style={{ color }}>Reputation points : </span>{' '}
          {auth?.user?.score}
        </div>
      </div>
      <main>
        <Hints hints={questionFetcher.data.qhints} color={color} />
        <form className="answer" onSubmit={handleSubmit}>
          <div className="top">
            <h2 style={{ color }}>
              Level {questionFetcher.data.question.level}
            </h2>
            <p>{questionFetcher.data.question.text}</p>
          </div>
          {close && (
            <div style={{ color }} className="close">
              Hawk thinks you're close
            </div>
          )}
          {coin.fliping && (
            <div id="coin" className={coin.className}>
              <div className="side-a">
                <img src={hawk} alt="" />
              </div>
              <div className="side-b"></div>
            </div>
          )}
          <div className="bottom">
            <input
              ref={answerRef}
              type="text"
              value={answer}
              onChange={setAnswer}
              style={{ color, borderBottom: `1px solid ${color}` }}
            />
            <Button name="Submit" />
          </div>
        </form>
        <Stats
          stats={questionFetcher.data.stats}
          attempts={questionFetcher.data.attempts}
          color={color}
        />
      </main>
      <BottomBar
        color={color}
        refresh={() => questionFetcher.fetch(false)}
        handleUsePowerUp={handleUsePowerUp}
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
  color: string;
}

function Stats({ attempts, stats, color }: IStatsProps): ReactElement {
  const [attemptsOpen, setAttemptsOpen] = React.useState(true);

  const percentage =
    (100 / (stats.leading + stats.lagging)) * stats.lagging || 0;

  return (
    <div className="data">
      <div className="top">
        <h2
          className={attemptsOpen ? 'active' : ''}
          onClick={() => setAttemptsOpen(true)}
          style={{ color }}
        >
          Attempts
        </h2>
        <h2
          className={!attemptsOpen ? 'active' : ''}
          onClick={() => setAttemptsOpen(false)}
          style={{ color }}
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
        </section>
      )}
    </div>
  );
}
function Hints({
  color,
  hints,
}: {
  color: string;
  hints: string[];
}): ReactElement {
  return (
    <div className="hints">
      <h2 style={{ color }}>Hints</h2>
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

interface IBottomBarProps {
  handleUsePowerUp: (id: number) => Promise<void>;
  refresh: () => any;
  color: string;
}

function BottomBar({
  handleUsePowerUp,
  refresh,
  color,
}: IBottomBarProps): ReactElement {
  const [selected, setSelected] = React.useState(0);
  const auth = useAuth();

  const data = auth?.user?.powerupsHistory || [];
  const hasPoweUps = data.filter((powerUp: any) => powerUp.owned).length > 0;

  const { confirmed, options } = useConfirm();

  const handleClick = confirmed(() => {
    handleUsePowerUp(selected);
    refresh();
  }, `Do you want to use ${powerUps.find((powerUp) => powerUp.id === selected)?.name}`);

  return (
    <div className={!hasPoweUps ? 'bottom-bar empty-bar' : 'bottom-bar'}>
      <Confirm options={options} />
      {!hasPoweUps && <h1 className="empty">You own no power ups</h1>}
      {hasPoweUps && (
        <>
          <aside>
            {data.map((powerUp: any, index: number) => {
              return powerUp.owned ? (
                <div
                  data-tip={powerUp.name}
                  onClick={() => setSelected(powerUp.id)}
                  key={powerUp._id}
                  style={{
                    border: `1px solid ${
                      selected === powerUp.id ? color : '#fff'
                    }`,
                  }}
                  className={
                    selected === powerUp.id
                      ? 'square square--selected'
                      : 'square'
                  }
                >
                  <img
                    className={`img-${powerUp.id}`}
                    src={powerUps[index].image}
                    alt=""
                  />
                </div>
              ) : null;
            })}
          </aside>
          <div className="right">
            {!selected && <div className="empty">Select a power up</div>}
            {!!selected && (
              <>
                <div className="details">
                  <div className="name">
                    {powerUps.find((powerUp) => powerUp.id === selected)?.name}
                  </div>
                  <div className="owned">
                    {' '}
                    <span style={{ color }}>Owned:</span>{' '}
                    {
                      auth?.user?.powerupsHistory?.find(
                        (powerUp) => powerUp.id === selected
                      ).owned
                    }
                  </div>
                </div>
                <Button onClick={handleClick} name="Use" />
              </>
            )}
          </div>{' '}
        </>
      )}
    </div>
  );
}
