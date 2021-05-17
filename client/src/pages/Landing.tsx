import React, { ReactElement } from "react";
import Button from "../components/Button";
import ReactTooltip from "react-tooltip";

export default function Landing(): ReactElement {
  return (
    <div className="landing">
      <div className="hints">
        <h4>Hints</h4>
        <section>
          <div className="hint-locked">
            <i data-tip="Hint Locked" className="fas fa-lock"></i>
          </div>
          <div className="hint-locked">
            <i data-tip="Hint Locked" className="fas fa-lock"></i>
          </div>
          <div className="hint-locked">
            <i data-tip="Hint Locked" className="fas fa-lock"></i>
          </div>
          <ReactTooltip effect="solid" type="light" />
        </section>
      </div>
    </div>
  );
}
