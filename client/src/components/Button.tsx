import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import buttonImage from '../assets/button.png';
import { useAuth } from '../context/AuthContext';

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
  onClick: handleClick,
  className,
  link,
  pathname,
  state,
}: Props): ReactElement {
  const [hover, setHover] = React.useState(false);
  const auth = useAuth();

  // buttonImage;

  if (link) {
    return (
      <Link
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        to={{ pathname, state }}
        className={
          hover
            ? `primary-btn primary-btn--hovered ${className}`
            : `primary-btn ${className}`
        }
      >
        <div className="name">{name}</div>
        <img src={buttonImage} alt="" />
      </Link>
    );
  }

  return (
    //@ts-ignore
    <button
      //@ts-ignore
      onClick={handleClick}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
      className={
        hover
          ? `primary-btn primary-btn--hovered ${className}`
          : `primary-btn ${className}`
      }
    >
      <div className="name">{name}</div>
      <img
        src={
          hover
            ? (() => {
                try {
                  return require(`../assets/buttons/${auth?.region}.svg`)
                    .default;
                } catch (err) {
                  return buttonImage;
                }
              })()
            : buttonImage
        }
        alt=""
      />
    </button>
  );
}
