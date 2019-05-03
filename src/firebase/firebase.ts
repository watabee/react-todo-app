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

  addTodo = async (title: string, note: string) => {
    try {
      const todo: Todo = {
        title,
        note,
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

  getTodos = async (filterdStatus: TodoStatus) => {
    try {
      const querySnapshot = await firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser!!.uid)
        .collection("todos")
        .where("status", "==", filterdStatus)
        .where("deleted", "==", false)
        .get();

      const todos: TodoEntity[] = [];
      console.log(
        `${filterdStatus} # querySnapshot size = ${querySnapshot.size}`
      );
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc =>
          todos.push({ id: doc.id, ...(doc.data() as Todo) })
        );
      }

      return todos;
    } catch (error) {
      throw error;
    }
  };
}

export default Firebase;
