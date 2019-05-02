import React from "react";

import { Header, Button } from "semantic-ui-react";

export interface HomeProps {
  onLoginButtonClicked?: () => void;
  onSignUpButtonClicked?: () => void;
}

const Home: React.FC<HomeProps> = ({
  onLoginButtonClicked = () => {},
  onSignUpButtonClicked = () => {}
}) => {
  return (
    <>
      <Header as="h2">TODO管理アプリ</Header>
      <Button onClick={onLoginButtonClicked}>Login</Button>
      <Button onClick={onSignUpButtonClicked}>SignUp</Button>
    </>
  );
};

export default Home;
