import React, { ReactElement } from 'react';
import useClickOut from '../hooks/useClickOut';
import { Nullable } from '../utils/types';

interface Props {
  options: {
    label: string;
    value: string;
    locked: boolean;
    completed: boolean;
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
    setter(options[defaultIndex]);
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
        <div className="arrow">
          <i className="fas fa-angle-down"></i>
        </div>
        <h4>{options[currentOption].label}</h4>
      </div>
      {open && (
        <div
          className={
            open ? 'dropdown-list dropdown-list--open' : 'dropdown-list'
          }
        >
          {options.map((option: any, index: number) => {
            let classNames = ['option'];
            if (option.locked) classNames.push('option--locked');
            if (option.completed) classNames.push('option--completed');

            return (
              <div
                onClick={() => {
                  setCurrentOption(index);
                  setOpen(false);
                  setter(options[index]);
                }}
                key={option.value}
                className={classNames.join(' ')}
              >
                <h4> {option.label} </h4>
                {!option.locked && !option.completed && (
                  <i className="fas fa-unlock"></i>
                )}
                {option.completed && <i className="fas fa-check"></i>}
                {option.locked && <i className="fas fa-lock"></i>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
