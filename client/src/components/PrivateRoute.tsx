import React, { ReactElement } from "react";
import { Route } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import Landing from "../pages/Landing";
import Loading from "./Loading";

interface Props {
  component: React.FC<any>;
  path: string | string[];
  exact?: boolean;
  admin?: boolean;
}

export default function PrivateRoute({
  component: Component,
  admin,
  ...rest
}: Props): ReactElement {
  const auth = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        const check = admin ? auth?.isAdmin() : auth?.user;
        if (check) {
          return <Component {...props} />;
        } else {
          if (auth?.loading)
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
