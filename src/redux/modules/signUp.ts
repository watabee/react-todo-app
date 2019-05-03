import { Reducer } from "redux";
import Firebase from "../../firebase";
import { call, put, takeLatest } from "redux-saga/effects";
import { History } from "history";

const SIGN_UP_START = "todoApp/signUp/SIGN_UP_START";
const SIGN_UP_SUCCEED = "todoApp/signUp/SIGN_UP_SUCCEED";
const SIGN_UP_FAIL = "todoApp/signUp/SIGN_UP_FAIL";
const RESET_ERROR = "todoApp/signUp/RESET_ERROR";

interface SignUpParams {
  history: History;
  firebase: Firebase;
  email: string;
  password: string;
}

interface SignUpResult {
  credencial: firebase.auth.UserCredential;
}

export const signUpActions = {
  signUpStart: (params: SignUpParams) => ({
    type: SIGN_UP_START as typeof SIGN_UP_START,
    payload: { params }
  }),

  signUpSucceed: (result: SignUpResult) => ({
    type: SIGN_UP_SUCCEED as typeof SIGN_UP_SUCCEED,
    payload: { result }
  }),

  signUpFail: (error: firebase.auth.Error) => ({
    type: SIGN_UP_FAIL as typeof SIGN_UP_FAIL,
    payload: { error },
    error: true
  }),

  resetError: () => ({
    type: RESET_ERROR as typeof RESET_ERROR
  })
};

export type SignUpAction =
  | ReturnType<typeof signUpActions.signUpStart>
  | ReturnType<typeof signUpActions.signUpSucceed>
  | ReturnType<typeof signUpActions.signUpFail>
  | ReturnType<typeof signUpActions.resetError>;

export interface SignUpState {
  credencial?: firebase.auth.UserCredential;
  isLoading: boolean;
  error?: firebase.auth.Error;
}

const initialState: SignUpState = {
  isLoading: false
};

export const reducer: Reducer<SignUpState, SignUpAction> = (
  state: SignUpState = initialState,
  action: SignUpAction
): SignUpState => {
  switch (action.type) {
    case SIGN_UP_START:
      return {
        ...state,
        isLoading: true,
        error: undefined
      };

    case SIGN_UP_SUCCEED:
      return {
        ...state,
        credencial: action.payload.result.credencial,
        isLoading: false,
        error: undefined
      };

    case SIGN_UP_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    case RESET_ERROR:
      return {
        ...state,
        error: undefined
      };

    default:
      return state;
  }
};

function* signUp(action: ReturnType<typeof signUpActions.signUpStart>) {
  const { history, firebase, email, password } = action.payload.params;
  try {
    const credencial = yield call(firebase.signUp, email, password);

    yield put(signUpActions.signUpSucceed({ credencial }));

    history.push("/todos");
  } catch (error) {
    console.log(`error: ${error.code} # ${error.message}`);
    yield put(signUpActions.signUpFail(error));
  }
}

export function* rootSaga() {
  yield takeLatest(SIGN_UP_START, signUp);
}
