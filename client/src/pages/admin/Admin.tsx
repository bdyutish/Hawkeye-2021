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
import useFetch from '../../hooks/useFetch';
export default function AdminPage(): ReactElement {
  const [leaderboard, setLeaderboard] = useState([]);
  const [regions, setRegion] = useState([]);

  const [question, setQuestion] = useInputState();
  const [answer, setAnswer] = useInputState();
  const [level, setLevel] = useInputState();

  const [hintOneN, setHintOneN, resetHintOneN] = useInputState();
  const [hintTwoN, setHintTwoN, resetHintTwoN] = useInputState();
  const [hintThreeN, setHintThreeN, resetHintThreeN] = useInputState();

  const [questionLevel, setQuestionLevel] = useInputState();
  const [hintLevel, setHintLevel] = useInputState();

  const [start, setStart] = useInputState('0');
  const [end, setEnd] = useInputState('20');
  const [search, setSearch] = useInputState();

  const { data, error, isLoading } = useFetch('/nest/questions/all');

  const [selected, setSelected] = useState<string>('');

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

    try {
      await post('/nest/add', {
        text: question,
        answer: answer,
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

  const addNestHint = async (level: number) => {
    if (!selected) return;
    let hintText;

    if (level === 1) {
      hintText = hintOneN;
    } else if (level === 2) {
      hintText = hintTwoN;
    } else {
      hintText = hintThreeN;
    }

    if (!hintText) {
      addToast('Hint text is required', { appearance: 'error' });
      return;
    }

    try {
      await post(`/nest/hints/add/${selected}`, {
        hintText,
        level,
      });
      addToast('Added successfully', { appearance: 'success' });
      resetHintOneN();
      resetHintTwoN();
      resetHintThreeN();
    } catch (err: any) {
      console.log(err.response);
      addToast('Something went wrong', { appearance: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="admin">
      <h1> ADMIN</h1>
      <h1>Leaderboard</h1>
      <h2>
        Number of players{' '}
        <span style={{ color: '#5c63ff' }}>{leaderboard.length}</span>
      </h2>
      <p>click on name and check console for details</p>
      <div className="leaderboard">
        <Input
          value={search}
          onChange={setSearch}
          type="text"
          placeholder="Search"
        />
        <input
          type="text"
          value={start}
          onChange={setStart}
          placeholder="Start"
        />
        <input type="text" value={end} onChange={setEnd} placeholder="End" />

        {leaderboard
          .slice(parseInt(start), parseInt(end))
          .filter((user: any) => {
            const searchTerm = user.name + ' ' + user.phone;
            return searchTerm.toLowerCase().includes(search.toLowerCase());
          })
          .map((user: any, ind: number) => {
            return (
              <Leaderboard
                update={fetchLeaderboard}
                {...user}
                key={user._id}
                index={ind + 1}
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
      <p>select a nest question below to unlock uska hint</p>
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
      <h1>Hint Add</h1>
      <Input
        value={hintOneN}
        onChange={setHintOneN}
        type="text"
        placeholder="Hint 1"
      />
      <Button onClick={confirmed(() => addNestHint(1))} name="Add" />
      <Input
        value={hintTwoN}
        onChange={setHintTwoN}
        type="text"
        placeholder="Hint 2"
      />
      <Button onClick={confirmed(() => addNestHint(2))} name="Add" />

      <Input
        value={hintThreeN}
        onChange={setHintThreeN}
        type="text"
        placeholder="Hint 3"
      />
      <Button onClick={confirmed(() => addNestHint(3))} name="Add" />

      {data.map((question: any) => {
        return (
          <div
            className={
              question._id === selected
                ? 'nest-question nest-question--selected'
                : 'nest-question'
            }
            onClick={() => setSelected(question._id)}
          >
            {question.text}
          </div>
        );
      })}
    </div>
  );
}
interface Details {
  _id: string;
  name: string;
  hawksNest: boolean;
  isBanned: boolean;
  score: number;
  lastUnlockedIndex: number;
  nestLevel: number;
  index: number;
  phone: string;
  email: string;
  update: any;
}
function Leaderboard(props: Details): ReactElement {
  const { confirmed, options } = useConfirm();

  const banUser = async () => {
    if (props.isBanned) {
      try {
        const data = await post(`/user/unban/${props._id}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const data = await post(`/user/ban/${props._id}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
    props.update();
  };

  return (
    <div className="row">
      <Confirm options={options} />
      <div>{props.index}</div>
      <div>{props.hawksNest ? 'Nest Level ' + props.nestLevel : ''}</div>
      <div>{'Last unlocked ' + props.lastUnlockedIndex}</div>
      <div
        onClick={() => {
          console.log(props.phone);
          console.log(props.email);
        }}
        style={{ cursor: 'pointer', color: '#5c63ff' }}
      >
        {props.name}
      </div>
      <div>{props.score}</div>
      <div>
        {props.isBanned && (
          <button type="button" className="btn-danger1" onClick={banUser}>
            Un Ban
          </button>
        )}
        {!props.isBanned && (
          <button type="button" className="btn-danger" onClick={banUser}>
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
