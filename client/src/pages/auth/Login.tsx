import React, { ReactElement } from "react";
import { useToasts } from "react-toast-notifications";
import desktopBG from "../../assets/backround/desktop.png";
import Img from "../../components/Img";
import { useAuth } from "../../context/AuthContext";
import useInputState from "../../hooks/useInputState";

interface Props {}

export default function Login({}: Props): ReactElement {
  const [email, setEmail, resetEmail] = useInputState();
  const [password, setPassword, resetPassword] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [banned, setBanned] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const handleForgot = () => {};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!email) errors.push("Email is Required");
    if (!password) errors.push("Password is Required");

    if (errors.length === 0) {
      try {
        await auth?.login(email, password);
        setLoading(false);
      } catch (err) {
        setLoading(false);

        if (err.response.data.message === "This route is forbidden!")
          setBanned(true);

        if (err.response.data.message === "User not verified")
          addToast("Verification link sent to mail");

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
      <h1>HAWKEYE</h1>
      <h2>Log in</h2>
      <h3>Welcome back player</h3>
      {errors.map((err: string) => {
        return <div className="error">{err}</div>;
      })}
      <form onSubmit={handleSubmit}>
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
        <div className="forgot">
          <span onClick={handleForgot}>Forgot Password?</span>
        </div>
        <button>Login</button>
      </form>
    </div>
  );
}
