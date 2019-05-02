import * as firebase from "firebase/app";
require("firebase/auth"); // https://stackoverflow.com/questions/48592656/firebase-auth-is-not-a-function

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
}

export default Firebase;
