import React from "react";
import { Form, Button, Message, Header } from "semantic-ui-react";

import "./SignUp.css";

export interface SignUpProps {
  isLoading: boolean;
  canSignUp: boolean;
  error?: string;
  onEmailTextChanged: (e: any) => void;
  onPasswordTextChanged: (e: any) => void;
  onButtonClicked: () => void;
}

const SignUp: React.FC<SignUpProps> = ({
  isLoading = false,
  canSignUp = false,
  error = undefined,
  onEmailTextChanged = () => {},
  onPasswordTextChanged = () => {},
  onButtonClicked = () => {}
}) => (
  <>
    <Header as="h2">SignUp</Header>
    <Form loading={isLoading} error={error ? true : false} widths="equal">
      <Form.Input fluid label="Email address" onChange={onEmailTextChanged} />
      <Form.Input
        type="password"
        fluid
        label="Password"
        onChange={onPasswordTextChanged}
      />
      {error && <Message error header="Error" content={error} />}
      <Button disabled={!canSignUp} onClick={onButtonClicked}>
        SignUp
      </Button>
    </Form>
  </>
);

export default SignUp;
