import { AppState } from "./state";
import { combineReducers } from "redux";

import { reducer as signUp } from "./modules/signUp";
import { reducer as login } from "./modules/login";
import { reducer as todos } from "./modules/todos";

export default combineReducers<AppState>({
  signUp,
  login,
  todos
});
