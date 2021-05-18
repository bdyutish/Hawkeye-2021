import React, { ReactElement } from "react";
import Modal from "react-modal";

interface Props {
  closeHandler: () => void;
  open: boolean;
}

export default function Rulebook({ closeHandler, open }: Props): ReactElement {
  return (
    <Modal
      onRequestClose={closeHandler}
      className="shop-modal"
      overlayClassName="overlay"
      isOpen={open}
    >
      <h1>Rulebook</h1>
    </Modal>
  );
}
