import React, { useContext, useState } from "react";
import Firebase, { FirebaseContext } from "../firebase";

import TodosComponent, { TodosProps } from "../components/Todos";
import { firestore } from "firebase/app";
import { TodosState, todosActions } from "../redux/modules/todos";
import { Dispatch, bindActionCreators } from "redux";
import { connect } from "react-redux";

interface StateProps {
  isAddingTodo: boolean;
  error?: firestore.FirestoreError;
}

interface DispatchProps {
  addTodo: (firebase: Firebase, title: string, note: string) => void;
}

type EnhancedTodosProps = TodosProps & StateProps & DispatchProps;

const TodosContainer: React.FC<EnhancedTodosProps> = ({
  isAddingTodo,
  error,
  addTodo
}) => {
  const firebase = useContext(FirebaseContext) as Firebase;
  const [count, setCount] = useState(1);

  const onAddTodoButtonClicked = () => {
    addTodo(firebase, `タイトル${count}`, "NOTE");
    setCount(prevCount => prevCount + 1);
  };

  return <TodosComponent onAddTodoButtonClicked={onAddTodoButtonClicked} />;
};

const mapStateToProps = (state: TodosState): StateProps => ({
  isAddingTodo: state.isAddingTodo,
  error: state.error
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(
    {
      addTodo: (firebase: Firebase, title: string, note: string) =>
        todosActions.addTodoStart({ firebase, title, note })
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TodosContainer);
