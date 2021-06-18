import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Confirm from '../../components/Confirm';
import Loading from '../../components/Loading';
import { useConfirm } from '../../hooks/useConfirm';
import { get, post } from '../../utils/requests';
import { useToasts } from 'react-toast-notifications';
import useInputState from '../../hooks/useInputState';
import Input from '../../components/Input';
export default function AdminPage(): ReactElement {
  const [leaderboard, setLeaderboard] = useState([]);
  const [regions, setRegion] = useState([]);

  const [question, setQuestion] = useInputState();
  const [answer, setAnswer] = useInputState();
  const [level, setLevel] = useInputState();
  const [hintOne, setHintOne] = useInputState();
  const [hintTwo, setHintTwo] = useInputState();
  const [hintThree, setHintThree] = useInputState();

  const [questionLevel, setQuestionLevel] = useInputState();
  const [hintLevel, setHintLevel] = useInputState();

  const fetchLeaderboard = async () => {
    try {
      await get('/leaderboard').then((data) => {
        setLeaderboard(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const { addToast } = useToasts();

  const unlockRegion = async () => {
    try {
      const res = await post('/regions/unlock');
      if (res.success === true) {
        addToast('Region Unlocked', { appearance: 'success' });
      }
    } catch (err) {
      console.log(err);
    }
  };
  const { confirmed, options } = useConfirm();
  useEffect(() => {
    (async () => {
      try {
        await fetchRegions();
        await fetchLeaderboard();
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const fetchRegions = async () => {
    try {
      await get('/regions').then((data) => {
        setRegion(data);
        // console.log(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const addNestQuestion = async () => {
    if (!question || !answer) {
      addToast('Enter Question and answer', { appearance: 'error' });
      return;
    }

    const hintsArray: string[] = [];
    if (hintOne) hintsArray.push(hintOne);
    if (hintTwo) hintsArray.push(hintTwo);
    if (hintThree) hintsArray.push(hintThree);

    try {
      await post('/nest/add', {
        text: question,
        answer: answer,
        hints: hintsArray,
        level: parseInt(level),
      });
      addToast('Added successfully', { appearance: 'success' });
    } catch (err: any) {
      console.log(err.response);
      addToast('Something went wrong', { appearance: 'error' });
    }
  };

  const unlockNestHint = async () => {
    if (!questionLevel || !hintLevel) {
      addToast('Enter questionLevel and hintLevel', { appearance: 'error' });
      return;
    }

    try {
      await post('/nest/hints/unlock', {
        question: questionLevel,
        hintLevel,
      });
      addToast('Unlocked successfully', { appearance: 'success' });
    } catch (err: any) {
      console.log(err.response);
      addToast('Something went wrong', { appearance: 'error' });
    }
  };

  return (
    <div className="admin">
      <h1> ADMIN</h1>
      <h1>Leaderboard</h1>
      <div className="leaderboard">
        {leaderboard.map((user, ind) => {
          // console.log(user);
          return (
            <Leaderboard
              userid={user['_id']}
              key={ind}
              index={(ind + 1).toString()}
            />
          );
        })}
      </div>

      <h1> Regions</h1>
      <div className="regions-container">
        {regions.map((reg, ind) => {
          //console.log(reg);
          return (
            <div className="region-item" key={ind}>
              <div className="region-name">{reg['name']} </div>
              <p className="region-description">{reg['description']}</p>
              <Link to={`/admin/${reg['_id']}/`}>
                <button className="button-admin">Modify</button>
              </Link>
            </div>
          );
        })}
      </div>

      <h1> Unlock Hint</h1>
      <UnlockHints />
      <h1>Unlock Region</h1>
      <Button
        onClick={confirmed(unlockRegion, `Region Unlock ?`)}
        name="Unlock Region"
      />
      <Confirm options={options} />
      <h1 className="nestt">Nest</h1>
      <h2>Dont add same level ke 2 questions fuck up ho jayega</h2>
      <h1>Add Question</h1>
      <Input
        value={question}
        onChange={setQuestion}
        type="text"
        placeholder="Question"
      />
      <Input
        value={answer}
        onChange={setAnswer}
        type="text"
        placeholder="Answer"
      />
      <Input
        value={level}
        onChange={setLevel}
        type="text"
        placeholder="Level"
      />
      <Input
        value={hintOne}
        onChange={setHintOne}
        type="text"
        placeholder="Hint 1"
      />
      <Input
        value={hintTwo}
        onChange={setHintTwo}
        type="text"
        placeholder="Hint 2"
      />
      <Input
        value={hintThree}
        onChange={setHintThree}
        type="text"
        placeholder="Hint 3"
      />
      <Button
        onClick={confirmed(addNestQuestion, `Add Question ?`)}
        name="Add"
      />
      <h1>Unlock Hint</h1>
      <Input
        value={questionLevel}
        onChange={setQuestionLevel}
        type="text"
        placeholder="Question Level"
      />
      <Input
        value={hintLevel}
        onChange={setHintLevel}
        type="text"
        placeholder="Hint Level"
      />
      <Button onClick={confirmed(unlockNestHint)} name="Unlock" />
    </div>
  );
}
interface Details {
  userid: string;
  index: string;
}
function Leaderboard({ userid, index }: Details): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userdata, setUserData] = useState<any>();

  const { confirmed, options } = useConfirm();

  const fetch = async () => {
    try {
      setIsLoading(true);
      //console.log(userid);
      await get(`/profile/${userid}`).then((data) => {
        setUserData(data);
      });
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        await fetch();
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  const banUser = async (userid: string) => {
    if (userdata.isBanned) {
      try {
        const data = await post(`/user/unban/${userid}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await post(`/user/ban/${userid}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetch();
  };

  return (
    <div className="row">
      <Confirm options={options} />
      <div>{index}</div>
      <div>{userdata.username}</div>
      <div>{userdata.score}</div>
      <div>
        {userdata.isBanned && (
          <button
            type="button"
            className="btn-danger1"
            onClick={() => banUser(userdata._id)}
          >
            Un Ban
          </button>
        )}
        {!userdata.isBanned && (
          <button
            type="button"
            className="btn-danger"
            onClick={() => banUser(userdata._id)}
          >
            Ban
          </button>
        )}
      </div>
    </div>
  );
}

function UnlockHints(): ReactElement {
  const unlockHint = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    event.preventDefault();
    try {
      console.log(reg);
      console.log(que);

      const test = await post(`/hints/unlock`, {
        regionIndex: reg,
        question: que,
        hintLevel: lev,
      });

      setlev(parseInt(''));
      setque(parseInt(''));
      setreg(parseInt(''));

      console.log(test);
    } catch (error) {
      console.log(error);
    }
  };
  const [reg, setreg] = useState<number>();
  const [que, setque] = useState<number>();
  const [lev, setlev] = useState<number>();

  const { confirmed, options } = useConfirm();

  return (
    <div className="regions-container">
      <Confirm options={options} />
      <div className="region-item">
        <form onSubmit={unlockHint}>
          <label>Region Index [0-5]</label>
          <div>
            <input onChange={(e) => setreg(parseInt(e.target.value))} />
          </div>
          <label>Question [1-6] </label>
          <div>
            {' '}
            <input onChange={(e) => setque(parseInt(e.target.value))} />{' '}
          </div>
          <label>Hint Level [1-3]</label>
          <div>
            {' '}
            <input onChange={(e) => setlev(parseInt(e.target.value))} />{' '}
          </div>
          <button className="button-admin">Unlock Hint</button>
        </form>
      </div>
    </div>
  );
}
