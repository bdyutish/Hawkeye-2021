import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import AdminPage from "./pages/Admin";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

//TODO
//***Correct the fonts

export default function App(): ReactElement {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute admin exact path="/admin" component={AdminPage} />
        <PrivateRoute exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  );
}
