import React, { useEffect, useContext } from "react";
import { Switch, Route, Redirect } from "react-router";
import Firebase, { FirebaseContext } from "./firebase";

import ProtectedRoute from "./components/ProtectedRoute";
import Todos from "./containers/Todos";
import SignUp from "./containers/SignUp";
import Login from "./containers/Login";

import "./App.css";
import { connect } from "react-redux";
import { Dispatch, bindActionCreators } from "redux";
import { userActions } from "./redux/modules/user";

interface DispatchProps {
  authStateChanged: (user: firebase.User | null) => void;
}

const App: React.FC<DispatchProps> = ({ authStateChanged }) => {
  const firebase = useContext(FirebaseContext) as Firebase;

  useEffect(() => {
    const unsubscribe = firebase.observeAuthStateChanged(authStateChanged);

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Switch>
        <ProtectedRoute path="/todos" exact component={Todos} />
        <Route path="/signup" component={SignUp} />
        <Route path="/" exact component={Login} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      authStateChanged: (user: firebase.User | null) =>
        userActions.authStateChanged({ user })
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(App);
