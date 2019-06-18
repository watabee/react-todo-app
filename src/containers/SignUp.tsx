import React, { useState, useContext, useEffect, useCallback } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import SignUp from "../components/SignUp";
import { AppState } from "../redux/state";
import { signUpActions, SignUpState } from "../redux/modules/signUp";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

const SignUpContainer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const firebase = useContext(FirebaseContext) as Firebase;
  const { history } = useReactRouter();

  const { isLoading, error } = useSelector<AppState, SignUpState>(
    state => state.signUp
  );
  const dispatch = useDispatch();

  const canSignUp = email.length > 0 && password.length > 0;

  const onEmailTextChanged = (e: any) => setEmail(e.nativeEvent.target.value);
  const onPasswordTextChanged = (e: any) =>
    setPassword(e.nativeEvent.target.value);

  const onButtonClicked = useCallback(
    () =>
      dispatch(
        signUpActions.signUpStart({ history, firebase, email, password })
      ),
    [dispatch, history, firebase, email, password]
  );

  useEffect(() => {
    return () => {
      dispatch(signUpActions.resetError());
    };
  }, [dispatch]);

  return (
    <SignUp
      isLoading={isLoading}
      canSignUp={canSignUp}
      error={error ? error.message : undefined}
      onEmailTextChanged={onEmailTextChanged}
      onPasswordTextChanged={onPasswordTextChanged}
      onButtonClicked={onButtonClicked}
    />
  );
};

export default SignUpContainer;
