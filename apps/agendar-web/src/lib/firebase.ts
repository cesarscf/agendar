import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBUCqKFQ_9MCHOvpXk8JWjYjfEj05hirpc",
  authDomain: "agendar-dev-d7450.firebaseapp.com",
  projectId: "agendar-dev-d7450",
  storageBucket: "agendar-dev-d7450.firebasestorage.app",
  messagingSenderId: "787006319304",
  appId: "1:787006319304:web:7f042e7046171be17013fd",
  measurementId: "G-RWMP4PLCFP",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
