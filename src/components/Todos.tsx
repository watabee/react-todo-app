import React from "react";
import { Header, Card, Checkbox, Loader, Form } from "semantic-ui-react";
import { TodoEntity, TodoStatus } from "../models/todo";

import "./Todos.css";

export interface TodosProps {
  todoTodos: TodoEntity[];
  doneTodos: TodoEntity[];
  inputText: string;
  isLoading: boolean;
  isAddingTodo: boolean;
  error?: Error;
  onCheckboxClicked?: (todo: TodoEntity) => void;
  onInputTextChanged?: (text: string) => void;
  onFormSubmitted?: () => void;
}

const TodosComponent: React.FC<TodosProps> = ({
  todoTodos = [],
  doneTodos = [],
  inputText = "",
  isLoading = false,
  isAddingTodo = false,
  error = undefined,
  onCheckboxClicked = () => {},
  onInputTextChanged = () => {},
  onFormSubmitted = () => {}
}) => {
  const mapTodoToCardComponent = (todo: TodoEntity) => {
    const done = todo.status === TodoStatus.Done;
    const checkboxStyle = done ? { textDecoration: "line-through" } : {};
    const cardStyle = done ? { opacity: 0.8 } : {};

    return (
      <Card key={todo.id} style={cardStyle}>
        <Card.Content>
          <Checkbox
            label={todo.title}
            style={checkboxStyle}
            defaultChecked={todo.status === TodoStatus.Done}
            onChange={() => onCheckboxClicked(todo)}
          />
        </Card.Content>
      </Card>
    );
  };

  const mapTodosToComponent = (todos: TodoEntity[]) => (
    <Card.Group itemsPerRow={1}>{todos.map(mapTodoToCardComponent)}</Card.Group>
  );

  return (
    <div className="todo-list">
      {isLoading ? (
        <Loader active>Loading</Loader>
      ) : (
        <>
          <Form onSubmit={onFormSubmitted} loading={isAddingTodo}>
            <Form.Input
              placeholder="Add a to-do..."
              value={inputText}
              onChange={(e, { value }) => onInputTextChanged(value)}
            />
          </Form>

          {todoTodos.length > 0 && (
            <Header as="h2" block>
              {todoTodos.length} TO-DO
            </Header>
          )}
          {mapTodosToComponent(todoTodos)}

          {doneTodos.length > 0 && (
            <Header as="h2" block>
              {doneTodos.length} COMPLETED TO-DO
            </Header>
          )}
          {mapTodosToComponent(doneTodos)}
        </>
      )}
    </div>
  );
};

export default TodosComponent;
