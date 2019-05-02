import React from "react";
import { Form, Button, Message, Header } from "semantic-ui-react";

export interface LoginProps {
  isLoading: boolean;
  canLogin: boolean;
  error?: string;
  onEmailTextChanged: (e: any) => void;
  onPasswordTextChanged: (e: any) => void;
  onButtonClicked: () => void;
}

const Login: React.FC<LoginProps> = ({
  isLoading = false,
  canLogin = false,
  error = undefined,
  onEmailTextChanged = () => {},
  onPasswordTextChanged = () => {},
  onButtonClicked = () => {}
}) => (
  <>
    <Header as="h2">Login</Header>
    <Form loading={isLoading} error={error ? true : false} widths="equal">
      <Form.Input fluid label="Email address" onChange={onEmailTextChanged} />
      <Form.Input fluid label="Password" onChange={onPasswordTextChanged} />
      {error && <Message error header="Error" content={error} />}
      <Button disabled={!canLogin} onClick={onButtonClicked}>
        Login
      </Button>
    </Form>
  </>
);

export default Login;
