import { SignUpState } from "./modules/signUp";
import { LoginState } from "./modules/login";

export interface AppState {
  signUp: SignUpState;
  login: LoginState;
}
