import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBxJYilUQr5RPsNkszDVPGu0v5ITauigME",
  authDomain: "taskell-ec3d6.firebaseapp.com",
  projectId: "taskell-ec3d6",
  storageBucket: "taskell-ec3d6.firebasestorage.app",
  messagingSenderId: "1052415729383",
  appId: "1:1052415729383:web:72b1c675c08dbda72fcc42",
  measurementId: "G-8JQBJS145Y",
  databaseURL: "https://taskell-ec3d6.firebaseio.com"
};

if (!firebase.apps.length) {
  console.log('Initializing Firebase with config:', {
    ...firebaseConfig,
    apiKey: '***HIDDEN***'
  });
  firebase.initializeApp(firebaseConfig);
}

export default firebase; 