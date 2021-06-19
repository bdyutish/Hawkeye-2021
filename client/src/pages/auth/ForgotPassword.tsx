import React, { ReactElement } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
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

interface Props {}

export default function ForgotPassword({}: Props): ReactElement {
  const [email, setEmail, resetEmail] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [banned, setBanned] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const [captcha, setCaptcha] = React.useState(false);
  const handleVerify = () => {
    setCaptcha(true);
  };

  const isPhone = useMediaQuery({
    query: '(max-device-width: 680px)',
  });

  function validateEmail(email: string) {
    email = email.trim().toLowerCase();
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!email) errors.push('Email is Required');
    else if (!validateEmail(email)) errors.push('Email is invalid');
    if (!captcha) errors.push('Captcha must be completed');

    if (errors.length === 0) {
      try {
        await auth?.forgotPassword(email);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      setErrors(errors);
      setLoading(false);
    }
  };

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
      <h2>Forgot Password</h2>
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
        <div className="catcha">
          <ReCAPTCHA
            sitekey="6LeggzUbAAAAAIKw-eFituXhXm8LeANFEHJwxLbs"
            onChange={handleVerify}
            theme="dark"
          />
        </div>
        <div className="forgot">
          <Link to="/login">Back to login</Link>
        </div>
        <Button className="auth-button" name="Submit" />
      </form>
    </div>
  );
}
