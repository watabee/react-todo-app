import { firestore } from "firebase/app";

export enum TodoStatus {
  Todo = "Todo",
  Done = "Done"
}

export interface Todo {
  title: string;
  deleted: boolean;
  status: TodoStatus;
  created_at: firestore.Timestamp;
}

export interface TodoEntity extends Todo {
  id: string;
}
