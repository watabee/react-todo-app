import React, { useContext, useEffect } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import TodosComponent, { TodosProps } from "../components/Todos";
import { todosActions } from "../redux/modules/todos";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { TodoEntity, TodoStatus } from "../models/todo";
import { AppState } from "../redux/state";

interface StateProps {
  todoTodos: TodoEntity[];
  doneTodos: TodoEntity[];
  isLoading: boolean;
  isAddingTodo: boolean;
  inputText: string;
  error?: Error;
}

interface DispatchProps {
  addTodo: (firebase: Firebase, title: string) => void;
  updateTodosStart: () => void;
  updateTodosSucceed: (
    todoTodos: TodoEntity[],
    doneTodos: TodoEntity[]
  ) => void;
  updateTodosFail: (error: Error) => void;
  updateTodoStatus: (
    firebase: Firebase,
    todo: TodoEntity,
    newStatus: TodoStatus
  ) => void;
  updateInputText: (text: string) => void;
}

type EnhancedTodosProps = TodosProps & StateProps & DispatchProps;

const TodosContainer: React.FC<EnhancedTodosProps> = ({
  todoTodos,
  doneTodos,
  inputText,
  isLoading,
  isAddingTodo,
  error,
  updateTodoStatus,
  addTodo,
  updateTodosStart,
  updateTodosSucceed,
  updateTodosFail,
  updateInputText
}) => {
  const firebase = useContext(FirebaseContext) as Firebase;

  const onFormSubmitted = () => {
    if (inputText.trim().length > 0) {
      addTodo(firebase, inputText);
    }
  };

  useEffect(() => {
    updateTodosStart();
    const unsubscribe = firebase.observeTodos(
      updateTodosSucceed,
      updateTodosFail
    );

    return () => unsubscribe();
  }, []);

  return (
    <TodosComponent
      todoTodos={todoTodos}
      doneTodos={doneTodos}
      inputText={inputText}
      isLoading={isLoading}
      isAddingTodo={isAddingTodo}
      error={error}
      onCheckboxClicked={(todo: TodoEntity) => {
        const newStatus: TodoStatus =
          todo.status === TodoStatus.Todo ? TodoStatus.Done : TodoStatus.Todo;
        updateTodoStatus(firebase, todo, newStatus);
      }}
      onInputTextChanged={updateInputText}
      onFormSubmitted={onFormSubmitted}
    />
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  todoTodos: state.todos.todoTodos,
  doneTodos: state.todos.doneTodos,
  inputText: state.todos.inputText,
  isLoading: state.todos.isLoading,
  isAddingTodo: state.todos.isAddingTodo,
  error: state.todos.error
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      addTodo: (firebase: Firebase, title: string) =>
        todosActions.addTodoStart({ firebase, title }),

      updateTodosStart: () => todosActions.updateTodosStart(),

      updateTodosSucceed: (todoTodos: TodoEntity[], doneTodos: TodoEntity[]) =>
        todosActions.updateTodosSucceed({ todoTodos, doneTodos }),

      updateTodosFail: (error: Error) => todosActions.updateTodosFail(error),

      updateTodoStatus: (
        firebase: Firebase,
        todo: TodoEntity,
        newStatus: TodoStatus
      ) => todosActions.updateTodoStatusStart({ firebase, todo, newStatus }),

      updateInputText: (text: string) => todosActions.updateInputText({ text })
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodosContainer);
