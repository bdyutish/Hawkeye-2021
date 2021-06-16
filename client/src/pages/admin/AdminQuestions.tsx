import React, { ReactElement, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Loading from '../../components/Loading';
import { get, post, put } from '../../utils/requests';

type TParams = { id: string };

export default function AdminQuestions({
  match,
}: //@ts-ignore
RouteComponentProps<TParams>): ReactElement {
  const [questions, setQuestions] = useState([]);
  const [expand, setExpand] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [region, setRegion] = useState<string>('');

  const addQuestion = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    event.preventDefault();
    try {
      const res = await post(`/questions/add`, {
        text,
        answer,
        level,
        region,
      });
      fetchQuestions();
    } catch (error) {
      console.log(error);
    }
    setExpand(!expand);
  };

  const fetchQuestions = async () => {
    try {
      await get(`/region/questions/${match.params.id}`).then((data) => {
        setQuestions(data);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        await fetchQuestions();
      } catch (err) {
        console.log(err);
      }
    })();
    return () => {
      //
    };
  }, []);
  return (
    <div className="admin">
      <div className="questions-container">
        <div className="question-item">
          <span onClick={() => setExpand(!expand)}>
            Add a question <i className="fas fa-plus-circle"></i>
          </span>
          {expand && (
            <div className="editor-container">
              <form onSubmit={addQuestion}>
                <h2 className="title">Text</h2>
                <input
                  id="question"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <h2 className="title">Answer</h2>
                <input
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
                <h2 className="title">Level</h2>
                <input
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
                <h2 className="title">RegionId</h2>
                <input
                  id="region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
                <button>SaveChanges</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <div className="questions-container">
        {questions.map((ques, ind) => {
          return (
            <div className="question-item" key={ind}>
              <AdminAddQuestion question={ques} regId={match.params.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Details {
  question: any;
  regId: string;
}

function AdminAddQuestion({ question, regId }: Details): ReactElement {
  const [expand, setExpand] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>('');
  const [hints, setHints] = useState<any>([]);
  const [text, setText] = useState<string>('');
  const [hint1, setHint1] = useState<string>('');
  const [hint2, setHint2] = useState<string>('');
  const [hint3, setHint3] = useState<string>('');
  const [qdata, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetch = () => {
    setIsLoading(true);
    get(`/question/${question._id}`)
      .then((data: any) => {
        setData(data);
        setIsLoading(false);
        setHints(data.hints);
        // console.log(data.hints);
        setText(data.question.text);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  const submitQuestion = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    // change this
    event.preventDefault();
    console.log('ds');
    console.log(qdata);
    try {
      await put(`/questions/edit/${qdata.question._id}`, {
        text,
        answer,
      });
      fetch();
    } catch (error) {}
    setExpand(!expand);
  };

  const addHint = async (
    event: React.FormEvent<HTMLFormElement>,
    hintLevel: number
  ): Promise<any> => {
    event.preventDefault();
    const hintTextt = hintLevel === 1 ? hint1 : hintLevel === 2 ? hint2 : hint3;

    if (qdata.hints[hintLevel - 1]) {
      try {
        console.log(qdata.hints[hintLevel - 1]._id);

        const data = await put(
          `/hints/edit/${qdata.hints[hintLevel - 1]._id}`,
          {
            hintText: hintTextt,
            level: hintLevel,
          }
        );
        console.log(data);
        setHint1('');
        setHint2('');
        setHint3('');
        fetch();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        console.log(qdata.question._id);
        const data = await post(`/hints/add/${qdata.question._id}`, {
          hintText: hintTextt,
          level: hintLevel,
        });
        setHint1('');
        setHint2('');
        setHint3('');
        fetch();
      } catch (error) {
        console.log(error);
      }
    }
    setExpand(!expand);
  };

  return (
    <div>
      <div className="question-item">
        <h1>Level {qdata.question.level}</h1>
        <h3 className="question-content">{qdata.question.text} </h3>
        <span onClick={() => setExpand(!expand)}>
          Modify <i className="fas fa-plus-circle"></i>
        </span>
      </div>
      {expand && (
        <div className="editor-container">
          <form onSubmit={submitQuestion}>
            <div className="edit-item">
              <h2 className="title">Question</h2>
              <input
                id="question"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <h2 className="title">Answer</h2>
              <input
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <button>SaveChanges</button>
          </form>
          <form onSubmit={(e) => addHint(e, 1)}>
            <div className="edit-item">
              <h2 className="title">Hint 1 :</h2>
              {hints[0] && <h2 className="title">{hints[0].hintText}</h2>}
              <input
                id="question"
                value={hint1}
                onChange={(e) => setHint1(e.target.value)}
              />
              <button>Save Hint 1</button>
            </div>
          </form>

          <form onSubmit={(e) => addHint(e, 2)}>
            <div className="edit-item">
              <h2 className="title">Hint 2 : </h2>
              {hints[1] && <h2 className="title">{hints[1].hintText}</h2>}
              <input
                id="question"
                value={hint2}
                onChange={(e) => setHint2(e.target.value)}
              />
              <button>Save Hint 2</button>
            </div>
          </form>
          <form onSubmit={(e) => addHint(e, 3)}>
            <div className="edit-item">
              <h2 className="title">Hint 3 : </h2>
              {hints[2] && <h2 className="title">{hints[2].hintText}</h2>}
              <input
                id="question"
                value={hint3}
                onChange={(e) => setHint3(e.target.value)}
              />
              <button>Save Hint 3</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
