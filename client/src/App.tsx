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
// ok why is HUD working outside proivder

export default function App(): ReactElement {
  return (
    <React.Fragment>
      <Switch>
        <PrivateRoute auth path="/login" component={Login} />
        <PrivateRoute auth path="/register" component={Register} />
        <PrivateRoute
          auth
          path="/reset-password/:token"
          component={ResetPassword}
        />
        <PrivateRoute auth path="/forgot-password" component={ForgotPassword} />
        <PrivateRoute path="/question/:id" component={Questions} />
        <PrivateRoute admin exact path="/admin" component={AdminPage} />
        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  );
}
