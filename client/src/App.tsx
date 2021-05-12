import React, { ReactElement, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";

import {useAuth} from "./context/AuthContext"; 
import AdminPage from "./pages/Admin";

export default function App(): ReactElement {
   const auth = useAuth();
  

  return (
    <React.Fragment>
      <Switch>
        {auth?.isAdmin && <PrivateRoute exact path="/admin" component={AdminPage} />}
        <PrivateRoute exact path="/" component={Home} />
        {/* <Route path="*" component={Home} /> */}
      </Switch>
    </React.Fragment>
  );
}
