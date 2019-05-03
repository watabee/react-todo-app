import React, { useContext, useState, useEffect } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import TodosComponent, { TodosProps } from "../components/Todos";
import { firestore } from "firebase/app";
import { TodosState, todosActions } from "../redux/modules/todos";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Todo } from "../models/todo";
import { AppState } from "../redux/state";

interface StateProps {
  todoTodos: Todo[];
  inProgressTodos: Todo[];
  doneTodos: Todo[];
  isGettingTodos: boolean;
  isAddingTodo: boolean;
  error?: firestore.FirestoreError;
}

interface DispatchProps {
  getTodos: (firebase: Firebase) => void;
  addTodo: (firebase: Firebase, title: string, note: string) => void;
}

type EnhancedTodosProps = TodosProps & StateProps & DispatchProps;

const TodosContainer: React.FC<EnhancedTodosProps> = ({
  todoTodos,
  inProgressTodos,
  doneTodos,
  isGettingTodos,
  isAddingTodo,
  error,
  getTodos,
  addTodo
}) => {
  const firebase = useContext(FirebaseContext) as Firebase;
  const [count, setCount] = useState(1);

  const onAddTodoButtonClicked = () => {
    addTodo(firebase, `タイトル${count}`, "NOTE");
    setCount(prevCount => prevCount + 1);
  };

  useEffect(() => {
    getTodos(firebase);
  }, []);

  return (
    <TodosComponent
      todoTodos={todoTodos}
      inProgressTodos={inProgressTodos}
      doneTodos={doneTodos}
      isGettingTodos={isGettingTodos}
      isAddingTodo={isAddingTodo}
      error={error}
      onAddTodoButtonClicked={onAddTodoButtonClicked}
    />
  );
};

const mapStateToProps = (state: AppState): StateProps => ({
  todoTodos: state.todos.todoTodos,
  inProgressTodos: state.todos.inProgressTodos,
  doneTodos: state.todos.doneTodos,
  isGettingTodos: state.todos.isGettingTodos,
  isAddingTodo: state.todos.isAddingTodo,
  error: state.todos.error
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      getTodos: (firebase: Firebase) =>
        todosActions.getTodosStart({ firebase }),
      addTodo: (firebase: Firebase, title: string, note: string) =>
        todosActions.addTodoStart({ firebase, title, note })
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodosContainer);
