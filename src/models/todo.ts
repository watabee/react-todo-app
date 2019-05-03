import { firestore } from "firebase/app";

export enum TodoStatus {
  Todo = "Todo",
  InProgress = "InProgress",
  Done = "Done"
}

export interface Todo {
  title: string;
  note: string;
  deleted: boolean;
  status: TodoStatus;
  created_at: firestore.Timestamp;
}
