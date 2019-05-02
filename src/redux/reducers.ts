import { AppState } from "./state";
import { combineReducers } from "redux";

import { reducer as signUp } from "./modules/signUp";

export default combineReducers<AppState>({
  signUp
});
