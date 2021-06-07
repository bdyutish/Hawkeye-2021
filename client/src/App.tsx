import React, { ReactElement } from 'react';
import { Switch, Route, useLocation, Redirect } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import AdminPage from './pages/Admin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import { get } from './utils/requests';
import Question from './pages/Question';

import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';
import Nest from './pages/Nest';
import VerifyMail from './pages/auth/VerifyMail';

//TODO
//***Correct the fonts EVERYWHERE
// background blur chage only for mozilla
// Indication shop mei when something is selected
// Are you sure in shop and use
// Make sure HUD is in every page
// Add corners to background
// HUD is breaking in Home
// Change location string on logout
// Handle atempts empty case
// Are you sure modal**********
// ADD hawk logo

export default function App(): ReactElement {
  const auth = useAuth();

  return (
    <React.Fragment>
      <Switch>
        <PrivateRoute auth path="/login" component={Login} />
        <PrivateRoute auth path="/register" component={Register} />
        <Route path="/reset-password/:token" component={ResetPassword} />
        <PrivateRoute auth path="/forgot-password" component={ForgotPassword} />
        <Route path="/verify/:token" component={VerifyMail} />
        <PrivateRoute path="/question/:id" component={Question} />
        <PrivateRoute admin exact path="/admin" component={AdminPage} />
        <PrivateRoute exact path="/" component={Home} />
        {auth?.user?.hawksNest && (
          <PrivateRoute exact path="/nest" component={Nest} />
        )}
        <Route
          path="**"
          render={() => {
            if (auth?.user?.hawksNest) return <Redirect to="/nest" />;
            return <NotFound />;
          }}
        />
      </Switch>
    </React.Fragment>
  );
}
