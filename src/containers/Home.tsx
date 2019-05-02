import React from "react";

import Home, { HomeProps } from "../components/Home";
import { RouteComponentProps, withRouter } from "react-router";

type EnhancedHomeProps = HomeProps & RouteComponentProps;

const HomeContainer: React.FC<EnhancedHomeProps> = ({ history }) => {
  const onLoginButtonClicked = () => history.push("/login");
  const onSignUpButtonClicked = () => history.push("/signup");

  return (
    <Home
      onLoginButtonClicked={onLoginButtonClicked}
      onSignUpButtonClicked={onSignUpButtonClicked}
    />
  );
};

export default withRouter(HomeContainer);
