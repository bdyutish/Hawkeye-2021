import React, { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import hawk from '../assets/hawk.png';
import { useAuth } from '../context/AuthContext';

interface Props {}

export default function NotFoud({}: Props): ReactElement {
  const location = useLocation();
  const user = useAuth()?.user;

  const isNest = location.pathname === '/nest';

  return (
    <div className={isNest && user ? 'not-found not-found--nest' : 'not-found'}>
      <img src={hawk} alt="" />
      <h1>
        <span className="hawk-name">Hawk</span> thinks you're{' '}
        {isNest && user ? 'not worthy' : 'lost'}
      </h1>
    </div>
  );
}
