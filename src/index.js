import React from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDXYzAGf4W0aZzf1ai8yo_-asqz1-JJlK8",
    authDomain: "react-chat-app-1bbc5.firebaseapp.com",
    databaseURL: "https://react-chat-app-1bbc5-default-rtdb.firebaseio.com",
    projectId: "react-chat-app-1bbc5",
    storageBucket: "react-chat-app-1bbc5.appspot.com",
    messagingSenderId: "652747347812",
    appId: "1:652747347812:web:89ba6b388775edab3a0c71"
};


const app = initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
