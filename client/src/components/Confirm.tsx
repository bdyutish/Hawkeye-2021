import React, { ReactElement } from 'react';
import Modal from 'react-modal';

interface Props {
  options: {
    subText: String;
    yesHandler: () => void;
    noHandler: () => void;
    open: boolean;
  };
}

export default function Confrim({
  options: { subText, yesHandler, noHandler, open },
}: Props): ReactElement {
  return (
    <div>
      <Modal
        onRequestClose={noHandler}
        className="confirm"
        overlayClassName="overlay"
        isOpen={open}
      >
        <h1>Are You Sure?</h1>
        <p className="sub-text">{subText}</p>
        <button onClick={yesHandler}>Yes</button>
        <button onClick={noHandler}>No</button>
      </Modal>
    </div>
  );
}
