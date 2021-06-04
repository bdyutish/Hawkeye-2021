import React, { ReactElement } from 'react';
import useClickOut from '../hooks/useClickOut';
import { Nullable } from '../utils/types';

interface Props {
  options: {
    label: string;
    value: string;
  }[];
  defaultIndex?: number;
  setter: any;
}

export default function Dropdown({
  options,
  defaultIndex = 0,
  setter,
}: Props): Nullable<ReactElement> {
  const [open, setOpen] = React.useState(false);
  const [currentOption, setCurrentOption] = React.useState(defaultIndex);

  const divRef = React.useRef<HTMLDivElement>(null);

  useClickOut(
    divRef,
    () => {},
    () => {
      setOpen(false);
    }
  );

  React.useEffect(() => {
    setter(options[defaultIndex].value);
  }, []);

  if (Object.keys(options).length === 0) return null;
  return (
    <div
      className={open ? 'dropdown-div dropdown-div--open' : 'dropdown-div'}
      ref={divRef}
    >
      <div
        className={open ? 'dropdown-top dropdown-top--open' : 'dropdown-top'}
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="img">{/* <img src={arrow} alt="down_arrow" /> */}</div>
        <h4>{options[currentOption].label}</h4>
        <i className="fas fa-map-marker-alt"></i>
      </div>
      {open && (
        <div
          className={
            open ? 'dropdown-list dropdown-list--open' : 'dropdown-list'
          }
        >
          {options.map((option: any, index: number) => {
            return (
              <div
                onClick={() => {
                  setCurrentOption(index);
                  setOpen(false);
                  setter(options[index].value);
                }}
                key={option.value}
                className="option"
              >
                <h4> {option.label} </h4>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
