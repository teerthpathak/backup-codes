const firebaseConfig = {
    apiKey: "AIzaSyDIZvUvmhU6xwFzivs2ye42ulkdp3nS4YU",
    authDomain: "backupcodes-e5ff8.firebaseapp.com",
    databaseURL: "https://backupcodes-e5ff8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "backupcodes-e5ff8",
    storageBucket: "backupcodes-e5ff8.firebasestorage.app",
    messagingSenderId: "477500235878",
    appId: "1:477500235878:web:f0a89c1a82bd703f710da7"
};
firebase.initializeApp(firebaseConfig);

function getFirebaseData(path) {
    return firebase.database().ref(path).once("value").then(snapshot => snapshot.val());
}

function setFirebaseData(path, object, data) {
    firebase.database().ref(path).child(object).set(data);
}

function removeFirebaseData(path, object) {
    firebase.database().ref(path).child(object).remove();
}

function convertToFirebaseAcceptableData(data) {
    return data.replaceAll(".", "ā")
        .replaceAll("#", "ḥ")
        .replaceAll("$", "ḍ")
        .replaceAll("[", "ś")
        .replaceAll("]", "ē")
        .replaceAll(" ", "æ");
}