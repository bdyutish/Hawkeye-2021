import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import desktopBG from '../../assets/backround/desktop.png';
import Button from '../../components/Button';
import Img from '../../components/Img';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import useInputState from '../../hooks/useInputState';
import hawk from '../../assets/hawk_transparent.png';

interface Props {}

export default function Login({}: Props): ReactElement {
  const [email, setEmail, resetEmail] = useInputState();
  const [password, setPassword, resetPassword] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [banned, setBanned] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!email) errors.push('Email is Required');
    if (!password) errors.push('Password is Required');

    if (errors.length === 0) {
      try {
        await auth?.login(email, password);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (err.response.data.message === 'This route is forbidden!') {
          setBanned(true);
          addToast('User Banned', { appearance: 'error' });
          return;
        }

        if (err.response.data.message === 'User not verified')
          addToast('Verification link sent to mail');

        setErrors([err.response.data.message]);
      }
    } else {
      setLoading(false);
      setErrors(errors);
    }
  };

  return (
    <div className="auth-page login">
      <Img src={desktopBG} className="background" />
      <img src={hawk} alt="" />
      <h1>HAWKEYE</h1>
      <h2>Log in</h2>
      <h3>Welcome back player</h3>
      {errors.map((err: string) => {
        return <div className="error">{err}</div>;
      })}
      <form onSubmit={handleSubmit}>
        <Input
          value={email}
          onChange={setEmail}
          type="text"
          placeholder="Email ID"
          className="input"
        />
        <Input
          value={password}
          onChange={setPassword}
          type="password"
          placeholder="Password"
          className="input"
        />
        <div className="forgot">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <Button className="auth-button" name="Login" />
      </form>
      <div className="swap">
        New to hawkeye? <Link to="/register">Create Account</Link>{' '}
      </div>
    </div>
  );
}
