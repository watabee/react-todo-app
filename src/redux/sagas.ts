import { all, fork } from "redux-saga/effects";

import { rootSaga as signUp } from "./modules/signUp";
import { rootSaga as login } from "./modules/login";
import { rootSaga as todos } from "./modules/todos";

export default function* rootSaga() {
  yield all([fork(signUp), fork(login), fork(todos)]);
}
