import "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//====================================================================================
// CORE FIREBASE CONFIG
//====================================================================================

const CoreFirebaseConfig: any = JSON.parse(
  import.meta.env.VITE_REACT_APP_FIREBASE ?? ""
);

const CoreApp = initializeApp(CoreFirebaseConfig);

export const db = getFirestore(CoreApp);
export const auth = getAuth(CoreApp);
export const storage = getStorage(CoreApp);
