import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtFNCgxmyby61f6EEF6CwIIplK5jiPssU",
  authDomain: "artisan-hub-c7887.firebaseapp.com",
  projectId: "artisan-hub-c7887",
  storageBucket: "artisan-hub-c7887.firebasestorage.app",
  messagingSenderId: "925420460288",
  appId: "1:925420460288:web:c25f3ff258e655451b7be5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
