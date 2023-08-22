/* eslint-disable no-new */
import { Card, TodoList } from './Components';
import { root } from './lib';

import { displayNotification } from './lib/notificationUtils';


import { initializeApp } from "firebase/app";
import 'firebase/auth'; // Import auth module if you're using it
import 'firebase/firestore'; // Import firestore module if you're using it
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import firebaseConfig from './lib/firebaseConfig'; // Adjust the path if needed

import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';


// Get the email and password input elements
const emailInput = document.getElementById('loginEmail') as HTMLInputElement;
const passwordInput = document.getElementById('loginPassword') as HTMLInputElement;

const loginButton = document.getElementById('loginButton') as HTMLElement;
const logoutButton = document.getElementById('logoutButton') as HTMLElement;

// todo lists
const addTodoListDiv = document.getElementById('addTodoListDiv') as HTMLElement;

// get login form
const loginForm = document.getElementById('loginForm') as HTMLFormElement;

// logged in user div
const userEmail = document.getElementById('userEmail') as HTMLElement;

// header
const header = document.getElementById('header') as HTMLElement;



// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
// console.log(auth);

// firestore

const firestore = getFirestore();


header.style.display = 'none';

// -------------main------------
const addTodoListInput = document.getElementById('addTodoListInput') as HTMLInputElement;
const addTodoListButton = document.getElementById('addTodoListButton') as HTMLElement;

// create new todo list
addTodoListButton.addEventListener('click', () => {
  if (addTodoListInput.value.trim() !== '') {
    const todoList = new TodoList(root, addTodoListInput.value);

    const user = auth.currentUser;
    
    if (user) {
      const userID = user.uid;

      addDoc(collection(firestore, "todoLists"), {
        name: addTodoListInput.value,
        todos: [],
        userId: userID,
        timer: {
          startTime: 0,
          elapsedTime: 0,
          isRunning: false,
        },
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        displayNotification('To-Do List added successfully!', 'success');

      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        displayNotification('An error occurred. Please try again.', 'error');

      });

      addTodoListInput.value = '';
    }

    // Temporary fix!!!!!!!!

    // hide all todo's
    const todoLists = document.getElementsByClassName('todoList');
    for (let i = 0; i < todoLists.length; i++) {
      const todoList = todoLists[i] as HTMLElement;
      todoList.setAttribute('hidden', '');
    }
    // rerender all todo's
    displayUserTodoLists();
  }
});

        
// display user's todolists
async function displayUserTodoLists() {
  const user = auth.currentUser;

  if (user) {
    const userID = user.uid;

    // query to find todo lists for the current user
    const q = query(collection(firestore, "todoLists"), where("userId", "==", userID));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        const todoListData = doc.data();

        // Fetch and set timer data if available
        const timerData = todoListData.timer || {};
        const previousTime = timerData.formattedTime || "00:00:00"; // Get the previousTime from timerData


        const todoList = new TodoList(root, todoListData.name, previousTime);
        console.log("Todo List rendered:", todoListData);

        // Set the Firestore document ID as the element ID
        todoList.todoListElement!.id = doc.id;

        const todos = todoListData.todos || [];

        todos.forEach(async (todo: any, index: number) => {

          // Create a new card component for each task on the todolist
          const card = new Card(todo, todoList.div, todoList);
          todoList.cardArray.push(card);
        });

        // Fetch and set timer data if available
        // const timerData = todoListData.timer || {};
        todoList.startTime = timerData.startTime || 0;
        todoList.elapsedTime = timerData.elapsedTime || 0;
        todoList.isTimerRunning = timerData.isRunning || false;

        console.log("Timer Data:", timerData);

        // const previousTime = timerData.formattedTime || "00:00:00";
        console.log("Previous Time:", previousTime);

        console.log("==============================");

      });

    } catch (error) {
      console.error("Error fetching todo lists: ", error);
    }
  }
}


// register user
document.getElementById('registerButton')?.addEventListener('click', () => {
  const email = (document.getElementById('registerEmail') as HTMLInputElement).value;
  const password = (document.getElementById('registerPassword') as HTMLInputElement).value;

  // Make sure the email and password are not empty
  if (email.trim() !== '' && password.trim() !== '') {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("User created:", userCredential.user.uid);

        const userID = userCredential.user.uid;

        // Create a new document in the users collection
        const usersCollection = collection(firestore, "users");
        const userDocRef = doc(usersCollection, userID); // Assuming userID is the custom document ID you want to set

        await setDoc(userDocRef, {
          email: email,
          points: 0, // Initial points for a new user
        });


        // login the user that just signed up
        signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            console.log("User logged in:", userCredential.user.uid);
            // Call the function to fetch and display the user's todo lists
            displayUserTodoLists();

            // display invitations
            displayInvitations();

            console.log(userCredential.user);
            const userEmailElement = document.getElementById('userEmail');

            if (userEmailElement) {
              userEmailElement.removeAttribute('hidden');
              userEmailElement.textContent = `Logged in as: ${userCredential.user.email}`;
            }

            logoutButton.removeAttribute('hidden');
            addTodoListDiv.removeAttribute('hidden');
            // loginForm.setAttribute('hidden', '');
            const registerForm = document.getElementById('registerForm') as HTMLFormElement;
            registerForm.style.display = 'none';
            header.style.display = 'flex';

            emailInput.value = '';
            passwordInput.value = '';

            displayNotification('User registered and logged in successfully!', 'success');

          })
      })
      .catch((error) => {
        console.error("Error creating user:", error);
        displayNotification('Error creating user. Please try again.', 'error');

      });
  } else {
    console.error("Please enter a valid email and password.");
    displayNotification('Please enter a valid email and password.', 'error');

  }
});

