import { firestore } from "firebase/app";
import { Reducer } from "redux";
import Firebase from "../../firebase";
import { put, call, takeLatest } from "redux-saga/effects";
import { TodoStatus, TodoEntity } from "../../models/todo";

const UPDATE_TODOS_START = "todoApp/todos/UPDATE_TODOS_START";
const UPDATE_TODOS_SUCCEED = "todoApp/todos/UPDATE_TODOS_SUCCEED";
const UPDATE_TODOS_FAIL = "todoApp/todos/UPDATE_TODOS_FAIL";
const UPDATE_TODO_STATUS_START = "todoApp/todos/UPDATE_TODO_STATUS_START";
const UPDATE_TODO_STATUS_SUCCEED = "todoApp/todos/UPDATE_TODO_STATUS_SUCCEED";
const UPDATE_TODO_STATUS_FAIL = "todoApp/todos/UPDATE_TODO_STATUS_FAIL";
const ADD_TODO_START = "todoApp/todos/ADD_TODO_START";
const ADD_TODO_SUCCEED = "todoApp/todos/ADD_TODO_SUCCEED";
const ADD_TODO_FAIL = "todoApp/todos/ADD_TODO_FAIL";
const UPDATE_INPUT_TEXT = "todoApp/todos/UPDATE_INPUT_TEXT";

interface UpdateTodosResult {
  todoTodos: TodoEntity[];
  doneTodos: TodoEntity[];
}

interface UpdateTodoStatusParams {
  firebase: Firebase;
  todo: TodoEntity;
  newStatus: TodoStatus;
}

interface AddTodoParams {
  firebase: Firebase;
  title: string;
}

interface UpdateInputTextParams {
  text: string;
}

export const todosActions = {
  updateTodosStart: () => ({
    type: UPDATE_TODOS_START as typeof UPDATE_TODOS_START
  }),

  updateTodosSucceed: (result: UpdateTodosResult) => ({
    type: UPDATE_TODOS_SUCCEED as typeof UPDATE_TODOS_SUCCEED,
    payload: { result }
  }),

  updateTodosFail: (error: Error) => ({
    type: UPDATE_TODOS_FAIL as typeof UPDATE_TODOS_FAIL,
    payload: { error }
  }),

  updateTodoStatusStart: (params: UpdateTodoStatusParams) => ({
    type: UPDATE_TODO_STATUS_START as typeof UPDATE_TODO_STATUS_START,
    payload: { params }
  }),

  updateTodoStatusSucceed: () => ({
    type: UPDATE_TODO_STATUS_SUCCEED as typeof UPDATE_TODO_STATUS_SUCCEED
  }),

  updateTodoStatusFail: (error: Error) => ({
    type: UPDATE_TODO_STATUS_FAIL as typeof UPDATE_TODO_STATUS_FAIL,
    payload: { error }
  }),

  addTodoStart: (params: AddTodoParams) => ({
    type: ADD_TODO_START as typeof ADD_TODO_START,
    payload: { params }
  }),

  addTodoSucceed: () => ({
    type: ADD_TODO_SUCCEED as typeof ADD_TODO_SUCCEED
  }),

  addTodoFail: (error: firestore.FirestoreError) => ({
    type: ADD_TODO_FAIL as typeof ADD_TODO_FAIL,
    payload: { error },
    error: true
  }),

  updateInputText: (params: UpdateInputTextParams) => ({
    type: UPDATE_INPUT_TEXT as typeof UPDATE_INPUT_TEXT,
    payload: { params }
  })
};

type TodosAction =
  | ReturnType<typeof todosActions.updateTodosStart>
  | ReturnType<typeof todosActions.updateTodosSucceed>
  | ReturnType<typeof todosActions.updateTodosFail>
  | ReturnType<typeof todosActions.updateTodoStatusStart>
  | ReturnType<typeof todosActions.updateTodoStatusSucceed>
  | ReturnType<typeof todosActions.updateTodoStatusFail>
  | ReturnType<typeof todosActions.addTodoStart>
  | ReturnType<typeof todosActions.addTodoSucceed>
  | ReturnType<typeof todosActions.addTodoFail>
  | ReturnType<typeof todosActions.updateInputText>;

export interface TodosState {
  isLoading: boolean;
  isAddingTodo: boolean;
  todoTodos: TodoEntity[];
  doneTodos: TodoEntity[];
  inputText: string;
  error?: Error;
}

const initialState: TodosState = {
  isLoading: true,
  isAddingTodo: false,
  todoTodos: [],
  doneTodos: [],
  inputText: ""
};

export const reducer: Reducer<TodosState, TodosAction> = (
  state: TodosState = initialState,
  action: TodosAction
) => {
  switch (action.type) {
    case UPDATE_TODOS_START:
      return {
        ...state,
        isLoading: true,
        error: undefined,
        inputText: ""
      };

    case UPDATE_TODOS_SUCCEED:
      return {
        ...state,
        todoTodos: action.payload.result.todoTodos,
        doneTodos: action.payload.result.doneTodos,
        isLoading: false,
        error: undefined
      };

    case UPDATE_TODOS_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };

    case UPDATE_TODO_STATUS_START:
      return {
        ...state
      };

    case UPDATE_TODO_STATUS_SUCCEED:
      return {
        ...state
      };

    case UPDATE_TODO_STATUS_FAIL:
      return {
        ...state,
        error: action.payload.error
      };

    case ADD_TODO_START:
      return {
        ...state,
        isAddingTodo: true,
        error: undefined
      };

    case ADD_TODO_SUCCEED:
      return {
        ...state,
        isAddingTodo: false,
        inputText: ""
      };

    case ADD_TODO_FAIL:
      return {
        ...state,
        isAddingTodo: false,
        error: action.payload.error
      };

    case UPDATE_INPUT_TEXT:
      return {
        ...state,
        inputText: action.payload.params.text
      };

    default:
      return state;
  }
};

function* updateTodoStatus(
  action: ReturnType<typeof todosActions.updateTodoStatusStart>
) {
  try {
    const { firebase, todo, newStatus } = action.payload.params;

    yield call(firebase.updateTodoStatus, todo, newStatus);
    yield put(todosActions.updateTodoStatusSucceed());
  } catch (error) {
    yield put(todosActions.updateTodoStatusFail(error));
  }
}

function* addTodo(action: ReturnType<typeof todosActions.addTodoStart>) {
  try {
    const { firebase, title } = action.payload.params;

    yield call(firebase.addTodo, title);

    yield put(todosActions.addTodoSucceed());
  } catch (error) {
    console.log(error);
    yield put(todosActions.addTodoFail(error));
  }
}

export function* rootSaga() {
  yield takeLatest(ADD_TODO_START, addTodo);
  yield takeLatest(UPDATE_TODO_STATUS_START, updateTodoStatus);
}
