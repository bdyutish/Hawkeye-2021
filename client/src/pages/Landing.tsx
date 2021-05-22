import React, { ReactElement } from "react";
import Button from "../components/Button";
import HUD from "../components/HUD";

export default function Landing(): ReactElement {
  return (
    <div className="landing">
      <HUD />
    </div>
  );
}
