import React, { Component, useContext, FC } from "react";
import { Route, Redirect, RouteProps } from "react-router";
import Firebase, { FirebaseContext } from "../firebase";

const ProtectedRoute: React.FC<RouteProps> = ({ component, ...rest }) => {
  const firebase = useContext(FirebaseContext) as Firebase;

  return (
    <Route
      {...rest}
      render={props =>
        firebase.isLoggedIn() ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
