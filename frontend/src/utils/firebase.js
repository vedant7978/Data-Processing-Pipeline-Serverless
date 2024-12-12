import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  authDomain: "quickdataprocessorbot-kxxq.firebaseapp.com",
  projectId: "quickdataprocessorbot-kxxq",
  projectNumber: "233878307648",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
};