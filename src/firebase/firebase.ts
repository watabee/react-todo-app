import { Todo, TodoEntity } from "./../models/todo";
import * as firebase from "firebase/app";
import { TodoStatus } from "../models/todo";
require("firebase/auth"); // https://stackoverflow.com/questions/48592656/firebase-auth-is-not-a-function
require("firebase/firestore");

export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);
  }

  signUp = async (email: string, password: string) => {
    try {
      const userCredencial: firebase.auth.UserCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      return userCredencial;
    } catch (error) {
      throw error;
    }
  };

  signIn = async (email: string, password: string) => {
    try {
      const userCredencial = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      return userCredencial;
    } catch (error) {
      throw error;
    }
  };

  isLoggedIn = (): boolean => firebase.auth().currentUser !== null;

  addTodo = async (title: string) => {
    try {
      const todo: Todo = {
        title,
        created_at: firebase.firestore.Timestamp.now(),
        deleted: false,
        status: TodoStatus.Todo
      };

      const docRef = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser!!.uid)
        .collection("todos")
        .add(todo);

      return docRef;
    } catch (error) {
      throw error;
    }
  };

  updateTodoStatus = async (entity: TodoEntity, newStatus: TodoStatus) => {
    if (entity.status === newStatus) {
      return;
    }

    const { id, ...todo } = entity;
    const newTodo: Todo = { ...todo, status: newStatus };

    try {
      await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser!!.uid)
        .collection("todos")
        .doc(id)
        .update(newTodo);
    } catch (error) {
      throw error;
    }
  };

  observeTodos = (
    onUpdate: (todoTodos: TodoEntity[], doneTodos: TodoEntity[]) => void,
    onError: (error: Error) => void
  ): (() => void) => {
    return firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser!!.uid)
      .collection("todos")
      .where("deleted", "==", false)
      .onSnapshot(snapshot => {
        const todoTodos: TodoEntity[] = [];
        const doneTodos: TodoEntity[] = [];
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            const entity: TodoEntity = { id: doc.id, ...(doc.data() as Todo) };
            switch (entity.status) {
              case TodoStatus.Todo:
                todoTodos.push(entity);
                break;
              case TodoStatus.Done:
                doneTodos.push(entity);
                break;
              default:
                throw Error("Illegal state");
            }
          });
        }
        onUpdate(todoTodos, doneTodos);
      }, onError);
  };
}

export default Firebase;
