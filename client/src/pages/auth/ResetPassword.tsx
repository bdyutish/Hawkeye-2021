import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import desktopBG from '../../assets/backround/desktop.svg';
import phoneBG from '../../assets/backround/mobile.svg';

import Button from '../../components/Button';
import Img from '../../components/Img';
import Input from '../../components/Input';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import useInputState from '../../hooks/useInputState';
import hawk from '../../assets/hawk.svg';
import { useMediaQuery } from 'react-responsive';

interface Props {
  match: any;
}

export default function ResetPassword({ match }: Props): ReactElement {
  const [password, setPassword, resetPassword] = useInputState();
  const [confirm, setConfirm, resetConfirm] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!password) errors.push('Password is required');
    else if (password.length < 8)
      errors.push('Password must be atleast 8 Characters');
    if (password !== confirm) errors.push('Passwords do not match');

    if (errors.length === 0) {
      try {
        await auth?.resetPassword(password, match.params.token);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(errors);
    }
  };

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
    <div className="auth-page login forgot">
      <Img src={isPhone ? phoneBG : desktopBG} className="background" />
      <img src={hawk} alt="" id="hawkk" />
      <h1>HAWKEYE</h1>
      <h2>Reset Password</h2>
      {errors.map((err: string) => {
        return <div className="error">{err}</div>;
      })}
      <form onSubmit={handleSubmit}>
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="Password"
          className="input"
        />
        <Input
          value={confirm}
          onChange={setConfirm}
          type="password"
          placeholder="Confirm Password"
          className="input"
        />
        <Button className="auth-button" name="Submit" />
      </form>
    </div>
  );
}
