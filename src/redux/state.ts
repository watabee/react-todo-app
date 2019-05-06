import { HomeState } from "./modules/home";
import { UserState } from "./modules/user";
import { TodosState } from "./modules/todos";
import { SignUpState } from "./modules/signUp";
import { LoginState } from "./modules/login";

export interface AppState {
  home: HomeState;
  user: UserState;
  signUp: SignUpState;
  login: LoginState;
  todos: TodosState;
}
