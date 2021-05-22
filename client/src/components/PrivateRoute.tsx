import React, { ReactElement } from "react";
import { Redirect, Route } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Landing from "../pages/Landing";
import Loading from "./Loading";

interface Props {
  component: React.FC<any>;
  path: string | string[];
  exact?: boolean;
  admin?: boolean;
  auth?: boolean;
}

export default function PrivateRoute({
  component: Component,
  admin,
  auth,
  ...rest
}: Props): ReactElement {
  const authContext = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        let check = !!authContext?.user;
        if (admin) check = !!authContext?.isAdmin();
        if (auth) check = !authContext?.user;

        if (check) {
          return <Component {...props} />;
        } else {
          if (auth) {
            return <Redirect to="/" />;
          }

          if (authContext?.loading)
            return (
              <div className="screen-center">
                <Loading />
              </div>
            );
          return <Landing />;
        }
      }}
    />
  );
}
