import { initializeApp } from 'firebase/app';
import { dragoverHandler, dropHandler } from '../lib/dragAndDrop';
// eslint-disable-next-line import/no-cycle
import Card from './Card';

// import firebase config
import firebaseConfig from '../lib/firebaseConfig';
import { displayNotification } from '../lib/notificationUtils';

// firestore
import { getFirestore, deleteDoc, doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
console.log(auth);



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
  
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
      const docSnapshot = await getDoc(docRef);
      const existingTodos = docSnapshot.data()?.todos || [];
  
      const taskExists = existingTodos.includes(text);
  
      if (!taskExists) {
        existingTodos.push(text);
        await updateDoc(docRef, {
          todos: existingTodos,
        });
  
        console.log('Document successfully updated!');
        displayNotification('Task added successfully!', 'success');

      } else {
        console.log('Task already exists in the array.');
        displayNotification('Task already exists.', 'error');

      }
    }
  }

  async deleteListFirestore(): Promise<void> {
    try {
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
      await deleteDoc(docRef);
      console.log('Document deleted from Firestore');

      if (this.todoListElement instanceof HTMLElement) {
        this.todoListElement.remove();

        displayNotification('List deleted successfully!', 'success');

      }
    } catch (error) {
      console.error('Error deleting document:', error);

      displayNotification('An error occurred while deleting the list.', 'error');
    }
  }

  async invitePersonByEmail(email: string) {
    const user = auth.currentUser;
  
    try {
      if (user) {
        const userID = user.uid;
        const todoListID = this.todoListElement?.id;
    
        const invitationsCollection = collection(firestore, "invitations");
        const newInvitation = {
          inviter: userID,
          inviteeEmail: email,
          listID: todoListID,
          status: "pending"
        };
  
        await addDoc(invitationsCollection, newInvitation);
        console.log("Invitation sent successfully!");
        // success message
        displayNotification('Invitation sent successfully!', 'success');

      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      // error
      displayNotification('An error occurred while sending the invitation.', 'error');

    }
  }

  startTimer(): void {
    if (!this.isTimerRunning) {
      this.startTime = Date.now() - this.elapsedTime;
      this.timerInterval = setInterval(() => {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateTimerDisplay();
  
        const todoListId = this.todoListElement?.id;
        const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
        updateDoc(docRef, {
          timer: {
            startTime: new Date(this.startTime),
            elapsedTime: this.elapsedTime / 1000,
            isRunning: true,
            formattedTime: this.getFormattedTime(),
          },
        });
      }, 1000);
  
      this.isTimerRunning = true;

      displayNotification('Timer started.', 'success');
    } else {
      console.log('Timer is already running.');
      displayNotification('Timer is already running.', 'error');

    }
  }
  
  pauseTimer(): void {
    if (this.isTimerRunning && this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.isTimerRunning = false;
  
      const todoListId = this.todoListElement?.id;
      const docRef = doc(firestore, 'todoLists', `${todoListId}`);
  
      updateDoc(docRef, {
        timer: {
          startTime: new Date(this.startTime),
          elapsedTime: this.elapsedTime / 1000,
          isRunning: false,
          formattedTime: this.getFormattedTime(),
        },
      });

      displayNotification('Timer paused.', 'success');

    } else {
      console.log('Timer is not running.');
      displayNotification('Timer is not running.', 'error');
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
  
        await updateDoc(userDocRef, {
          points: currentPoints + pointsToAdd,
        });
  
        console.log('Points updated in Firestore');
        displayNotification(`Points updated: +${pointsToAdd}`, 'success');

      } catch (error) {
        console.error('Error updating points:', error);
        displayNotification('Error updating points', 'error');

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

      // Add a delete button and event listener
      const deleteButton = document.createElement('button');
      deleteButton.innerText = 'Delete List';
      deleteButton.classList.add('btn-delete');
      deleteButton.addEventListener('click', () => {
        const user = auth.currentUser;
        if (user) {
          this.deleteListFirestore();
        }
      });

      this.todoListElement.append(deleteButton);
      this.place.append(this.todoListElement);
    }
  }

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
    this.timerDisplay.id = `timerDisplay_${Date.now()}`;

    this.time = document.createElement('p');
    this.time.innerText = this.previousTime || '00:00:00'; // Use the previous time or default to '00:00:00'

    this.startButton = document.createElement('button');
    this.startButton.innerText = 'start';
    this.startButton.addEventListener('click', () => {
      if (this.previousTime) {
        const previousTimeMilliseconds = this.getMillisecondsFromFormattedTime(this.previousTime);
        this.startTime = Date.now() - previousTimeMilliseconds;
        this.elapsedTime = previousTimeMilliseconds;
      } else {
        this.startTime = Date.now();
        this.elapsedTime = 0;
      }
      this.startTimer();
    });

    this.pauseButton = document.createElement('button');
    this.pauseButton.innerText = 'pause';
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

    this.place.append(this.todoListElement);

  }
}
