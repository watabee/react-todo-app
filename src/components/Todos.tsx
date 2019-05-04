import React from "react";
import Helmet from "react-helmet";
import {
  Header,
  List,
  Card,
  Checkbox,
  Loader,
  Form,
  Button,
  Segment,
  Icon
} from "semantic-ui-react";
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
  onDeleteButtonClicked?: (todo: TodoEntity) => void;
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
  onFormSubmitted = () => {},
  onDeleteButtonClicked = () => {}
}) => {
  const mapTodoToCardComponent = (todo: TodoEntity) => {
    const done = todo.status === TodoStatus.Done;
    const checkboxStyle = done ? { textDecoration: "line-through" } : {};
    const contentStyle = done ? { opacity: 0.7 } : {};

    return (
      <List.Item key={todo.id}>
        <List.Content className="custom segment" style={contentStyle}>
          <Checkbox
            label={todo.title}
            style={checkboxStyle}
            defaultChecked={todo.status === TodoStatus.Done}
            onChange={() => onCheckboxClicked(todo)}
          />
          <Button
            icon="trash"
            circular
            basic
            style={{ marginTop: 0 }}
            onClick={() => onDeleteButtonClicked(todo)}
          />
        </List.Content>
      </List.Item>
    );
  };

  const mapTodosToComponent = (todos: TodoEntity[]) => (
    <List>{todos.map(mapTodoToCardComponent)}</List>
  );

  return (
    <>
      <Helmet>
        <title>Todo List | Todo</title>
      </Helmet>
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
    </>
  );
};

export default TodosComponent;
