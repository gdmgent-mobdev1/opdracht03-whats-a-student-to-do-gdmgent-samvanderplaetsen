/* eslint-disable no-new */
import { Card, TodoList } from './Components';
import { State, root } from './Lib';

// import firestore
import { fireStoreDb } from './lib/firebase-init';
import {
  collection, 
  getDocs, 
  onSnapshot, 
  addDoc
} from "firebase/firestore";
import { 
  getAuth, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, onAuthStateChanged, signOut

 } from "firebase/auth";
// import localstorage from './Lib/localStorage';
// -------------main------------
const addTodoListInput = document.getElementById('addTodoListInput') as HTMLInputElement;
const addTodoListButton = document.getElementById('addTodoListButton') as HTMLElement;


const auth = getAuth();


//login/signup HTML

const login = document.createElement('div');
login.innerHTML = `<form id="signup" class="" action="">
  <label class="titleLabel" for="title">Register here!</label>

  <label for="email">email:</label>
  <input id="email" type="email" name="email">

  <label for="password">password:</label>
  <input id="password" type="password" name="password">

  <button type="submit" id="signupButton">signup</button>
</form>

<form id="login" class="" action="">
  <label class="titleLabel" for="title">Login here!</label>

  <label for="email">email:</label>
  <input type="email" name="email">

  <label for="password">password:</label>
  <input type="password" name="password">

  <button id="loginButton">login</button>
</form>

<button class="logout">logout</button>`;
document.body.appendChild(login);


const signupForm = document?.getElementById("signup") as HTMLFormElement;
const loginForm = document?.getElementById("login") as HTMLFormElement;
const logoutButton = document?.querySelector(".logout") as HTMLButtonElement;


console.log(signupForm);


const classItems = Array.from(document.getElementsByClassName('todoList') as HTMLCollectionOf<HTMLElement>);

logoutButton.classList.add('hide');

//Sign-up 
signupForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = signupForm.email.value
  const password = signupForm.password.value;

  createUserWithEmailAndPassword(auth, email, password)
  .then(cred => {
    console.log('user created:', cred.user);
    signupForm.reset();
  })
  .catch(err => {
    console.log(err.message);
  })
})

// Login
loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = loginForm.email.value
  const password = loginForm.password.value;

  signInWithEmailAndPassword(auth, email, password)
  .then(cred => {
    console.log('user logged in:', cred.user);
    loginForm.reset();

    // Check if user is logged in or not
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        signupForm.style.display = 'none';
        loginForm.style.display = 'none';
        logoutButton.classList.remove('hide');

        const uid = user.uid;
        console.log(uid);

        addTodoListInput.classList.remove('hide');
        addTodoListButton.classList.remove('hide');

        const addTodoListFirebase = async (title: string) => {

          const docRef = await addDoc(colRef, {
            title: title,
          });
          console.log("Document written with ID: ", docRef.id);
          return docRef.id;
        }
        
        addTodoListButton.addEventListener('click', async() => {
          if (addTodoListInput.value.trim() !== '') {
            await addTodoListFirebase(addTodoListInput.value);
            // new TodoList(root, addTodoListInput.value, id);
            
            addTodoListInput.value = '';
          }
        });
        
        const getCards = async (id: string)=> {
          const cardsSnapShot = collection(fireStoreDb, `lists/${id}/cards`);
          const qSnap = await getDocs(cardsSnapShot);
          return qSnap.docs.map(d => (
            {
              id: d.id, 
              title: d.data().title, 
              description: d.data().description, 
              comments: d.data().comments,
              parentId: d.data().parentId
            }
            ));
        }
        
        const createTodoList = ({id, cards, title}: { id: string; cards: State[], title: string} )  => {
          let newList: TodoList = new TodoList(root, title, id);
          
          cards.forEach((card: State) => {
                  new Card(card.title, newList.div as HTMLElement, newList, card.id, id);
                  // newList.addToDo();
                }
            )
        }
        
        
        
        // select collection
        // We willen nu referen naar onze collectie `owl-statues`
        const colRef = collection(fireStoreDb, 'lists');
        // get data
        onSnapshot(colRef, (snapshot) => {
          snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
              // snapshot.docs.forEach(async (doc) => {
              //   addTodoListInput.value = '';
                const cards = await getCards(change.doc.id);
                const id = change.doc.id;
                const title = change.doc.data().title;
                createTodoList({title, id: id, cards, ...change.doc.data() });
              // });
            }
            if (change.type === "modified") {
                // rerendering
            }
            if (change.type === "removed") {
                // removing
            }
          });
        
          // document.querySelector('#app')!.innerHTML = '';
          
        })
        // const snapshot =  await getDocs(colRef);
        
        
        // lists.forEach((listElement) => {
        //   console.log(listElement)
          
        //   // listElement.cards.forEach(
        //   //   (card) => {
        //   //     // newList.addToDo(card.)
        //   //   }
        //   // )
        
        // });

      } else {
        console.log("user is singed out");
        signupForm.style.display = 'flex';
        loginForm.style.display = 'flex';

        addTodoListInput.classList.add('hide');
        addTodoListButton.classList.add('hide');

        classItems.forEach((element) => {
          element.style.display = 'none';
        })
      }
    });
  })
  .catch(err => {
    console.log(err.message);
  })
})


// Logout
logoutButton.addEventListener('click', (e) => {
  signOut(auth)
  .then(() => {
    console.log("user is singed out");
    signupForm.style.display = 'flex';
    loginForm.style.display = 'flex';
    logoutButton.classList.add('hide');

    addTodoListInput.classList.add('hide');
    addTodoListButton.classList.add('hide');


    const classItems = Array.from(document.getElementsByClassName('todoList') as HTMLCollectionOf<HTMLElement>);
    classItems.forEach((element) => {
      element.style.display = 'none';
    })
  })
  .catch(err => {
    console.log(err.message);
  })
})









