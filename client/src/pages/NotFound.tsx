import React, { ReactElement } from 'react';
import hawk from '../assets/hawk.png';

interface Props {}

export default function NotFoud({}: Props): ReactElement {
  return (
    <div className="not-found">
      <img src={hawk} alt="" />
      <h1>Hawk thinks you're lost</h1>
    </div>
  );
}
