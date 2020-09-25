import firebase from "firebase"


const firebaseConfig = {
    apiKey: "AIzaSyCUA7UB_jEEUMBuQnN6tyBJrdnWgT8A04w",
    authDomain: "clone-a205d.firebaseapp.com",
    databaseURL: "https://clone-a205d.firebaseio.com",
    projectId: "clone-a205d",
    storageBucket: "clone-a205d.appspot.com",
    messagingSenderId: "598769439506",
    appId: "1:598769439506:web:8219b03368c522cbeb99cb",
    measurementId: "G-T4KJN2J40B"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()

export { db, auth } 