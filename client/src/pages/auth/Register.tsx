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

import ReCAPTCHA from 'react-google-recaptcha';
import { useMediaQuery } from 'react-responsive';

interface Props {}

function validateEmail(email: string) {
  email = email.trim();
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validateNumber(number: string) {
  if (number[0] === '+') number = number.slice(3).trim();
  const re = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return re.test(String(number).toLowerCase());
}

export default function Register({}: Props): ReactElement {
  const [name, setName, resetName] = useInputState();
  const [username, setUsername, resetUsername] = useInputState();
  const [email, setEmail, resetEmail] = useInputState();
  const [collage, setCollage, resetCollage] = useInputState();
  const [number, setNumber, resetNumber] = useInputState();

  const [password, setPassword, resetPassword] = useInputState();
  const [confirm, setConfirm, resetConfirm] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addToast } = useToasts();

  const [captcha, setCaptcha] = React.useState(false);
  const handleVerify = () => {
    setCaptcha(true);
  };

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!name || !username || !email || !password || !collage || !number)
      errors.push('All fields are required');
    if (!validateNumber(number) && number)
      errors.push('Phone Number is invalid');
    if (!validateEmail(email) && email) errors.push('Email is invalid');
    if (name.length > 30 && name) errors.push('Name is too long');
    if (username.length > 15 && username) errors.push('Username is too long');
    if (password.length < 8 && password)
      errors.push('Password must be atleast 8 Characters');
    else if (password !== confirm) errors.push('Passwords do not match');
    if (!captcha) errors.push('Captcha must be completed');

    if (errors.length === 0) {
      try {
        await auth?.register(name, username, email, password, collage, number);
        setLoading(false);
      } catch (err) {
        setErrors([err.response.data.message]);
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

  return (
    <div className="auth-page register">
      <Img src={isPhone ? phoneBG : desktopBG} className="background" />
      <img src={hawk} alt="" id="hawkk" />
      <h1>HAWKEYE</h1>
      <h2>Sign Up</h2>
      {errors.map((err: string) => {
        return <div className="error">{err}</div>;
      })}
      <form onSubmit={handleSubmit}>
        <Input
          value={name}
          onChange={setName}
          type="text"
          placeholder="Name"
          className="input"
        />
        <Input
          value={username}
          onChange={setUsername}
          type="text"
          placeholder="Username"
          className="input"
        />
        <Input
          value={email}
          onChange={setEmail}
          type="text"
          placeholder="Email ID"
          className="input"
        />
        <Input
          value={collage}
          onChange={setCollage}
          type="text"
          placeholder="College"
          className="input"
        />
        <Input
          value={number}
          onChange={setNumber}
          type="text"
          placeholder="Phone Number"
          className="input"
        />
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
        <div className="catcha">
          <ReCAPTCHA
            sitekey="6LeggzUbAAAAAIKw-eFituXhXm8LeANFEHJwxLbs"
            onChange={handleVerify}
            theme="dark"
          />
        </div>

        <Button className="auth-button" name="Sign up" />
      </form>
      <div className="swap">
        Already have an account? <Link to="/login">Log In</Link>{' '}
      </div>
    </div>
  );
}
