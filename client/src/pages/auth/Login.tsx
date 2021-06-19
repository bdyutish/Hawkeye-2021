import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import desktopBG from '../../assets/backround/desktop.svg';
import phoneBG from '../../assets/backround/mobile.svg';

import Button from '../../components/Button';
import Img from '../../components/Img';
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import useInputState from '../../hooks/useInputState';
import hawk from '../../assets/hawk.svg';
import { useMediaQuery } from 'react-responsive';
import ReCAPTCHA from 'react-google-recaptcha';
import { post } from '../../utils/requests';

interface Props {}

export default function Login({}: Props): ReactElement {
  const [email, setEmail, resetEmail] = useInputState();
  const [password, setPassword, resetPassword] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [resend, setResend] = React.useState(false);

  const [sending, setSending] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  const [captcha, setCaptcha] = React.useState(false);
  const handleVerify = () => {
    setCaptcha(true);
  };

  const handleResend = async () => {
    if (sending) return;
    setSending(true);
    try {
      if (!email) {
        setErrors(['Email is required']);
        return;
      }

      if (!captcha) {
        setErrors(['Captcha is compulsary']);
        return;
      }

      await post('/verification', { email: email.trim().toLowerCase() });
      addToast('Verification mail sent', { appearance: 'success' });
      setResend(false);
      setSending(false);
    } catch (err) {
      setSending(false);
      addToast('Something went wrong', { appearance: 'error' });
    }
  };

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
      } catch (err: any) {
        setLoading(false);

        if (err.response.data.message === 'This route is forbidden!') {
          addToast('User Banned', { appearance: 'error' });
          return;
        }

        if (err.response.data.message === 'User not verified') {
          addToast('Verification link sent to mail');
          setResend(true);
        }

        setErrors([err.response.data.message]);
      }
    } else {
      setLoading(false);
      setErrors(errors);
    }
  };

  return (
    <div className="auth-page login">
      <Img src={isPhone ? phoneBG : desktopBG} className="background" />
      <img src={hawk} alt="" id="hawkk" />
      <h1>HAWKEYE</h1>
      <h2>Log in</h2>
      <h3 style={{ color: '#5157E7' }}>Welcome back player</h3>
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
        {resend && (
          <div className="catcha">
            <ReCAPTCHA
              sitekey="6LeggzUbAAAAAIKw-eFituXhXm8LeANFEHJwxLbs"
              onChange={handleVerify}
              theme="dark"
            />
          </div>
        )}
        <Button className="auth-button" name="Login" />
        {resend && (
          <Button
            type="button"
            onClick={handleResend}
            className="auth-button auth-button--resend"
            name="Resend Mail"
          />
        )}
      </form>

      <div className="swap">
        New to hawkeye? <Link to="/register">Create Account</Link>{' '}
      </div>
    </div>
  );
}
