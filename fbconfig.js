import firebase from 'firebase/app';
import 'firebase/firestore';

var firebaseConfig = {
	apiKey: 'AIzaSyAeLpN7kVMa3W7zxAwG3yNZKgIAFCqhogA',
	authDomain: 'mplan-bb95e.firebaseapp.com',
	databaseURL: 'https://mplan-bb95e.firebaseio.com',
	projectId: 'mplan-bb95e',
	storageBucket: 'mplan-bb95e.appspot.com',
	messagingSenderId: '413593023072',
	appId: '1:413593023072:web:d966890d4dbfd9ef42c905'
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();

export default firebase;
