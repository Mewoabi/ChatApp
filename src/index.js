import { initializeApp } from 'firebase/app'

import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc, onSnapshot, query, where, setDoc, orderBy, serverTimestamp, arrayUnion, Timestamp } from 'firebase/firestore';

import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, revokeAccessToken } from 'firebase/auth'

import { formatDistanceToNow } from 'date-fns';
//importing other modules 
import { setUiEventListeners, showAlert, changeRoomButtonColor } from './ui.js';


//firebase config object 
const firebaseConfig = {
  apiKey: "AIzaSyCfr1LTee4VQQNWeCal1F5fBSKL1zZDva4",
  authDomain: "fir-9-basics-dojo.firebaseapp.com",
  projectId: "fir-9-basics-dojo",
  storageBucket: "fir-9-basics-dojo.appspot.com",
  messagingSenderId: "17601602274",
  appId: "1:17601602274:web:b93a7d20c81b92665174bb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();


//creating a reference to the collection  
const chatList = document.querySelector('.chatList'); 


const createListItem = (item) => {
  let li = document.createElement('li');
  li.setAttribute('class', 'list-group-item');
  li.setAttribute('data-id', item.id);
  li.setAttribute('style', 'position: relative;');
  li.innerHTML = `<p style="margin-bottom: 0px"><strong>${item.author}</strong> ${item.message}</p>
                    <p style="font-size: 80%; font-weight: light; margin-bottom: 0px">${formatDistanceToNow(new Date(item.createdAt.seconds * 1000), { addSuffix: true })}</p>
                    <i style="position: absolute; right: 5px; top: 5px; cursor: pointer" class="bi bi-trash-fill"></i>`;
  chatList.prepend(li);
}
 const removeListItem = ( chatId ) => {
    chatList.childNodes.forEach(node =>  {
      if (node.dataset.id === chatId) {
        node.remove();
      }
    })
     
 }


class ChatRoom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = collection(db, 'chats');
  }

  //setters 
  setRoom(room) {
    this.room = room;
    changeRoomButtonColor(this.room, "rgb(166, 21, 103)");
  }

  setUsername(name) {
    this.username = name;
  }

  //getting all the chats 
   getChats() {
    chatList.innerHTML = '';
    console.log("getting the chats")
    const q = query(this.chats, where("room", "==", this.room), orderBy('createdAt', 'asc'));
    onSnapshot(q, (snapshot) => {
      console.log("in the snapshot");
       snapshot.docChanges().forEach(change => {
        const doc = change.doc; 
        const chat = ({ ...doc.data(), id: doc.id, change: change.type });
        if(change.type == 'added') {
          createListItem(chat);
        }
        if(change.type == 'removed'){
            console.log("doc with id of ", doc.id, " has been removed");
            removeListItem(doc.id)
        }
       })
    })
    // chatList.childNodes.forEach(node => console.log( node));
  }
 

  //function to add a chat
  sendChat(message) {
      if (!this.username) {
        showAlert("Oops you have to enter a username");
      }
      else if (!message) {
        showAlert("enter message")
      } else {
        const timestamp = Timestamp.now();
        console.log("trying to addbook")
        addDoc(this.chats, {
          message,
          author: this.username,
          room: this.room,
          createdAt: timestamp
        })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
            .catch(e => console.error("Error adding document: ", e) )
       
      } 
  }

  //deleting a chat
  async removeDoc(docID) {
    deleteDoc(doc(this.chats, docID)).then( () => console.log("deleted a doc (in index.js)"));
  }

}

const chatRoom = new ChatRoom("general", "");
chatRoom.getChats();
console.log("chatroom created: ", chatRoom);




setUiEventListeners(chatRoom);


