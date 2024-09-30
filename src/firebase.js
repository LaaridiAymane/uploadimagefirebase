import { initializeApp } from "firebase/app";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClYDbbMDgCfB4ChugmGNL2kReY2dBdKpw",
  authDomain: "uploadimage-fb04c.firebaseapp.com",
  projectId: "uploadimage-fb04c",
  storageBucket: "uploadimage-fb04c.appspot.com",
  messagingSenderId: "1013822756033",
  appId: "1:1013822756033:web:7ab870b0e6d2fa1941f040"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default firebaseConfig;