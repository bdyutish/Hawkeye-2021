import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import desktopBG from "../../assets/backround/desktop.png";
import Button from "../../components/Button";
import Img from "../../components/Img";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import useInputState from "../../hooks/useInputState";

import ReCAPTCHA from "react-google-recaptcha";

interface Props {}

function validateEmail(email: string) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function Register({}: Props): ReactElement {
  const [name, setName, resetName] = useInputState();
  const [username, setUsername, resetUsername] = useInputState();
  const [email, setEmail, resetEmail] = useInputState();
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
    if (!name) errors.push("Name is Required");
    if (!username) errors.push("Username is Required");
    if (!email) errors.push("Email is Required");
    else if (!validateEmail(email)) errors.push("Email is invalid");
    if (!password) errors.push("Password is Required");
    else if (password.length < 8)
      errors.push("Password must be atleast 8 Characters");
    else if (password !== confirm) errors.push("Passwords do not match");
    if (!captcha) errors.push("Captcha must be completed");

    if (errors.length === 0) {
      try {
        await auth?.register(name, username, email, password);
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

  return (
    <div className="auth-page register">
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <h2>Sign Up</h2>
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
            sitekey="6LfvBrsaAAAAAEPwCjRmPaVuK7s8QNP5YLN8h5-W"
            onChange={handleVerify}
            theme="dark"
          />
        </div>

        <Button className="auth-button" name="Sign up" />
      </form>
      <div className="swap">
        Already have an account? <Link to="/login">Log In</Link>{" "}
      </div>
    </div>
  );
}
