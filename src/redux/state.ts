import { UserState } from "./modules/user";
import { TodosState } from "./modules/todos";
import { SignUpState } from "./modules/signUp";
import { LoginState } from "./modules/login";

export interface AppState {
  user: UserState;
  signUp: SignUpState;
  login: LoginState;
  todos: TodosState;
}
