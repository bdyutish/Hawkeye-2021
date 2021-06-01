import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import buttonImage from '../assets/button.png';

interface Props {
  name: string;
  width?: number;
  fSize?: number;
  onClick?: () => any;
  className?: string;
  link?: boolean;
  pathname?: string;
  state?: any;
}

export default function Button({
  name,
  onClick,
  className,
  link,
  pathname,
  state,
}: Props): ReactElement {
  if (link) {
    return (
      <Link to={{ pathname, state }} className={`primary-btn ${className}`}>
        <div className="name">{name}</div>
        <img src={buttonImage} alt="" />
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`primary-btn ${className}`}>
      <div className="name">{name}</div>
      <img src={buttonImage} alt="" />
    </button>
  );
}
