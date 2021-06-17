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
import { useMediaQuery } from 'react-responsive';

import hawk from '../assets/hawk.png';
import ReadyToPlay from './ReadyToPlay';
import useClickOut from '../hooks/useClickOut';
import ReactCardFlip from 'react-card-flip';

type TParams = { id: string };

export default function Questions({
  match,
}: //@ts-ignore
RouteComponentProps<TParams>): ReactElement {
  const questionFetcher = useFetch(`/questions/${match.params.id}`);
  const [answer, setAnswer, resetAnswer] = useInputState();

  const isPhone = useMediaQuery({
    query: '(max-device-width: 800px)',
  });

  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();
  const answerRef = React.useRef<HTMLInputElement>(null);

  const [close, setClose] = React.useState(false);
  const [coin, setCoin] = React.useState({
    fliping: false,
    className: 'tails',
  });

  const [flipped, setFlipped] = React.useState(false);

  React.useEffect(() => {
    answerRef.current?.focus();

    return () => {
      auth?.setCurrentRegion('');
    };
  }, []);

  React.useEffect(() => {
    if (questionFetcher.isLoading) return;
    auth?.setCurrentRegion(questionFetcher.data.question.region.name);
  }, [questionFetcher.isLoading]);

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

      auth?.updateUser({
        ...auth.user,
        strikes: data.strikes,
      });

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

      if (
        questionFetcher.data.question.level ===
        parseInt(process.env.REACT_APP_LEVEL_COUNT || '6')
      ) {
        history.push('/');
        await auth?.fetchMe();
        addToast('New Region Unlocked', { appearance: 'success' });
        return;
      }

      addToast('Correct answer', { appearance: 'success' });
      questionFetcher.fetch();
      auth?.updateScore(data.score);
      resetAnswer();
    } catch (err) {
      auth?.check();
    }
  };

  if (!localStorage.getItem('hawk-ready')) {
    return <ReadyToPlay id={match.params.id} />;
  }

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
        strikes: res.strikes,
      });

      if (id === 4 && res.worked) {
        setCoin((prev) => ({ ...prev, fliping: true, className: 'heads' }));
        setTimeout(() => {
          setCoin((prev) => ({ ...prev, fliping: false }));
          if (
            questionFetcher.data.question.level ===
            parseInt(process.env.REACT_APP_LEVEL_COUNT || '6')
          ) {
            auth?.fetchMe().then((_: any) => {
              history.push('/');
              addToast('New Region Unlocked', { appearance: 'success' });
            });
            return;
          }
          addToast('Applied Successfully', { appearance: 'success' });
          questionFetcher.fetch(false);
        }, 5000);
        return;
      } else if (id === 4 && !res.worked) {
        setCoin((prev) => ({ ...prev, fliping: true, className: 'tails' }));
        setTimeout(() => {
          setCoin((prev) => ({ ...prev, fliping: false }));
          addToast('Better luck next time!', { appearance: 'error' });
        }, 5000);
        return;
      }

      if (res.success && id !== 4) {
        if (id === 1) {
          auth?.updateUser({
            ...auth.user,
            regions: auth?.user?.regions.map((region: any) =>
              region.regionid === match.params.id
                ? { ...region, multiplier: res.regionMultiplier }
                : region
            ),
            inventory: res.inventory,
            powerupsHistory: res.updatedShop,
          });
        }

        if (id === 2) {
          if (
            questionFetcher.data.question.level ===
            process.env.REACT_APP_LEVEL_COUNT
          ) {
            history.push('/');
            addToast('Applied Successfully', { appearance: 'success' });
            await auth?.fetchMe();
            addToast('New Region Unlocked', { appearance: 'success' });
            return;
          }
          questionFetcher.fetch(false);
          addToast('Applied Successfully', { appearance: 'success' });
        }
      } else if (!res.success) {
        // addToast('Something went wrong', { appearance: 'error' });
      }
    } catch (err: any) {
      addToast(err.response.data.message, { appearance: 'error' });
      // auth?.check();
    }
  };

  if (isPhone) {
    return (
      <div className="question question--phone">
        <HUD />
        <Img src={desktopBG} className="background" />
        <h1>HAWKEYE</h1>
        <div className="top-bar">
          <div className="region">
            <Link to="/">
              <i className="fas fa-chevron-left"></i>
            </Link>
            <p>{questionFetcher.data.question.region.name}</p>
            <i className="fas fa-map-marker-alt marker" style={{ color }}></i>
          </div>
          <div className="points">
            <span style={{ color }}>Reputation points : </span>{' '}
            {auth?.user?.score}
          </div>
        </div>
        <main>
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
          <ReactCardFlip isFlipped={flipped} flipDirection="horizontal">
            <Stats
              stats={questionFetcher.data.stats}
              attempts={questionFetcher.data.attempts}
              color={color}
              handleFlip={() => {
                setFlipped((prev) => !prev);
              }}
            />
            <Hints
              hints={questionFetcher.data.qhints.map(
                (hint: any) => hint.hintText
              )}
              color={color}
              handleFlip={() => {
                setFlipped((prev) => !prev);
              }}
            />
          </ReactCardFlip>
        </main>
        <BottomBar
          regionID={match.params.id}
          color={color}
          refresh={() => questionFetcher.fetch(false)}
          handleUsePowerUp={handleUsePowerUp}
        />
      </div>
    );
  }

  return (
    <div className="question">
      <HUD />
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <div className="top-bar">
        <div className="region">
          <Link to="/">
            <i className="fas fa-chevron-left"></i>
          </Link>
          <p>{questionFetcher.data.question.region.name}</p>
          <i className="fas fa-map-marker-alt marker" style={{ color }}></i>
        </div>
        <div className="points">
          <span style={{ color }}>Reputation points : </span>{' '}
          {auth?.user?.score}
        </div>
      </div>
      <main>
        <Hints
          hints={questionFetcher.data.qhints.map((hint: any) => hint.hintText)}
          color={color}
        />
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
        regionID={match.params.id}
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
  handleFlip?: () => void;
}

