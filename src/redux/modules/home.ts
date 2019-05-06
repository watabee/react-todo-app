import { AppState } from "./../state";
import { Reducer } from "redux";
import { take, race, delay, put, select } from "redux-saga/effects";
import { AUTH_STATE_CHANGED } from "./user";

const WAITING = "todoApp/home/WAITING";
const REDIRECT_TO_LOGIN = "todoApp/home/LOGIN";
const REDIRECT_TO_TODOS = "todoApp/home/TODOS";
const RESET_STATE = "todoApp/home/RESET_STATE";

export const homeActions = {
  waiting: () => ({
    type: WAITING as typeof WAITING
  }),

  redirectToLogin: () => ({
    type: REDIRECT_TO_LOGIN as typeof REDIRECT_TO_LOGIN
  }),

  redirectToTodos: () => ({
    type: REDIRECT_TO_TODOS as typeof REDIRECT_TO_TODOS
  }),

  resetState: () => ({
    type: RESET_STATE as typeof RESET_STATE
  })
};

type HomeAction =
  | ReturnType<typeof homeActions.waiting>
  | ReturnType<typeof homeActions.redirectToLogin>
  | ReturnType<typeof homeActions.redirectToTodos>
  | ReturnType<typeof homeActions.resetState>;

export interface HomeState {
  redirectToLogin: boolean;
  redirectToTodos: boolean;
}

const initialState: HomeState = {
  redirectToLogin: false,
  redirectToTodos: false
};

export const reducer: Reducer<HomeState, HomeAction> = (
  state = initialState,
  action: HomeAction
): HomeState => {
  switch (action.type) {
    case WAITING:
      return {
        ...state
      };

    case REDIRECT_TO_LOGIN:
      return {
        ...state,
        redirectToLogin: true
      };

    case REDIRECT_TO_TODOS:
      return {
        ...state,
        redirectToTodos: true
      };

    case RESET_STATE:
      return {
        ...state,
        redirectToLogin: false,
        redirectToTodos: false
      };

    default:
      return state;
  }
};

export function* rootSaga() {
  yield take(WAITING);
  const state: AppState = yield select();
  if (state.user.user) {
    // Already logged in.
    yield put(homeActions.redirectToTodos());
  } else {
    // Even though already logged in, firebase doesn't notify the auth state immediately.
    // So I have to observe changing the state with timeout.
    const { authStateChanged, cencel } = yield race({
      authStateChanged: take(AUTH_STATE_CHANGED),
      cancel: delay(2000)
    });

    if (authStateChanged) {
      yield put(homeActions.redirectToTodos());
    } else {
      yield put(homeActions.redirectToLogin());
    }
  }
}
