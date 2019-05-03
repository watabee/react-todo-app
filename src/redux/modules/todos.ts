import { firestore } from "firebase/app";
import { Reducer } from "redux";
import Firebase from "../../firebase";
import { put, call, takeLatest, all } from "redux-saga/effects";
import { Todo, TodoStatus } from "../../models/todo";

const GET_TODOS_START = "todoApp/todos/GET_TODOS_START";
const GET_TODOS_SUCCEED = "todoApp/todos/GET_TODOS_SUCCEED";
const GET_TODOS_FAIL = "todoApp/todos/GET_TODOS_FAIL";
const ADD_TODO_START = "todoApp/todos/ADD_TODO_START";
const ADD_TODO_SUCCEED = "todoApp/todos/ADD_TODO_SUCCEED";
const ADD_TODO_FAIL = "todoApp/todos/ADD_TODO_FAIL";

interface GetTodosParams {
  firebase: Firebase;
}

interface GetTodosResult {
  todoTodos: Todo[];
  inProgressTodos: Todo[];
  doneTodos: Todo[];
}

interface AddTodoParams {
  firebase: Firebase;
  title: string;
  note: string;
}

interface AddTodoResult {
  docRef: firestore.DocumentReference;
}

export const todosActions = {
  getTodosStart: (params: GetTodosParams) => ({
    type: GET_TODOS_START as typeof GET_TODOS_START,
    payload: { params }
  }),

  getTodosSucceed: (result: GetTodosResult) => ({
    type: GET_TODOS_SUCCEED as typeof GET_TODOS_SUCCEED,
    payload: { result }
  }),

  getTodosFail: (error: firestore.FirestoreError) => ({
    type: GET_TODOS_FAIL as typeof GET_TODOS_FAIL,
    payload: { error },
    error: true
  }),

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
  | ReturnType<typeof todosActions.getTodosStart>
  | ReturnType<typeof todosActions.getTodosSucceed>
  | ReturnType<typeof todosActions.getTodosFail>
  | ReturnType<typeof todosActions.addTodoStart>
  | ReturnType<typeof todosActions.addTodoSucceed>
  | ReturnType<typeof todosActions.addTodoFail>;

export interface TodosState {
  isGettingTodos: boolean;
  isAddingTodo: boolean;
  todoTodos: Todo[];
  inProgressTodos: Todo[];
  doneTodos: Todo[];
  error?: firestore.FirestoreError;
}

const initialState: TodosState = {
  isGettingTodos: false,
  isAddingTodo: false,
  todoTodos: [],
  inProgressTodos: [],
  doneTodos: []
};

export const reducer: Reducer<TodosState, TodosAction> = (
  state: TodosState = initialState,
  action: TodosAction
) => {
  switch (action.type) {
    case GET_TODOS_START:
      return {
        ...state,
        isGettingTodos: true,
        error: undefined
      };

    case GET_TODOS_SUCCEED:
      return {
        ...state,
        isGettingTodos: false,
        todoTodos: action.payload.result.todoTodos,
        inProgressTodos: action.payload.result.inProgressTodos,
        doneTodos: action.payload.result.doneTodos
      };

    case GET_TODOS_FAIL:
      return {
        ...state,
        isGettingTodos: false,
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

function* getTodos(action: ReturnType<typeof todosActions.getTodosStart>) {
  try {
    const { firebase } = action.payload.params;

    const [todoTodos, inProgressTodos, doneTodos] = yield all([
      call(firebase.getTodos, TodoStatus.Todo),
      call(firebase.getTodos, TodoStatus.InProgress),
      call(firebase.getTodos, TodoStatus.Done)
    ]);

    yield put(
      todosActions.getTodosSucceed({ todoTodos, inProgressTodos, doneTodos })
    );
  } catch (error) {
    console.log(error);
    yield put(todosActions.getTodosFail(error));
  }
}

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
  yield takeLatest(GET_TODOS_START, getTodos);
}
