import React, { ReactElement } from 'react';
import Loading from '../../components/Loading';
import { put } from '../../utils/requests';
import desktopBG from '../../assets/backround/desktop.svg';
import phoneBG from '../../assets/backround/mobile.svg';

import animationData from '../../assets/animations/verified.json';
import Lottie from 'react-lottie';
import Img from '../../components/Img';
import Button from '../../components/Button';
import { useMediaQuery } from 'react-responsive';

interface Props {
  match: any;
}

const defaultOptions = {
  loop: false,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

export default function VerifyMail({ match }: Props): ReactElement {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      try {
        await put(`/verify/${match.params.token}`);
        setLoading(false);
      } catch (err) {}
    })();
  }, []);

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  if (loading) {
    return (
      <div className="screen-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="verify-mail">
      <Img src={isPhone ? phoneBG : desktopBG} className="background" />
      <Lottie options={defaultOptions} height={250} width={250} />
      <h1>Email Verified!</h1>
      <Button
        className="btn"
        width={200}
        pathname={`/login`}
        state={{ allow: true }}
        link
        name="Login"
      />
    </div>
  );
}
