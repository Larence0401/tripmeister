import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  setDoc,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCslMeCOzjhzgJlzG6mMD-kWb3nfbEDtLs",
  authDomain: "tripmeister-663c5.firebaseapp.com",
  projectId: "tripmeister-663c5",
  storageBucket: "tripmeister-663c5.appspot.com",
  messagingSenderId: "227535778820",
  appId: "1:227535778820:web:731228e9d27ea71fde3151",
  measurementId: "G-VQ08YBQF9Y",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const google = new GoogleAuthProvider();
const facebook = new FacebookAuthProvider();

const loginWithGoogle = async () => {
  await signInWithRedirect(auth, google).catch((error) => alert(error.message));
};

const loginWithFacebook = async () => {
  await signInWithRedirect(auth, facebook).catch((error) =>
    alert(error.message)
  );
};

const signOutUser = () => {
  signOut(auth);
};

const checkIfUserExists = async (id) => {
  const userRef = doc(db, "users", id);
  const docSnap = await getDoc(userRef);
  return docSnap;
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
};

const db = getFirestore(app);
let uid = "";
const colRef = collection(db, "users");

const createUser = async (user) => {
  console.log(db)
  const userExists = await checkIfUserExists(user.uid);
  if (userExists) return;
  await setDoc(doc(db, "users", user.uid), { name: user.displayName });
};

const addItinerary = async (user, tripname, itinerary) => {
  await addDoc(collection(db, "users", user?.uid, "itineraries"), {
    tripname: tripname,
    data: itinerary,
  });
};

export {
  auth,
  app,
  db,
  useAuth,
  loginWithFacebook,
  loginWithGoogle,
  signOutUser,
  createUser,
  checkIfUserExists,
  addItinerary,
};
