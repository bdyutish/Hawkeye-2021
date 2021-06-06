import React, { ReactElement } from 'react';

interface Props {
  src?: string;
  className?: string;
}

export default function Img({ src, className }: Props): ReactElement {
  return (
    <div
      className={className || ''}
      style={{
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    ></div>
  );
}
