import React, { ReactElement } from "react";
import buttonImage from "../assets/button.png";

interface Props {
  name: string;
  width?: number;
  fSize?: number;
  onClick?: () => {};
  className?: string;
}

export default function Button({
  name,
  onClick,
  className,
}: Props): ReactElement {
  return (
    <button onClick={onClick} className={`primary-btn ${className}`}>
      <div className="name">{name}</div>
      <img src={buttonImage} alt="" />
    </button>
  );
}
