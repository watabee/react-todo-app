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
import { Link } from "react-router-dom";

interface LoginProps {
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
    <Helmet>
      <title>Login | Todo</title>
    </Helmet>
    <div className="login-form">
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" textAlign="center" color="teal">
            Log in to Todo
          </Header>

          <Form loading={isLoading} error={error ? true : false} size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={onEmailTextChanged}
              />
              <Form.Input
                type="password"
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={onPasswordTextChanged}
              />
              {error && <Message error header="Error" content={error} />}
              <Button
                fluid
                color="teal"
                size="large"
                disabled={!canLogin}
                onClick={onButtonClicked}
              >
                Login
              </Button>
            </Segment>
          </Form>
          <Message>
            New to us? <Link to="/signup">Create an account</Link>.
          </Message>
        </Grid.Column>
      </Grid>
    </div>
  </>
);

export default Login;
