import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAQBE4yzQgZol_wqDrlfOWTD6nVv2k4iEs",
    authDomain: "sign-in-4dfbb.firebaseapp.com",
    projectId: "sign-in-4dfbb",
    storageBucket: "sign-in-4dfbb.appspot.com",
    messagingSenderId: "271853132057",
    appId: "1:271853132057:web:e209361191d0518a25cd88",
    measurementId: "G-0S5RDMJDLZ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let btn = document.getElementById("btn");
let delAll = document.getElementById("delAll");
let loader = document.getElementById("loader");
let getUl = document.getElementById("ul");

if (btn) {
    btn.addEventListener("click", async () => {
        let getInp = document.getElementById("inp");
        if (getInp.value.trim() === "") {
            alert("Please enter a value!");
            return;
        }
        loader.style.display = "block";
        getUl.innerHTML = "";
        const docRef = await addDoc(collection(db, "todos"), {
            name: getInp.value,
        });
        console.log("Document written with ID: ", docRef.id);
        setTimeout(() => {
            loader.style.display = "none";
            fetchData();
            getInp.value = '';
        }, 5000); // Adjust the time here (5000 ms = 5 seconds, 10000 ms = 10 seconds)
    });
}

if (delAll) {
    delAll.addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete all items?")) {
            loader.style.display = "block";
            getUl.innerHTML = "";
            const querySnapshot = await getDocs(collection(db, "todos"));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });
            setTimeout(() => {
                loader.style.display = "none";
                fetchData();
            }, 5000); // Adjust the time here if needed
        }
    });
}

async function fetchData() {
    const q = collection(db, "todos");
    const querySnapshot = await getDocs(q);
    getUl.innerHTML = "";
    querySnapshot.forEach((doc) => {
        getUl.innerHTML += `<li> ${doc.data().name} <div class="btn-flex"><button onclick="delItem('${doc.id}')">Delete</button> <button onclick="editItem('${doc.id}')"> Edit</button></div> </li>`;
    });
}
fetchData();

async function delItem(e) {
    getUl.innerHTML = "";
    console.log(e);
    await deleteDoc(doc(db, "todos", e));
    console.log("Item has deleted");
    fetchData();
}

async function editItem(e) {
    getUl.innerHTML = "";
    const washingtonRef = doc(db, "todos", e);
    let pro = prompt("Enter updated value");
    await updateDoc(washingtonRef, {
        name: pro,
    });
    fetchData();
}

window.delItem = delItem;
window.editItem = editItem;
