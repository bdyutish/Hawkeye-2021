import React, { ReactElement } from "react";
import { get, post } from "../utils/requests";
import { Link, RouteComponentProps, useHistory } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";
import useInputState from "../hooks/useInputState";
import Img from "../components/Img";

import desktopBG from "../assets/backround/desktop.jpg";
import phoneBG from "../assets/backround/mobile.svg";

import ReactTooltip from "react-tooltip";
import Button from "../components/Button";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../context/AuthContext";
import HUD from "../components/HUD";
import { useConfirm } from "../hooks/useConfirm";
import Confirm from "../components/Confirm";
import { useMediaQuery } from "react-responsive";

import ReadyToPlay from "./ReadyToPlay";
import ReactCardFlip from "react-card-flip";
import { Redirect } from "react-router-dom";

import oneBG from "../assets/regions/question/1.png";
import twoBG from "../assets/regions/question/2.png";
import threeBG from "../assets/regions/question/3.png";
import fourBG from "../assets/regions/question/4.png";

const BACKGROUND_IMAGES: any = {
  Apocalypse: oneBG,
  Cyberpunk: twoBG,
  Solarpunk: threeBG,
  Cottagecore: fourBG,
};

type TParams = { id: string };

export default function Questions({
  match,
}: //@ts-ignore
RouteComponentProps<TParams>): ReactElement {
  const questionFetcher = useFetch(`/questions/${match.params.id}`);
  const [answer, setAnswer, resetAnswer] = useInputState();

  const isPhone = useMediaQuery({
    query: "(max-device-width: 800px)",
  });

  const { addToast } = useToasts();
  const history = useHistory();
  const auth = useAuth();
  const answerRef = React.useRef<HTMLInputElement>(null);

  const [close, setClose] = React.useState(false);
  const [flipped, setFlipped] = React.useState(false);

  React.useEffect(() => {
    answerRef.current?.focus();

    return () => {
      auth?.setCurrentRegion("");
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
        if (data.mesaage === "Region Already Completed") return;
        questionFetcher.fetch(false);

        if (data.close) {
          setClose(true);
          setTimeout(() => {
            setClose(false);
          }, 2500);
          resetAnswer();
          return;
        }

        addToast(data.message, { appearance: "error" });
        resetAnswer();
        return;
      }

      if (
        questionFetcher.data.question.level ===
        parseInt(process.env.REACT_APP_LEVEL_COUNT || "5")
      ) {
        await auth?.fetchMe();
        setTimeout(() => {
          history.push("/");
        }, 800);

        addToast("New Region Unlocked", { appearance: "success" });
        return;
      }

      addToast("Hawk approves", { appearance: "success" });
      questionFetcher.fetch();
      auth?.updateScore(data.score);
      resetAnswer();
    } catch (err) {
      // auth?.check();
    }
  };

  if (!localStorage.getItem("hawk-ready")) {
    return <ReadyToPlay id={match.params.id} />;
  }

  if (auth?.user?.hawksNest) {
    return <Redirect to="/" />;
  }

  if (questionFetcher.isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  const color = JSON.parse(
    questionFetcher.data.question.region.colorData
  ).color;

  if (isPhone) {
    return (
      <div className="question question--phone">
        <HUD />
        <Img
          src={BACKGROUND_IMAGES[questionFetcher.data.question.region.name]}
          className="background"
        />
        <h1>HAWKEYE</h1>
        <div className="top-bar">
          <div className="region">
            <Link to="/">
              <i className="fas fa-chevron-left"></i>
            </Link>
            <p>{questionFetcher.data.question.region.name}</p>
            <i className="fas fa-map-marker-alt marker" style={{ color }}></i>
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
      </div>
    );
  }

  return (
    <div className="question">
      <HUD />
      <Img
        src={BACKGROUND_IMAGES[questionFetcher.data.question.region.name]}
        className="background"
      />
      {/* <img src={hawkImg} alt="" className="hawk" id="hawkk" /> */}
      <h1>HAWKEYE</h1>
      <div className="top-bar">
        <div className="region">
          <Link to="/">
            <i className="fas fa-chevron-left"></i>
          </Link>
          <p>{questionFetcher.data.question.region.name}</p>
          <i className="fas fa-map-marker-alt marker" style={{ color }}></i>
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
    query: "(max-device-width: 800px)",
  });

  const auth = useAuth();

  return (
    <div className="data">
      {isPhone && (
        <div onClick={handleFlip ? handleFlip : () => {}} className="flip">
          <img
            src={(() => {
              try {
                return require(`../assets/flips/${auth?.region}.svg`).default;
              } catch (err) {
                return require(`../assets/flips/nest.png`).default;
              }
            })()}
            alt=""
          />
        </div>
      )}
      <div className="top">
        <h2
          className={attemptsOpen ? "active" : ""}
          onClick={() => setAttemptsOpen(true)}
          style={{ color }}
        >
          Attempts
        </h2>
        <h2
          className={!attemptsOpen ? "active" : ""}
          onClick={() => setAttemptsOpen(false)}
          style={{ color }}
        >
          Stats
        </h2>
      </div>
      {attemptsOpen && (
        <section className="attempts">
          {attempts.map((attempt: string) => {
            return (
              <div key={attempt} className="attempt">
                {attempt}
              </div>
            );
          })}
          {!attempts.length && (
            <h2 className="zero">Your attempts will show up here</h2>
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
                    stats.atPar > 1 ? "players" : "player"
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
            {/* <ReactTooltip effect="solid" type="light" /> */}
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
    query: "(max-device-width: 800px)",
  });

  const auth = useAuth();

  return (
    <div className="hints">
      {isPhone && (
        <div onClick={handleFlip ? handleFlip : () => {}} className="flip">
          <img
            src={(() => {
              try {
                return require(`../assets/flips/${auth?.region}.svg`).default;
              } catch (err) {
                return require(`../assets/flips/nest.png`).default;
              }
            })()}
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
              {/* <ReactTooltip effect="solid" type="light" /> */}
            </div>
          );
        })}
      </section>
    </div>
  );
}
