import React, { useState, useContext, useEffect } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import Login, { LoginProps } from "../components/Login";
import { AppState } from "../redux/state";
import { Dispatch, bindActionCreators } from "redux";
import { loginActions } from "../redux/modules/login";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { History } from "history";

interface StateProps {
  isLoading: boolean;
  error?: string;
}

interface DispatchProps {
  loginStart: (
    history: History,
    firebase: Firebase,
    email: string,
    password: string
  ) => void;

  resetError: () => void;
}

type EnhancedSignUpProps = LoginProps &
  StateProps &
  DispatchProps &
  RouteComponentProps;

const LoginContainer: React.FC<EnhancedSignUpProps> = ({
  isLoading,
  error,
  loginStart,
  resetError,
  history
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useContext(FirebaseContext) as Firebase;

  const canLogin = email.length > 0 && password.length > 0;

  const onEmailTextChanged = (e: any) => setEmail(e.nativeEvent.target.value);
  const onPasswordTextChanged = (e: any) =>
    setPassword(e.nativeEvent.target.value);

  const onButtonClicked = () => {
    loginStart(history, firebase, email, password);
  };

  useEffect(() => {
    return () => resetError();
  }, []);

  return (
    <Login
      isLoading={isLoading}
      canLogin={canLogin}
      error={error}
      onEmailTextChanged={onEmailTextChanged}
      onPasswordTextChanged={onPasswordTextChanged}
      onButtonClicked={onButtonClicked}
    />
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.login.isLoading,
  error: state.login.error ? state.login.error.message : undefined
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      loginStart: (
        history: History,
        firebase: Firebase,
        email: string,
        password: string
      ) => loginActions.loginStart({ history, firebase, email, password }),

      resetError: () => loginActions.resetError()
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginContainer);
