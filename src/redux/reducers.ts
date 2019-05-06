import { AppState } from "./state";
import { combineReducers } from "redux";

import { reducer as home } from "./modules/home";
import { reducer as user } from "./modules/user";
import { reducer as signUp } from "./modules/signUp";
import { reducer as login } from "./modules/login";
import { reducer as todos } from "./modules/todos";

export default combineReducers<AppState>({
  home,
  user,
  signUp,
  login,
  todos
});
