import React, { useState, useContext } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import SignUp, { SignUpProps } from "../components/SignUp";
import { AppState } from "../redux/state";
import { Dispatch, bindActionCreators } from "redux";
import { signUpActions } from "../redux/modules/signUp";
import { connect } from "react-redux";
import { RouteComponentProps } from "react-router";
import { History } from "history";

interface StateProps {
  isLoading: boolean;
  error?: string;
}

interface DispatchProps {
  signUpStart: (
    history: History,
    firebase: Firebase,
    email: string,
    password: string
  ) => void;
}

type EnhancedSignUpProps = SignUpProps &
  StateProps &
  DispatchProps &
  RouteComponentProps;

const SignUpContainer: React.FC<EnhancedSignUpProps> = ({
  isLoading,
  error,
  signUpStart,
  history
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useContext(FirebaseContext) as Firebase;

  const canSignUp = email.length > 0 && password.length > 0;

  const onEmailTextChanged = (e: any) => setEmail(e.nativeEvent.target.value);
  const onPasswordTextChanged = (e: any) =>
    setPassword(e.nativeEvent.target.value);

  const onButtonClicked = () => {
    signUpStart(history, firebase, email, password);
  };

  return (
    <SignUp
      isLoading={isLoading}
      canSignUp={canSignUp}
      error={error}
      onEmailTextChanged={onEmailTextChanged}
      onPasswordTextChanged={onPasswordTextChanged}
      onButtonClicked={onButtonClicked}
    />
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  isLoading: state.signUp.isLoading,
  error: state.signUp.error ? state.signUp.error.message : undefined
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      signUpStart: (
        history: History,
        firebase: Firebase,
        email: string,
        password: string
      ) => signUpActions.signUpStart({ history, firebase, email, password })
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpContainer);
