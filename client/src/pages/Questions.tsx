import React, { ReactElement, useEffect, useState } from "react";
import desktopBG from "../assets/backround/desktop.png";
import Img from "../components/Img";
import { useAuth } from "../context/AuthContext";
import { get, post } from "../utils/requests";
import { Nullable, QuestionType, RegionType, User } from "../utils/types";

export default function Home(): ReactElement {
  const auth = useAuth();
  const [userDetails, setuserDetails] = useState<Nullable<User> | any>(null);
  const [leftTab, setleftTab] = useState<boolean>(true);
  const [currentRegion, setcurrentRegion] =
    useState<Nullable<RegionType> | any>(null);
  const [curindex, setcurindex] = useState<number>(0);
  const [question, setQuestion] = useState<Nullable<QuestionType> | any>();
  const [hints, setHints] = useState<Array<string>>([]);
  const [attempts, setAttempts] = useState<Array<string>>([]);
  const [answer , setAnswer] = useState<string>('');

  const fetchQuestion = async () => {
    try {
      await get(`/questions/${userDetails.regions[curindex].regionid}`).then(
        (data) => {
          let ques = data.question;
          setQuestion(ques);
          setAttempts(data.attempts);
          setHints(data.question.hints);
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

 
  useEffect(() => {
    console.log(auth?.user);
      setuserDetails(auth?.user);
     if(auth?.user?.lastUnlockedIndex) setcurindex(auth?.user?.lastUnlockedIndex);
     fetchQuestion();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<any> => {
    event.preventDefault();
    try {
      await post(`questions/submit/${question._id}`, {
        answer
      }).then((data) => console.log(data));
    } catch (err) {
      throw err;
    }
    setAnswer('');
 };

  return (
    <div className="question-page">
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <div className="region-display">
        <span style={{ float: "left" }}>\</span>
        <span>region</span>
        <span style={{ float: "right" }}>ic</span>
      </div>
      <div className="three-containers">
        <div className="con-1">
          <p className="headers">Hints</p>
          {hints && hints.length != 0 ? (
            <div>
              {hints.map((hint, ind) => {
                return <p key={ind}>{hint}</p>;
              })}
            </div>
          ) : (
            <div>iecse logo</div>
          )}
        </div>
        <div className="con-2">
          <p className="headers">Level {question.level}</p>
          <p>{question.text}</p>
          <div>
            <form onSubmit={handleSubmit} id="answer">
            <input type="text" onChange={(e) => setAnswer(e.target.value)}/>
            <button form="answer" type="submit">Submit</button>
            </form>
          </div>
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
              {attempts.map((att, ind) => {
                return <p key={ind}>{att}</p>;
              })}
            </div>
          ) : (
            <>
              <div>
                <p>Leading : 10</p>
                <p>Trailing : 1001</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
