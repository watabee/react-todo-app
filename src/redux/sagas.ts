import { all, fork } from "redux-saga/effects";

import { rootSaga as signUp } from "./modules/signUp";

export default function* rootSaga() {
  yield all([fork(signUp)]);
}
