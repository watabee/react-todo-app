import React from "react";
import { Header, Button } from "semantic-ui-react";

export interface TodosProps {
  onAddTodoButtonClicked: () => void;
}

const TodosComponent: React.FC<TodosProps> = ({
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
