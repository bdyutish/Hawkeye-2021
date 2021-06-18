import React, { ReactElement } from 'react';
import squareLeft from '../assets/square-one.png';
import squareRight from '../assets/square-two.png';

import cart from '../assets/cart.svg';
import rules from '../assets/rules.svg';
import { useAuth } from '../context/AuthContext';
import ReactTooltip from 'react-tooltip';
import Shop from './Shop';
import Rulebook from './Rulebook';
import { useLocation } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

interface Props {
  onOpen?: () => any;
  onClose?: () => any;
}

export default function HUD({ onOpen, onClose }: Props): ReactElement {
  const auth = useAuth();

  const [shopOpen, setShopOpen] = React.useState(false);

  const [rulebookOpen, setRulebookOpen] = React.useState(false);

  const location = useLocation();

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  React.useEffect(() => {
    if (!shopOpen && !rulebookOpen) return;
    if (onOpen) onOpen();
    return () => {
      if (onClose) onClose();
    };
  }, [shopOpen, rulebookOpen]);

  return (
    <div className="hud">
      {auth?.user &&
        location.pathname !== '/nest' &&
        location.pathname !== '/' && (
          <div
            onClick={() => {
              setShopOpen(true);
            }}
            data-tip="Shop"
            className="icon icon--1"
          >
            <img src={squareLeft} alt="" />
            <img src={cart} alt="" className="logo" />
          </div>
        )}
      {!isPhone && <ReactTooltip effect="solid" type="light" />}

      {location.pathname !== '/' && (
        <div
          onClick={() => {
            setRulebookOpen(true);
          }}
          data-tip="Rulebook"
          className={
            location.pathname === '/'
              ? 'icon icon--2 icon--home'
              : 'icon icon--2'
          }
        >
          <img src={squareRight} alt="" />
          <img src={rules} alt="" className="logo" />
        </div>
      )}

      {!isPhone && <ReactTooltip effect="solid" type="light" />}

      {auth?.user && location.pathname === '/' && (
        <div onClick={auth?.logout} data-tip="Logout" className="logout">
          <img src={squareLeft} alt="" />
          <i className="fas fa-power-off"></i>
        </div>
      )}
      {!isPhone && <ReactTooltip effect="solid" type="light" />}

      <Shop
        open={shopOpen}
        closeHandler={() => {
          setShopOpen(false);
        }}
      />
      <Rulebook
        open={rulebookOpen}
        closeHandler={() => {
          setRulebookOpen(false);
        }}
      />
    </div>
  );
}
