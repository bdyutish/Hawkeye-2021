import React, { ReactElement } from 'react';

interface Props {
  value: string;
  onChange: (e: any) => void;
  type?: string;
  placeholder: string;
  className?: string;
}

export default function Input({
  value,
  onChange,
  type,
  placeholder,
  className,
}: Props): ReactElement {
  const [seen, setSeen] = React.useState(false);

  return (
    <div className="input-container">
      {type === 'password' && !seen && (
        <i onClick={() => setSeen(true)} className="fas fa-eye-slash"></i>
      )}
      {type === 'password' && seen && (
        <i onClick={() => setSeen(false)} className="fas fa-eye"></i>
      )}
      <input
        value={value}
        onChange={onChange}
        type={!seen ? (type ? type : 'text') : 'text'}
        placeholder={placeholder}
        className={className || ''}
      />
    </div>
  );
}
