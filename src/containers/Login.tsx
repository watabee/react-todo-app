import React, { useState, useContext, useEffect, useCallback } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import Login from "../components/Login";
import { AppState } from "../redux/state";
import { loginActions, LoginState } from "../redux/modules/login";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

const LoginContainer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useContext(FirebaseContext) as Firebase;
  const { history } = useReactRouter();

  const { isLoading, error } = useSelector<AppState, LoginState>(
    state => state.login
  );
  const dispatch = useDispatch();

  const canLogin = email.length > 0 && password.length > 0;

  const onEmailTextChanged = (e: any) => setEmail(e.nativeEvent.target.value);
  const onPasswordTextChanged = (e: any) =>
    setPassword(e.nativeEvent.target.value);

  const onButtonClicked = useCallback(
    () =>
      dispatch(loginActions.loginStart({ history, firebase, email, password })),
    [dispatch, history, firebase, email, password]
  );

  useEffect(() => {
    return () => {
      dispatch(loginActions.resetError());
    };
  }, []);

  return (
    <Login
      isLoading={isLoading}
      canLogin={canLogin}
      error={error ? error.message : undefined}
      onEmailTextChanged={onEmailTextChanged}
      onPasswordTextChanged={onPasswordTextChanged}
      onButtonClicked={onButtonClicked}
    />
  );
};

export default LoginContainer;
