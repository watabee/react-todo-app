import React from "react";
import { Header, Button } from "semantic-ui-react";
import { TodoEntity } from "../models/todo";
import { firestore } from "firebase/app";

export interface TodosProps {
  todoTodos: TodoEntity[];
  inProgressTodos: TodoEntity[];
  doneTodos: TodoEntity[];
  isGettingTodos: boolean;
  isAddingTodo: boolean;
  error?: firestore.FirestoreError;
  onAddTodoButtonClicked: () => void;
}

const TodosComponent: React.FC<TodosProps> = ({
  todoTodos = [],
  inProgressTodos = [],
  doneTodos = [],
  isGettingTodos = false,
  isAddingTodo = false,
  error = undefined,
  onAddTodoButtonClicked = () => {}
}) => {
  return (
    <>
      <Header as="h2">Todo一覧</Header>
      <Button onClick={onAddTodoButtonClicked}>TODO作成</Button>
    </>
  );
};

export default TodosComponent;
