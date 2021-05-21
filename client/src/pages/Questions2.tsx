import { stat } from "fs";
import React, { ReactElement, useEffect, useState } from "react";
import desktopBG from "../assets/backround/desktop.png";
import Img from "../components/Img";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import useInputState from "../hooks/useInputState";
import { get, post } from "../utils/requests";
import buttonImage from "../assets/button.png";
import Confetti from "react-confetti";

import {
  Nullable,
  QuestionType,
  RegionType,
  StatsType,
  User,
} from "../utils/types";
import Button from "../components/Button";
import { RouteComponentProps, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
type TParams = { id: string };
export default function Home({
  match,
}: RouteComponentProps<TParams>): ReactElement {
  const [leftTab, setleftTab] = useState<boolean>(true);
  const [question, setQuestion] = useState<Nullable<QuestionType> | any>();
  const [hints, setHints] = useState<Array<string>>([]);
  const [attempts, setAttempts] = useState<Array<string>>([]);
  const [stats, setStats] = useState<Nullable<StatsType> | any>();
  const [answer, setAnswer] = useState<string>("");
  const [replyText, setreplyText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();
  const { addToast } = useToasts();

  const fetchQuestion = async () => {
    try {
      await get(`/questions/${match.params.id}`).then((data) => {
        console.log(data);
        setQuestion(data.question);
        if (data.attempts) setAttempts(data.attempts);
        else setAttempts([]);
        console.log(data.question.hints);
        setHints(data.question.hints);
        setStats(data.stats);
        setLoading(false);
      });
    } catch (err) {
      console.log(err.response);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchQuestion();
      } catch (err) {
        setLoading(false);
      }
    })();
    return () => {
      setQuestion({});
    };
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    event.preventDefault();

    if (!answer) return;

    try {
      const data = await post(`questions/submit/${question._id}`, {
        attempt: answer,
      }).then((data) => {
        if (data.success === false) {
          addToast("Inorrect Answer", { appearance: "error" });
          setreplyText(data.message);
          setTimeout(() => {
            setreplyText("");
          }, 3000);
          fetchQuestion();
        } else {
          if (question.level === 6) {
            addToast("New Region Unlocked", { appearance: "success" });
            setreplyText("New Region Unlocked!");
            setTimeout(() => {
              history.push("/");
            }, 3000);
          } else setreplyText("Correct Answer");
          addToast("Correct Answer", { appearance: "success" });
          setTimeout(() => {
            fetchQuestion();
            setAnswer("");
            setreplyText("");
          }, 3000);
        }
      });

      // if (!data.success) {
      //   setreplyText(data.message);
      //   setTimeout(() => {
      //     setreplyText("");
      //   }, 3000);
      //   fetchQuestion();
      // } else {
      //   if (question.level === 6) {
      //     setreplyText("New Region Unlocked!");
      //   } else setreplyText("Correct Answer");

      //   setTimeout(() => {
      //     history.push("/");
      //     fetchQuestion();
      //     setAnswer("");
      //     setreplyText("");
      //   }, 3000);
      // }
    } catch (err) {
      throw err;
    }
  };

  // console.log(location);

  return (
    <div className="question-page">
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <div className="region-display">
        <span className="back-button">
          <i className="fas fa-chevron-left"></i>
        </span>
        <span>region</span>
        <span className="pin-icon">
          <i className="fas fa-map-marker-alt"></i>
        </span>
      </div>
      {!loading ? (
        <div className="three-containers">
          <div className="con-1">
            <p className="headers">Hints</p>
            {hints && hints.length != 0 ? (
              <div className="hints">
                {hints.map((hint, ind) => {
                  return <p key={ind}>{hint}</p>;
                })}
                {[...Array(3 - hints.length)].map(
                  (value: undefined, index: number) => {
                    return (
                      <p className="locks" key={index}>
                        <i data-tip="Hint Locked" className="fas fa-lock"></i>
                      </p>
                    );
                  }
                )}
              </div>
            ) : (
              <div className="hints">
                {[...Array(3)].map((value: undefined, index: number) => {
                  return (
                    <p className="locks" key={index}>
                      <i data-tip="Hint Locked" className="fas fa-lock"></i>
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          <div className="con-2">
            <p className="headers">Level {question.level}</p>
            <p>{question.text}</p>
            <div className="form">
              <form onSubmit={handleSubmit} id="answer">
                <input
                  placeholder="Answer"
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />

                <div>
                  <button className="primary-btn ">
                    <div className="submit">Submit</div>
                    <img src={buttonImage} alt="" />
                  </button>
                </div>
              </form>
            </div>
            {replyText != "" && <div className="replyText">{replyText}</div>}
          </div>
          <div className="con-3">
            {leftTab ? (
              <p className="headers">
                Attempts <span onClick={() => setleftTab(false)}>| Stats</span>
              </p>
            ) : (
              <p className="headers">
                <span onClick={() => setleftTab(true)}>Attempts |</span> Stats
              </p>
            )}
            {leftTab ? (
              <div>
                {attempts.reverse().map((att, ind) => {
                  return <p key={ind}>{att}</p>;
                })}
              </div>
            ) : (
              <>
                <div>
                  <p>At Par : {stats.atPar}</p>
                  <p>Leading : {stats.leading ? stats.leading : 0}</p>
                  <p>Trailing : {stats.lagging ? stats.lagging : 0}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">
          <h3>Loading...</h3>
        </div>
      )}
    </div>
  );
}
