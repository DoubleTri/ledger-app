import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

var config = {
    apiKey: "AIzaSyDWJO3RMqjA8mS_pFkf7ZdG8ODYpwsBCZk",
    authDomain: "ledger-app-edfa5.firebaseapp.com",
    databaseURL: "https://ledger-app-edfa5.firebaseio.com",
    projectId: "ledger-app-edfa5",
    storageBucket: "ledger-app-edfa5.appspot.com",
    messagingSenderId: "912586437312",
    appId: "1:912586437312:web:b4d994fba89d57a7893325",
    measurementId: "G-6DNYBJX6CT"
}

export const app = firebase.initializeApp(config);

export const auth = firebase.auth();
export const fireStore = firebase.firestore();
export const storage = firebase.storage();