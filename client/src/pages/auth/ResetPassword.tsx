import React, { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import desktopBG from "../../assets/backround/desktop.png";
import Button from "../../components/Button";
import Img from "../../components/Img";
import Input from "../../components/Input";
import { useAuth } from "../../context/AuthContext";
import useInputState from "../../hooks/useInputState";

interface Props {}

export default function ResetPassword({}: Props): ReactElement {
  const [password, setPassword, resetPassword] = useInputState();
  const [confirm, setConfirm, resetConfirm] = useInputState();

  const [errors, setErrors] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [banned, setBanned] = React.useState(false);

  const { addToast } = useToasts();

  const auth = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const errors: string[] = [];
    if (!password) errors.push("Password is required");
    if (password !== confirm) errors.push("Passwords do not match");

    if (errors.length === 0) {
      try {
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setErrors(errors);
    }
  };

  return (
    <div className="auth-page login forgot">
      <Img src={desktopBG} className="background" />
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
