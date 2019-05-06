import * as firebase from "firebase/app";
import { Reducer } from "redux";

export const AUTH_STATE_CHANGED = "todoApp/user/AUTH_STATE_CHANGED";

interface AuthStateChangedParams {
  user: firebase.User | null;
}

export const userActions = {
  authStateChanged: (params: AuthStateChangedParams) => ({
    type: AUTH_STATE_CHANGED as typeof AUTH_STATE_CHANGED,
    payload: { params }
  })
};

type UserAction = ReturnType<typeof userActions.authStateChanged>;

export interface UserState {
  user: firebase.User | null;
}

const initialState: UserState = {
  user: null
};

export const reducer: Reducer<UserState, UserAction> = (
  state: UserState = initialState,
  action: UserAction
): UserState => {
  if (action.type === AUTH_STATE_CHANGED) {
    return {
      ...state,
      user: action.payload.params.user
    };
  } else {
    return state;
  }
};
