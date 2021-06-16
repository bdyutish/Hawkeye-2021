import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import { get, post } from '../../utils/requests';

export default function AdminPage(): ReactElement {
  const [leaderboard, setLeaderboard] = useState([]);
  const [regions, setRegion] = useState([]);
  const fetchLeaderboard = async () => {
    try {
      await get('/leaderboard').then((data) => {
        setLeaderboard(data);
      });
    } catch (err) {
      console.log(err);
    }
  };

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
  return (
    <div className="regions-container">
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
