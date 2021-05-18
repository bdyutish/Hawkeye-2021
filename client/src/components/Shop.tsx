import React, { ReactElement } from "react";
import Modal from "react-modal";

interface Props {
  closeHandler: () => void;
  open: boolean;
}

export default function Shop({ closeHandler, open }: Props): ReactElement {
  return (
    <Modal
      onRequestClose={closeHandler}
      className="shop-modal"
      overlayClassName="overlay"
      isOpen={open}
    >
      <h1>Shop</h1>
      <p>tere pas paise nahi hai</p>
    </Modal>
  );
}
