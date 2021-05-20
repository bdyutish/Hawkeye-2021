import React, { ReactElement } from "react";
import { get, post } from "../utils/requests";
import { RouteComponentProps } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";
import useInputState from "../hooks/useInputState";
import Img from "../components/Img";

import desktopBG from "../assets/backround/desktop.png";
import ReactTooltip from "react-tooltip";

interface MatchParams {
  id: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

export default function Question({ match }: Props): ReactElement {
  const questionFetcher = useFetch(`/questions/${match.params.id}`);
  if (questionFetcher.isLoading) {
    <div className="screen-center">
      <Loading />
    </div>;
  }

  console.log(questionFetcher);

  if (questionFetcher.error) {
  }

  const [answer, setAnswer, resetAnswer] = useInputState();

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
      //   if (!data.success) {
      //     setreplyText(data.message);
      //     setTimeout(() => {
      //       setreplyText("");
      //     }, 3000);
      //     fetchQuestion();
      //   } else {
      //     if (question.level === 6) {
      //       setreplyText("New Region Unlocked!");
      //     } else setreplyText("Correct Answer");
      //     setTimeout(() => {
      //       history.push("/");
      //       fetchQuestion();
      //       setAnswer("");
      //       setreplyText("");
      //     }, 3000);
      //   }
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="question">
      <Img src={desktopBG} className="background" />
      <h1>Hawkeye</h1>
      <main>
        <Hints />
      </main>
    </div>
  );
}
function Hints({}): ReactElement {
  return (
    <div className="hints">
      <h4>Hints</h4>
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
