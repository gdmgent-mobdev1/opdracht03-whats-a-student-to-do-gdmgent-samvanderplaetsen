import { initializeApp } from 'firebase/app';
import { dragoverHandler, dropHandler } from '../lib/dragAndDrop';
// eslint-disable-next-line import/no-cycle
import Card from './Card';


// firebase (in aparte file)
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFpoT9kw8biwsOawm3ZvEzn2XAwo8XkT4",
  authDomain: "todo-app-8af1b.firebaseapp.com",
  projectId: "todo-app-8af1b",
  storageBucket: "todo-app-8af1b.appspot.com",
  messagingSenderId: "585477443265",
  appId: "1:585477443265:web:f3e709ad03f194cb990e40"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
console.log(auth);

// firestore
import { getFirestore, deleteDoc, doc, updateDoc, arrayUnion, getDoc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firestore = getFirestore();

export default class TodoList {
  place: HTMLElement;

  title: string;

  cardArray: Card[];

  input?: HTMLInputElement ;

  div: HTMLDivElement ;

  h2?: HTMLHeadingElement ;

  button?: HTMLButtonElement ;

  todoListElement?: HTMLElement ;

  timerDisplay?: HTMLDivElement ;

  startButton?: HTMLButtonElement ;

  pauseButton?: HTMLButtonElement ;

  time?: HTMLParagraphElement ;

  // Initialize the timer variables
  timerInterval: NodeJS.Timeout | null = null;
  startTime: number = 0;
  elapsedTime: number = 0;
  isTimerRunning: boolean = false;

  previousTime: string | undefined;




  constructor(place: HTMLElement, title = 'to-do list', previousTime = '00:00:00') {
    this.place = place;
    this.title = title;
    this.cardArray = [];
    this.previousTime = previousTime;
    this.div = document.createElement('div');

    this.createToDoListElement();
    this.render();
  }



  async addToDo(): Promise<void> {
    if (this.input instanceof HTMLInputElement && this.div instanceof HTMLDivElement) {
      const text = this.input.value;
      this.cardArray.push(new Card(text, this.div, this));
  
      // add the card's text to the corresponding todoList in Firestore, in the existing todos array
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
      // Fetch the current todos array from Firestore
      const docSnapshot = await getDoc(docRef);
      const existingTodos = docSnapshot.data()?.todos || [];
  
      // Check if the task already exists in the array
      const taskExists = existingTodos.includes(text);
  
      if (!taskExists) {
        // Add the new task to the existing todos array
        existingTodos.push(text);
          
        // Update the document with the updated todos array
        await updateDoc(docRef, {
          todos: existingTodos,
        });
  
        console.log('Document successfully updated!');
      } else {
        console.log('Task already exists in the array.');
      }
    }
  }


  async deleteListFirestore(): Promise<void> {
    try {
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
      // Delete the document from Firestore using its ID
      await deleteDoc(docRef);

      console.log('Document deleted from Firestore');

      // Remove the todo list element from the DOM
      if (this.todoListElement instanceof HTMLElement) {
        this.todoListElement.remove();
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  }


  async invitePersonByEmail(email: string) {
    const user = auth.currentUser;
  
    try {
      if (user) {
        const userID = user.uid;
        const todoListID = this.todoListElement?.id;
  
        // Check if the email exists in the system (you'll need a way to validate email existence)
  
        // Create a new invitation document in the "invitations" collection
        const invitationsCollection = collection(firestore, "invitations");
        const newInvitation = {
          inviter: userID,
          inviteeEmail: email,
          listID: todoListID,
          status: "pending" // You can set the initial status as pending
        };
  
        await addDoc(invitationsCollection, newInvitation);
        console.log("Invitation sent successfully!");
        // You might want to show a success message to the user
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      // Handle errors, show an error message to the user
    }
  }

  startTimer(): void {
    if (!this.isTimerRunning) {
    // Award points to the user
    // this.updatePoints(10); // Award 10 points for completing a task


      this.startTime = Date.now() - this.elapsedTime;
  
      this.timerInterval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateTimerDisplay();
  
        // Update the timer data in Firestore
        const todoListId = this.todoListElement?.id;
        const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
        updateDoc(docRef, {
          timer: {
            startTime: new Date(this.startTime), // Convert to a Date object
            elapsedTime: this.elapsedTime / 1000, // Convert to seconds
            isRunning: true,
            formattedTime: this.getFormattedTime(), // Save the formatted time
          },
        });
      }, 1000);
  
      this.isTimerRunning = true;
    }
  }
  
  pauseTimer(): void {
    if (this.isTimerRunning && this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.isTimerRunning = false;
  
      // Update the timer data in Firestore
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
      updateDoc(docRef, {
        timer: {
          startTime: new Date(this.startTime), // Convert to a Date object
          elapsedTime: this.elapsedTime / 1000, // Convert to seconds
          isRunning: false,
          formattedTime: this.getFormattedTime(), // Save the formatted time
        },
      });
    }
  }

  // Helper method to get formatted time string
  getFormattedTime(): string {
    const hours = Math.floor(this.elapsedTime / 3600000);
    const minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((this.elapsedTime % 60000) / 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  

  updateTimerDisplay(): void {
    const hours = Math.floor(this.elapsedTime / 3600000);
    const minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
    const seconds = Math.floor((this.elapsedTime % 60000) / 1000);
  
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
    if (this.time) {
      // Set the content of the existing <p> tag to include the formatted time and the previous time
      this.time.innerHTML = `${formattedTime}<br>Previous Time: ${this.previousTime}`;
    }
  }

  // aan verderwerken
  async updatePoints(pointsToAdd: number): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      const userID = user.uid;
      const userDocRef = doc(firestore, 'users', userID);
      console.log(userDocRef);
  
      try {
        const userDocSnapshot = await getDoc(userDocRef);
        const currentPoints = userDocSnapshot.data()?.points || 0;
  
        // Update the user's points
        await updateDoc(userDocRef, {
          points: currentPoints + pointsToAdd,
        });
  
        console.log('Points updated in Firestore');
      } catch (error) {
        console.error('Error updating points:', error);
      }
    }
  }

  getMillisecondsFromFormattedTime(formattedTime: string): number {
    const [hours, minutes, seconds] = formattedTime.split(':').map(Number);
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  

  
  




  render(): void {
    
    if (this.todoListElement instanceof HTMLElement) {
      this.todoListElement.addEventListener('drop', dropHandler);
      this.todoListElement.addEventListener('dragover', dragoverHandler);
      this.place.append(this.todoListElement);

      // Add a delete button and event listener
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete List';
      deleteButton.classList.add('btn-delete');
      deleteButton.addEventListener('click', () => {
        // this.deleteList();


      const user = auth.currentUser;
      if (user) {
        this.deleteListFirestore();
      }
      });

      this.todoListElement.append(deleteButton);

      this.place.append(this.todoListElement);
    }
  }
  // todoListElement(todoListElement: any) {
  //   throw new Error("Method not implemented.");
  // }

  createToDoListElement(): void {
    // Create elements
    this.h2 = document.createElement('h2');
    this.h2.innerText = this.title;
    this.input = document.createElement('input');
    this.input.classList.add('comment');
    this.button = document.createElement('button');
    this.button.innerText = 'Add';
    this.button.classList.add('btn-save');
    this.button.id = 'to-do-list-button';
    
    this.todoListElement = document.createElement('div');

    this.todoListElement.id = `todoList_${Date.now()}`;


    // timer
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.classList.add('timer-display');
    // add id maar nog aan verderwerken
    this.timerDisplay.id = `timerDisplay_${Date.now()}`;

    this.time = document.createElement('p');
    this.time.innerText = this.previousTime || '00:00:00'; // Use the previous time or default to '00:00:00'


    this.startButton = document.createElement('button');
    this.startButton.innerText = 'start';

    this.pauseButton = document.createElement('button');
    this.pauseButton.innerText = 'pause';

    // this.startButton.addEventListener('click', () => {
    //   this.startTimer();
    //   console.log('start');
    // });

    this.startButton.addEventListener('click', () => {
      if (this.previousTime) {
        // Convert the previous time to milliseconds
        const previousTimeMilliseconds = this.getMillisecondsFromFormattedTime(this.previousTime);
        // Calculate the new start time by subtracting the previous time from the current time
        this.startTime = Date.now() - previousTimeMilliseconds;
        // Update the elapsedTime to match the previous time
        this.elapsedTime = previousTimeMilliseconds;
      } else {
        // If there's no previous time, start the timer from scratch
        this.startTime = Date.now();
        this.elapsedTime = 0;
      }
      this.startTimer();
    });

    this.pauseButton.addEventListener('click', () => {
      this.pauseTimer();
      console.log('pause');
    });


    // Create invite person button
    const invitePersonButton = document.createElement('button');
    invitePersonButton.innerText = '+';
    invitePersonButton.classList.add('btn-add');

    // Create email input field
    const emailInput = document.createElement('input');
    emailInput.placeholder = 'Enter email';
    emailInput.type = 'email';
    emailInput.classList.add('email-input');

    // Add event listener to invite person button
    invitePersonButton.addEventListener('click', () => {
      const email = emailInput.value;
      if (email) {
        this.invitePersonByEmail(email);
        emailInput.value = '';
      }
    });
    
    



    // Add Event listener
    this.button.addEventListener('click', () => {
      if ((this.input !== null) && this.input?.value !== '') {
        this.addToDo.call(this);
        this.input!.value = '';
      }
    });

    // Append elements to the to-do list element
    this.todoListElement.append(this.h2);
    this.todoListElement.append(this.input);
    this.todoListElement.append(this.button);
    this.todoListElement.append(emailInput);
    this.todoListElement.append(invitePersonButton);
    this.todoListElement.append(this.div);
    this.todoListElement.classList.add('todoList');

    this.todoListElement.append(this.timerDisplay);

    this.timerDisplay.append(this.time);
    this.timerDisplay.append(this.startButton);
    this.timerDisplay.append(this.pauseButton);

    // this.timerDisplay.append(previousTimeDisplay);

    
  }
}
