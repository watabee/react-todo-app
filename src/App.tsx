import React from "react";
import { Switch, Route, Redirect } from "react-router";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./containers/Home";
import Todos from "./components/Todos";
import SignUp from "./containers/SignUp";
import Login from "./containers/Login";

import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <Switch>
        <ProtectedRoute path="/todos" exact component={Todos} />
        <Route path="/signup" component={SignUp} />
        <Route path="/login" component={Login} />
        <Route path="/" exact component={Home} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default App;
