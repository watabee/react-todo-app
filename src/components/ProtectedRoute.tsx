import React, { useContext, FC } from "react";
import { Route, Redirect, RouteProps } from "react-router";
import Firebase, { FirebaseContext } from "../firebase";

const ProtectedRoute: React.FC<RouteProps> = props => {
  const firebase = useContext(FirebaseContext) as Firebase;
  return firebase.isLoggedIn() ? <Route {...props} /> : <Redirect to="/" />;
};

export default ProtectedRoute;
