import React, { ReactElement } from "react";
import { useToasts } from "react-toast-notifications";
import desktopBG from "../../assets/backround/desktop.png";
import Img from "../../components/Img";
import useInputState from "../../hooks/useInputState";

interface Props {}

export default function Register({}: Props): ReactElement {
  const [username, setUsername, resetUsername] = useInputState();
  const [email, setEmail, resetEmail] = useInputState();
  const [password, setPassword, resetPassword] = useInputState();
  const [confirm, setConfirm, resetConfirm] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addToast } = useToasts();

  return (
    <div className="auth-page register">
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <h2>Sign Up</h2>
      <input
        value={username}
        onChange={setUsername}
        type="text"
        placeholder="Name"
        className="input"
      />
      <input
        value={email}
        onChange={setEmail}
        type="text"
        placeholder="Email ID"
        className="input"
      />
      <input
        value={password}
        onChange={setPassword}
        type="password"
        placeholder="Password"
        className="input"
      />
      <input
        value={confirm}
        onChange={setConfirm}
        type="password"
        placeholder="Confirm Password"
        className="input"
      />
    </div>
  );
}