// login user
loginButton.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  // Make sure the email and password are not empty
  if (email.trim() !== '' && password.trim() !== '') {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log("User logged in:", userCredential.user.uid);
        // Call the function to fetch and display the user's todo lists
        displayUserTodoLists();
        displayInvitations();

        console.log(userCredential.user);
        const userEmailElement = document.getElementById('userEmail');

        if (userEmailElement) {
          userEmailElement.removeAttribute('hidden');
          userEmailElement.textContent = `Logged in as: ${userCredential.user.email}`;
        }

        logoutButton.removeAttribute('hidden');
        addTodoListDiv.removeAttribute('hidden');
        loginForm.style.display = 'none';
        header.style.display = 'flex';

        emailInput.value = '';
        passwordInput.value = '';

        displayNotification('Login successful!', 'success');

      })
      .catch((error) => {
        console.error("Error logging in:", error);
        displayNotification('Login failed. Please check your credentials.', 'error');

      });
  } else {
    console.error("Please enter a valid email and password.");
    displayNotification('Please enter a valid email and password.', 'error');


  }
});

// logout user
document.getElementById('logoutButton')?.addEventListener('click', () => {
  auth.signOut().then(() => {
    console.log("User logged out");
    logoutButton.setAttribute('hidden', '');
    addTodoListDiv.setAttribute('hidden', '');
    // loginForm.removeAttribute('hidden');
    loginForm.style.display = 'flex';
    header.style.display = 'none';

    userEmail.setAttribute('hidden', '');

    // hide all todo's
    const todoLists = document.getElementsByClassName('todoList');
    for (let i = 0; i < todoLists.length; i++) {
      const todoList = todoLists[i] as HTMLElement;
      todoList.setAttribute('hidden', '');
    }

    displayNotification('Logged out successfully!', 'success');


  }).catch((error) => {
    console.error("Error logging out:", error);
    displayNotification('Error logging out. Please try again.', 'error');
  });
});

// login with google
document.getElementById('loginWithGoogle')?.addEventListener('click', () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User logged in with Google:", result.user.uid);
      // Call the function to fetch and display the user's todo lists
      displayUserTodoLists();

      console.log(result.user);
      const userEmailElement = document.getElementById('userEmail');

      if (userEmailElement) {
        userEmailElement.removeAttribute('hidden');
        userEmailElement.textContent = `Logged in as: ${result.user.email}`;
      }

      logoutButton.removeAttribute('hidden');
      addTodoListDiv.removeAttribute('hidden');

      loginForm.style.display = 'none';
      header.style.display = 'flex';

      emailInput.value = '';
      passwordInput.value = '';

      displayNotification('Logged in with Google successfully!', 'success');

    })
    .catch((error) => {
      console.error("Error logging in with Google:", error);
      displayNotification('Error logging in with Google. Please try again.', 'error');

    });
});


// display invitations + accept/decline
async function displayInvitations() {
  const user = auth.currentUser;

  if (user) {
    const userID = user.uid;

    // Query invitations where the invitee's email matches the current user's email
    const q = query(collection(firestore, "invitations"), where("inviteeEmail", "==", user.email));

    try {
      const querySnapshot = await getDocs(q);

      const invitationsDiv = document.getElementById('pendingInvitations');

      if (invitationsDiv) {
        invitationsDiv.innerHTML = ''; // Clear previous content

        querySnapshot.forEach((invDoc) => {
          const invitationData = invDoc.data();

          // Create a container for each invitation
          const invitationContainer = document.createElement('div');
          invitationContainer.classList.add('invitation-container');

          // Display invitation details
          const invitationText = document.createElement('p');
          invitationText.textContent = `You are invited to a to-do list: ${invitationData.listID}`;
          invitationContainer.appendChild(invitationText);

          // Create accept and decline buttons
          const acceptButton = document.createElement('button');
          acceptButton.textContent = 'Accept';
          acceptButton.classList.add('btn-accept');

          const declineButton = document.createElement('button');
          declineButton.textContent = 'Decline';
          declineButton.classList.add('btn-decline');

          // Add event listeners for accept and decline buttons
          acceptButton.addEventListener('click', async () => {
            // Update the invitation status in Firestore to "accepted"
            await updateDoc(invDoc.ref, { status: "accepted" });
            console.log("Invitation accepted!");
          
            // Fetch the details of the accepted invitation
            const todoListID = invitationData.listID;
            const todoListDocRef = doc(firestore, "todoLists", todoListID);
            const todoListDocSnapshot = await getDoc(todoListDocRef);
          
            if (todoListDocSnapshot.exists()) {
              const todoListData = todoListDocSnapshot.data();
              
              // Create a new TodoList instance and render it
              const acceptedTodoList = new TodoList(root, todoListData.name);
          
              // Set the Firestore document ID as the element ID
              acceptedTodoList.todoListElement!.id = todoListID;
          
              const todos = todoListData.todos || [];
          
              todos.forEach(async (todo: any, index: number) => {
                const card = new Card(todo, acceptedTodoList.div, acceptedTodoList);
                acceptedTodoList.cardArray.push(card);
              });
          
              console.log("Accepted Todo List rendered:", todoListData.name);
            }
          
            // You can also remove the invitation container from the UI
            invitationContainer.remove();
          });

          declineButton.addEventListener('click', async () => {
            // Update the invitation status in Firestore to "declined"
            await updateDoc(invDoc.ref, { status: "declined" });
            console.log("Invitation declined!");
            // You can also remove the invitation container from the UI
            invitationContainer.remove();
          });

          // Append buttons to the container
          invitationContainer.appendChild(acceptButton);
          invitationContainer.appendChild(declineButton);

          // Append the container to the invitationsDiv
          invitationsDiv.appendChild(invitationContainer);
        });
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  }
}