import React, { useContext, useEffect, useCallback } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import TodosComponent from "../components/Todos";
import { todosActions, TodosState } from "../redux/modules/todos";
import { useSelector, useDispatch } from "react-redux";
import { TodoEntity, TodoStatus } from "../models/todo";
import { AppState } from "../redux/state";

const getErrorMessage = (error?: Error) => {
  if (error === undefined) {
    return undefined;
  } else if (error.message !== undefined) {
    return error.message;
  } else {
    return "Error occurred";
  }
};

const TodosContainer: React.FC = () => {
  const firebase = useContext(FirebaseContext) as Firebase;
  const {
    isLoading,
    isAddingTodo,
    todoTodos,
    doneTodos,
    inputText,
    error
  } = useSelector<AppState, TodosState>(state => state.todos);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(todosActions.updateTodosStart());
    const unsubscribe = firebase.observeTodos(
      (todoTodos, doneTodos) =>
        dispatch(todosActions.updateTodosSucceed({ todoTodos, doneTodos })),
      error => dispatch(todosActions.updateTodosFail(error))
    );

    return () => unsubscribe();
  }, [dispatch]);

  const onFormSubmitted = useCallback(() => {
    if (inputText.trim().length > 0) {
      dispatch(todosActions.addTodoStart({ firebase, title: inputText }));
    }
  }, [dispatch, inputText, firebase]);

  const onCheckboxClicked = useCallback(
    (todo: TodoEntity) => {
      const newStatus: TodoStatus =
        todo.status === TodoStatus.Todo ? TodoStatus.Done : TodoStatus.Todo;
      dispatch(
        todosActions.updateTodoStatusStart({ firebase, todo, newStatus })
      );
    },
    [dispatch, firebase]
  );

  const onInputTextChanged = useCallback(
    (text: string) => dispatch(todosActions.updateInputText({ text })),
    [dispatch]
  );

  const onDeleteButtonClicked = useCallback(
    (todo: TodoEntity) =>
      dispatch(todosActions.updateTodoToDeleteStart({ firebase, todo })),
    [dispatch, firebase]
  );

  return (
    <TodosComponent
      todoTodos={todoTodos}
      doneTodos={doneTodos}
      inputText={inputText}
      isLoading={isLoading}
      isAddingTodo={isAddingTodo}
      errorMessage={getErrorMessage(error)}
      onCheckboxClicked={onCheckboxClicked}
      onInputTextChanged={onInputTextChanged}
      onFormSubmitted={onFormSubmitted}
      onDeleteButtonClicked={onDeleteButtonClicked}
    />
  );
};

export default TodosContainer;
