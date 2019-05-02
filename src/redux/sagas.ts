import { all, fork } from "redux-saga/effects";

import { rootSaga as signUp } from "./modules/signUp";
import { rootSaga as login } from "./modules/login";

export default function* rootSaga() {
  yield all([fork(signUp), fork(login)]);
}
