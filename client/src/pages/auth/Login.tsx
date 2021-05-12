import React, { ReactElement } from "react";
import { useToasts } from "react-toast-notifications";
import desktopBG from "../../assets/backround/desktop.png";
import Img from "../../components/Img";
import useInputState from "../../hooks/useInputState";

interface Props {}

export default function Login({}: Props): ReactElement {
  const [username, setUsername, resetUsername] = useInputState();
  const [password, setPassword, resetPassword] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addToast } = useToasts();

  const handleForgot = () => {};
  const handleSubmit = () => {};

  return (
    <div className="auth-page login">
      <Img src={desktopBG} className="background" />
      <h1>HAWKEYE</h1>
      <h2>Log in</h2>
      <h3>Welcome back player</h3>
      <input
        value={username}
        onChange={setUsername}
        type="text"
        placeholder="Username"
        className="input"
      />
      <input
        value={password}
        onChange={setPassword}
        type="password"
        placeholder="Password"
        className="input"
      />
      <div className="forgot">
        <span onClick={handleForgot}>Forgot Password?</span>
      </div>
      <button>Login</button>
    </div>
  );
}
