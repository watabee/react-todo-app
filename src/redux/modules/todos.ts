import { firestore } from "firebase/app";
import { Reducer } from "redux";
import Firebase from "../../firebase";
import { put, call, takeLatest } from "redux-saga/effects";

const ADD_TODO_START = "todoApp/todos/ADD_TODO_START";
const ADD_TODO_SUCCEED = "todoApp/todos/ADD_TODO_SUCCEED";
const ADD_TODO_FAIL = "todoApp/todos/ADD_TODO_FAIL";

interface AddTodoParams {
  firebase: Firebase;
  title: string;
  note: string;
}

interface AddTodoResult {
  docRef: firestore.DocumentReference;
}

export const todosActions = {
  addTodoStart: (params: AddTodoParams) => ({
    type: ADD_TODO_START as typeof ADD_TODO_START,
    payload: { params }
  }),

  addTodoSucceed: (result: AddTodoResult) => ({
    type: ADD_TODO_SUCCEED as typeof ADD_TODO_SUCCEED,
    payload: { result }
  }),

  addTodoFail: (error: firestore.FirestoreError) => ({
    type: ADD_TODO_FAIL as typeof ADD_TODO_FAIL,
    payload: { error },
    error: true
  })
};

type TodosAction =
  | ReturnType<typeof todosActions.addTodoStart>
  | ReturnType<typeof todosActions.addTodoSucceed>
  | ReturnType<typeof todosActions.addTodoFail>;

export interface TodosState {
  isAddingTodo: boolean;
  error?: firestore.FirestoreError;
}

const initialState: TodosState = {
  isAddingTodo: false
};

export const reducer: Reducer<TodosState, TodosAction> = (
  state: TodosState = initialState,
  action: TodosAction
) => {
  switch (action.type) {
    case ADD_TODO_START:
      return {
        ...state,
        isAddingTodo: true,
        error: undefined
      };

    case ADD_TODO_SUCCEED:
      return {
        ...state,
        isAddingTodo: false
      };

    case ADD_TODO_FAIL:
      return {
        ...state,
        isAddingTodo: false,
        error: action.payload.error
      };

    default:
      return state;
  }
};

function* addTodo(action: ReturnType<typeof todosActions.addTodoStart>) {
  try {
    const { firebase, title, note } = action.payload.params;

    const docRef = yield call(firebase.addTodo, title, note);

    yield put(todosActions.addTodoSucceed({ docRef }));
  } catch (error) {
    console.log(error);
    yield put(todosActions.addTodoFail(error));
  }
}

export function* rootSaga() {
  yield takeLatest(ADD_TODO_START, addTodo);
}
