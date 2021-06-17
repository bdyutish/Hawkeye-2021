import React, { ReactElement } from 'react';
import Modal from 'react-modal';

import square from '../assets/shop-square.png';
import Button from './Button';

import { powerUps, IPowerUp, coordinates } from '../utils/data';
import { post } from '../utils/requests';
import { useToasts } from 'react-toast-notifications';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../hooks/useConfirm';
import Confirm from './Confirm';

interface Props {
  closeHandler: () => void;
  open: boolean;
}

export default function Shop({ closeHandler, open }: Props): ReactElement {
  const [selected, setSelected] = React.useState(0);
  const { addToast } = useToasts();
  const auth = useAuth();

  const color =
    coordinates.find((coord) => coord.name === auth?.region)?.color ||
    '#5157E7';

  const handleClose = () => {
    closeHandler();
    setSelected(0);
  };

  const { confirmed, options } = useConfirm();

  const getCurrentPowerUp = () =>
    powerUps.find((up: IPowerUp) => up.id === selected);

  const handleBuy = async () => {
    try {
      const res = await post(`/shop/buy/${selected}`);

      auth?.updateUser({
        ...auth.user,
        inventory: res.inventory,
        powerupsHistory: res.updatedShop,
        score: res.updatedScore,
      });

      if (res.success) {
        addToast('Purchase Successful', { appearance: 'success' });
        handleClose();
      } else {
        addToast('Something Went Wrong', { appearance: 'error' });
      }
    } catch (err) {
      addToast(err.response.data.message, { appearance: 'error' });
      // await auth?.check();
      // closeHandler();
    }
  };
  // , `Are you sure you want to buy ${getCurrentPowerUp()?.name}`);

  return (
    <>
      <Modal
        onRequestClose={handleClose}
        className="shop-modal"
        overlayClassName="overlay"
        isOpen={open}
      >
        <h1>CHOOSE A POWERUP</h1>
        <div className="points">
          <span style={{ color }}>Reputation points:</span>
          {auth?.user?.score}
        </div>
        <div onClick={handleClose} className="close">
          <i className="fas fa-times"></i>
        </div>
        <main>
          <section className="left">
            {powerUps.map((item: IPowerUp, index: number) => {
              return (
                <div
                  onClick={() => setSelected(item.id)}
                  className={
                    item.id === selected ? 'item item--selected' : 'item'
                  }
                >
                  <img
                    src={powerUps[index].image}
                    alt=""
                    className={`power power--${index}`}
                  />
                  <img
                    src={
                      item.id === selected
                        ? require(`../assets/selected/${auth?.region}.png`)
                            .default
                        : square
                    }
                    alt=""
                    className="square"
                  />
                  <h3>{item.name}</h3>
                  <p>
                    <span style={{ color }}>OWNED :</span>{' '}
                    {
                      auth?.user?.powerupsHistory?.find(
                        (powerUp) => powerUp.id === item.id
                      ).owned
                    }
                  </p>
                </div>
              );
            })}
          </section>
          <section className="right">
            {!!selected && (
              <>
                <div className="name">{getCurrentPowerUp()?.name}</div>
                <p>{getCurrentPowerUp()?.description}</p>
                <div className="bottom">
                  <aside>
                    <span style={{ color }}>AVAILABLE: </span>
                    {
                      auth?.user?.powerupsHistory?.find(
                        (powerUp) => powerUp.id === selected
                      ).available
                    }
                  </aside>
                  <aside>
                    <span style={{ color }}> COST:</span>{' '}
                    {getCurrentPowerUp()?.cost} points
                  </aside>
                </div>
                <Button
                  onClick={confirmed(
                    handleBuy,
                    `Are you sure you want to buy ${getCurrentPowerUp()?.name}`
                  )}
                  name="Buy"
                />
              </>
            )}
            {!selected && (
              <div className="not-selected">
                <div className="name">Welcome to the shop</div>
                <p>Powerups can be bought here</p>
              </div>
            )}
          </section>
        </main>
      </Modal>
      <Confirm options={options} />
    </>
  );
}
