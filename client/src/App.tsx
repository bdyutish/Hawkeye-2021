import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AdminPage from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Questions from "./pages/Questions";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import { get } from "./utils/requests";

//TODO
//***Correct the fonts EVERYWHERE

export default function App(): ReactElement {
  React.useEffect(() => {
    get("").then(console.log);
  }, []);

  return (
    <React.Fragment>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/questions" component={Questions} />
        {/* questions to be made private */}
        <PrivateRoute admin exact path="/admin" component={AdminPage} />
        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  );
}
