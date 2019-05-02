import { Reducer } from "redux";
import Firebase from "../../firebase";
import { call, put, takeLatest } from "redux-saga/effects";
import { History } from "history";

const LOGIN_START = "todoApp/signUp/LOGIN_START";
const LOGIN_SUCCEED = "todoApp/signUp/LOGIN_SUCCEED";
const LOGIN_FAIL = "todoApp/signUp/LOGIN_FAIL";

interface LoginParams {
  history: History;
  firebase: Firebase;
  email: string;
  password: string;
}

interface LoginResult {
  credencial: firebase.auth.UserCredential;
}

export const loginActions = {
  loginStart: (params: LoginParams) => ({
    type: LOGIN_START as typeof LOGIN_START,
    payload: { params }
  }),

  loginSucceed: (result: LoginResult) => ({
    type: LOGIN_SUCCEED as typeof LOGIN_SUCCEED,
    payload: { result }
  }),

  loginFail: (error: firebase.auth.Error) => ({
    type: LOGIN_FAIL as typeof LOGIN_FAIL,
    payload: { error },
    error: true
  })
};

export type LoginAction =
  | ReturnType<typeof loginActions.loginStart>
  | ReturnType<typeof loginActions.loginSucceed>
  | ReturnType<typeof loginActions.loginFail>;

export interface LoginState {
  credencial?: firebase.auth.UserCredential;
  isLoading: boolean;
  error?: firebase.auth.Error;
}

const initialState: LoginState = {
  isLoading: false
};

export const reducer: Reducer<LoginState, LoginAction> = (
  state: LoginState = initialState,
  action: LoginAction
): LoginState => {
  switch (action.type) {
    case LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: undefined
      };

    case LOGIN_SUCCEED:
      return {
        ...state,
        credencial: action.payload.result.credencial,
        isLoading: false,
        error: undefined
      };

    case LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    default:
      return state;
  }
};

function* login(action: ReturnType<typeof loginActions.loginStart>) {
  const { history, firebase, email, password } = action.payload.params;
  console.log(`signUp start: email=${email}, password=${password}`);
  try {
    const credencial = yield call(firebase.signIn, email, password);

    yield put(loginActions.loginSucceed({ credencial }));

    history.push("/todos");
  } catch (error) {
    console.log(`error: ${error.code} # ${error.message}`);
    yield put(loginActions.loginFail(error));
  }
}

export function* rootSaga() {
  yield takeLatest(LOGIN_START, login);
}
