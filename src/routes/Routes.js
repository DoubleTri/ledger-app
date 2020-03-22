import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from '../context/UserContext';

export const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const {currentUser } = useContext(AuthContext);
  return (
    <Route
      {...rest}
      render={routeProps =>
        !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={"/login"} />
        )
      }
    />
  );
};

export const NoUserRoute = ({ component: RouteComponent, ...rest }) => {
    const {currentUser} = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={routeProps =>
          !currentUser ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
  };

export const AdminRoute = ({ component: RouteComponent, ...rest }) => {
    const {userInfo} = useContext(AuthContext);
    return (
      <Route
        {...rest}
        render={routeProps =>
          userInfo && userInfo.admin ? (
            <RouteComponent {...routeProps} />
          ) : (
            <Redirect to={"/"} />
          )
        }
      />
    );
  };