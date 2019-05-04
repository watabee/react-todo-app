import React from "react";
import Helmet from "react-helmet";
import {
  Form,
  Button,
  Message,
  Header,
  Grid,
  Segment
} from "semantic-ui-react";

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
    <Helmet>
      <title>Join Todo | Todo</title>
    </Helmet>
    <div className="signup-form">
      <Grid verticalAlign="middle" textAlign="center">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal">
            Join Todo
          </Header>

          <Form loading={isLoading} error={error ? true : false} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                label="E-mail address"
                onChange={onEmailTextChanged}
              />
              <Form.Input
                type="password"
                fluid
                icon="lock"
                iconPosition="left"
                label="Password"
                onChange={onPasswordTextChanged}
              />
              {error && <Message error header="Error" content={error} />}
              <Button
                fluid
                color="teal"
                size="large"
                disabled={!canSignUp}
                onClick={onButtonClicked}
              >
                Create an account
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    </div>
  </>
);

export default SignUp;