function Stats({
  attempts,
  stats,
  color,
  handleFlip,
}: IStatsProps): ReactElement {
  const [attemptsOpen, setAttemptsOpen] = React.useState(true);

  const percentage =
    (100 / (stats.leading + stats.lagging)) * stats.lagging || 0;

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  const auth = useAuth();

  return (
    <div className="data">
      {isPhone && (
        <div onClick={handleFlip ? handleFlip : () => {}} className="flip">
          <img
            // src={require(`../assets/flips/${auth?.region}.svg`).default}
            alt=""
          />
        </div>
      )}
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
              <i style={{ color }} className="fas fa-sort-up"></i>
            </div>
            <ReactTooltip effect="solid" type="light" />
          </div>
          <div className="bottom">
            <div className="card">
              <span style={{ color }}>
                {stats.lagging} <i className="fas fa-users"></i>
              </span>
              <h3>Lagging</h3>
            </div>
            <div className="card">
              <span style={{ color }}>
                {stats.atPar} <i className="fas fa-users"></i>
              </span>
              <h3>At Par</h3>
            </div>
            <div className="card">
              <span style={{ color }}>
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
function Hints({
  color,
  hints,
  handleFlip,
}: {
  color: string;
  hints: string[];
  handleFlip?: () => void;
}): ReactElement {
  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  const auth = useAuth();

  console.log(auth);

  return (
    <div className="hints">
      {isPhone && (
        <div onClick={handleFlip ? handleFlip : () => {}} className="flip">
          <img
            // src={require(`../assets/flips/${auth?.region}.svg`).default}
            alt=""
          />
        </div>
      )}
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
  regionID: string;
}

function BottomBar({
  handleUsePowerUp,
  refresh,
  color,
  regionID,
}: IBottomBarProps): ReactElement {
  const [selected, setSelected] = React.useState(0);
  const auth = useAuth();

  const data = auth?.user?.powerupsHistory || [];
  const hasPoweUps = data.filter((powerUp: any) => powerUp.owned).length > 0;

  const { confirmed, options } = useConfirm();

  const barRef = React.useRef<HTMLDivElement>(null);
  useClickOut(
    barRef,
    () => {},
    () => {
      setSelected(0);
    }
  );

  const handleClick = confirmed(() => {
    handleUsePowerUp(selected);
    refresh();
  }, `Do you want to use ${powerUps.find((powerUp) => powerUp.id === selected)?.name}`);

  const multiplier =
    auth?.user?.regions?.find((region) => region.regionid === regionID)
      ?.multiplier || 1;

  return (
    <>
      {(multiplier > 1 || !!auth?.user?.strikes) && (
        <div className="bar-details">
          {multiplier > 1 && (
            <div className="multi">
              <span style={{ color }}>Region Multiplier: </span> {multiplier}x
            </div>
          )}
          {!!auth?.user?.strikes && (
            <div className="streak">
              <span style={{ color }}>Strikes Left: </span>{' '}
              {auth?.user?.strikes}
            </div>
          )}
        </div>
      )}
      <div
        ref={barRef}
        className={!hasPoweUps ? 'bottom-bar empty-bar' : 'bottom-bar'}
      >
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
                      {
                        powerUps.find((powerUp) => powerUp.id === selected)
                          ?.name
                      }
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
    </>
  );
}
