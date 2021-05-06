import React, { ReactElement } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

export default function App(): ReactElement {
  return (
    <React.Fragment>
      <Switch>
        <PrivateRoute exact path="/" component={Home} />
        {/* <Route path="*" component={Home} /> */}
      </Switch>
    </React.Fragment>
  );
}
