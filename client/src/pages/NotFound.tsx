import React, { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import hawk from '../assets/hawk.png';

interface Props {}

export default function NotFoud({}: Props): ReactElement {
  const location = useLocation();

  const isNest = location.pathname === '/nest';

  return (
    <div className={isNest ? 'not-found not-found--nest' : 'not-found'}>
      <img src={hawk} alt="" />
      <h1>Hawk thinks you're {isNest ? 'not worthy' : 'lost'}</h1>
    </div>
  );
}
