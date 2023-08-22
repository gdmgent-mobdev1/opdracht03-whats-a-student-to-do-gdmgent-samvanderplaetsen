"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c;
exports.__esModule = true;
/* eslint-disable no-new */
var Components_1 = require("./Components");
var lib_1 = require("./lib");
var notificationUtils_1 = require("./lib/notificationUtils");
var app_1 = require("firebase/app");
require("firebase/auth"); // Import auth module if you're using it
require("firebase/firestore"); // Import firestore module if you're using it
var auth_1 = require("firebase/auth");
var firebaseConfig_1 = require("./lib/firebaseConfig"); // Adjust the path if needed
var firestore_1 = require("firebase/firestore");
// Get the email and password input elements
var emailInput = document.getElementById('loginEmail');
var passwordInput = document.getElementById('loginPassword');
var loginButton = document.getElementById('loginButton');
var logoutButton = document.getElementById('logoutButton');
// todo lists
var addTodoListDiv = document.getElementById('addTodoListDiv');
// get login form
var loginForm = document.getElementById('loginForm');
// logged in user div
var userEmail = document.getElementById('userEmail');
// header
var header = document.getElementById('header');
// Initialize Firebase
(0, app_1.initializeApp)(firebaseConfig_1["default"]);
var auth = (0, auth_1.getAuth)();
// console.log(auth);
// firestore
var firestore = (0, firestore_1.getFirestore)();
header.style.display = 'none';
// -------------main------------
var addTodoListInput = document.getElementById('addTodoListInput');
var addTodoListButton = document.getElementById('addTodoListButton');
// create new todo list
addTodoListButton.addEventListener('click', function () {
    if (addTodoListInput.value.trim() !== '') {
        var todoList = new Components_1.TodoList(lib_1.root, addTodoListInput.value);
        var user = auth.currentUser;
        if (user) {
            var userID = user.uid;
            (0, firestore_1.addDoc)((0, firestore_1.collection)(firestore, "todoLists"), {
                name: addTodoListInput.value,
                todos: [],
                userId: userID,
                timer: {
                    startTime: 0,
                    elapsedTime: 0,
                    isRunning: false
                }
            })
                .then(function (docRef) {
                console.log("Document written with ID: ", docRef.id);
                (0, notificationUtils_1.displayNotification)('To-Do List added successfully!', 'success');
            })["catch"](function (error) {
                console.error("Error adding document: ", error);
                (0, notificationUtils_1.displayNotification)('An error occurred. Please try again.', 'error');
            });
            addTodoListInput.value = '';
        }
        // Temporary fix!!!!!!!!
        // hide all todo's
        var todoLists = document.getElementsByClassName('todoList');
        for (var i = 0; i < todoLists.length; i++) {
            var todoList_1 = todoLists[i];
            todoList_1.setAttribute('hidden', '');
        }
        // rerender all todo's
        displayUserTodoLists();
    }
});
// display user's todolists
function displayUserTodoLists() {
    return __awaiter(this, void 0, void 0, function () {
        var user, userID, q, querySnapshot, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = auth.currentUser;
                    if (!user) return [3 /*break*/, 4];
                    userID = user.uid;
                    q = (0, firestore_1.query)((0, firestore_1.collection)(firestore, "todoLists"), (0, firestore_1.where)("userId", "==", userID));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 2:
                    querySnapshot = _a.sent();
                    querySnapshot.forEach(function (doc) { return __awaiter(_this, void 0, void 0, function () {
                        var todoListData, timerData, previousTime, todoList, todos;
                        var _this = this;
                        return __generator(this, function (_a) {
                            todoListData = doc.data();
                            timerData = todoListData.timer || {};
                            previousTime = timerData.formattedTime || "00:00:00";
                            todoList = new Components_1.TodoList(lib_1.root, todoListData.name, previousTime);
                            console.log("Todo List rendered:", todoListData);
                            // Set the Firestore document ID as the element ID
                            todoList.todoListElement.id = doc.id;
                            todos = todoListData.todos || [];
                            todos.forEach(function (todo, index) { return __awaiter(_this, void 0, void 0, function () {
                                var card;
                                return __generator(this, function (_a) {
                                    card = new Components_1.Card(todo, todoList.div, todoList);
                                    todoList.cardArray.push(card);
                                    return [2 /*return*/];
                                });
                            }); });
                            // Fetch and set timer data if available
                            // const timerData = todoListData.timer || {};
                            todoList.startTime = timerData.startTime || 0;
                            todoList.elapsedTime = timerData.elapsedTime || 0;
                            todoList.isTimerRunning = timerData.isRunning || false;
                            console.log("Timer Data:", timerData);
                            // const previousTime = timerData.formattedTime || "00:00:00";
                            console.log("Previous Time:", previousTime);
                            console.log("==============================");
                            return [2 /*return*/];
                        });
                    }); });
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching todo lists: ", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// register user
(_a = document.getElementById('registerButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;
    // Make sure the email and password are not empty
    if (email.trim() !== '' && password.trim() !== '') {
        (0, auth_1.createUserWithEmailAndPassword)(auth, email, password)
            .then(function (userCredential) { return __awaiter(void 0, void 0, void 0, function () {
            var userID, usersCollection, userDocRef;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("User created:", userCredential.user.uid);
                        userID = userCredential.user.uid;
                        usersCollection = (0, firestore_1.collection)(firestore, "users");
                        userDocRef = (0, firestore_1.doc)(usersCollection, userID);
                        return [4 /*yield*/, (0, firestore_1.setDoc)(userDocRef, {
                                email: email,
                                points: 0
                            })];
                    case 1:
                        _a.sent();
                        // login the user that just signed up
                        (0, auth_1.signInWithEmailAndPassword)(auth, email, password)
                            .then(function (userCredential) { return __awaiter(void 0, void 0, void 0, function () {
                            var userEmailElement, registerForm;
                            return __generator(this, function (_a) {
                                console.log("User logged in:", userCredential.user.uid);
                                // Call the function to fetch and display the user's todo lists
                                displayUserTodoLists();
                                // display invitations
                                displayInvitations();
                                console.log(userCredential.user);
                                userEmailElement = document.getElementById('userEmail');
                                if (userEmailElement) {
                                    userEmailElement.removeAttribute('hidden');
                                    userEmailElement.textContent = "Logged in as: ".concat(userCredential.user.email);
                                }
                                logoutButton.removeAttribute('hidden');
                                addTodoListDiv.removeAttribute('hidden');
                                registerForm = document.getElementById('registerForm');
                                registerForm.style.display = 'none';
                                header.style.display = 'flex';
                                emailInput.value = '';
                                passwordInput.value = '';
                                (0, notificationUtils_1.displayNotification)('User registered and logged in successfully!', 'success');
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        }); })["catch"](function (error) {
            console.error("Error creating user:", error);
            (0, notificationUtils_1.displayNotification)('Error creating user. Please try again.', 'error');
        });
    }
    else {
        console.error("Please enter a valid email and password.");
        (0, notificationUtils_1.displayNotification)('Please enter a valid email and password.', 'error');
    }
});
// login user
loginButton.addEventListener('click', function () {
    var email = emailInput.value;
    var password = passwordInput.value;
    // Make sure the email and password are not empty
    if (email.trim() !== '' && password.trim() !== '') {
        (0, auth_1.signInWithEmailAndPassword)(auth, email, password)
            .then(function (userCredential) { return __awaiter(void 0, void 0, void 0, function () {
            var userEmailElement;
            return __generator(this, function (_a) {
                console.log("User logged in:", userCredential.user.uid);
                // Call the function to fetch and display the user's todo lists
                displayUserTodoLists();
                displayInvitations();
                console.log(userCredential.user);
                userEmailElement = document.getElementById('userEmail');
                if (userEmailElement) {
                    userEmailElement.removeAttribute('hidden');
                    userEmailElement.textContent = "Logged in as: ".concat(userCredential.user.email);
                }
                logoutButton.removeAttribute('hidden');
                addTodoListDiv.removeAttribute('hidden');
                loginForm.style.display = 'none';
                header.style.display = 'flex';
                emailInput.value = '';
                passwordInput.value = '';
                (0, notificationUtils_1.displayNotification)('Login successful!', 'success');
                return [2 /*return*/];
            });
        }); })["catch"](function (error) {
            console.error("Error logging in:", error);
            (0, notificationUtils_1.displayNotification)('Login failed. Please check your credentials.', 'error');
        });
    }
    else {
        console.error("Please enter a valid email and password.");
        (0, notificationUtils_1.displayNotification)('Please enter a valid email and password.', 'error');
    }
});
// logout user
(_b = document.getElementById('logoutButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    auth.signOut().then(function () {
        console.log("User logged out");
        logoutButton.setAttribute('hidden', '');
        addTodoListDiv.setAttribute('hidden', '');
        // loginForm.removeAttribute('hidden');
        loginForm.style.display = 'flex';
        header.style.display = 'none';
        userEmail.setAttribute('hidden', '');
        // hide all todo's
        var todoLists = document.getElementsByClassName('todoList');
        for (var i = 0; i < todoLists.length; i++) {
            var todoList = todoLists[i];
            todoList.setAttribute('hidden', '');
        }
        (0, notificationUtils_1.displayNotification)('Logged out successfully!', 'success');
    })["catch"](function (error) {
        console.error("Error logging out:", error);
        (0, notificationUtils_1.displayNotification)('Error logging out. Please try again.', 'error');
    });
});
// login with google
(_c = document.getElementById('loginWithGoogle')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    var provider = new auth_1.GoogleAuthProvider();
    (0, auth_1.signInWithPopup)(auth, provider)
        .then(function (result) {
        console.log("User logged in with Google:", result.user.uid);
        // Call the function to fetch and display the user's todo lists
        displayUserTodoLists();
        console.log(result.user);
        var userEmailElement = document.getElementById('userEmail');
        if (userEmailElement) {
            userEmailElement.removeAttribute('hidden');
            userEmailElement.textContent = "Logged in as: ".concat(result.user.email);
        }
        logoutButton.removeAttribute('hidden');
        addTodoListDiv.removeAttribute('hidden');
        loginForm.style.display = 'none';
        header.style.display = 'flex';
        emailInput.value = '';
        passwordInput.value = '';
        (0, notificationUtils_1.displayNotification)('Logged in with Google successfully!', 'success');
    })["catch"](function (error) {
        console.error("Error logging in with Google:", error);
        (0, notificationUtils_1.displayNotification)('Error logging in with Google. Please try again.', 'error');
    });
});
// display invitations + accept/decline
function displayInvitations() {
    return __awaiter(this, void 0, void 0, function () {
        var user, userID, q, querySnapshot, invitationsDiv_1, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = auth.currentUser;
                    if (!user) return [3 /*break*/, 4];
                    userID = user.uid;
                    q = (0, firestore_1.query)((0, firestore_1.collection)(firestore, "invitations"), (0, firestore_1.where)("inviteeEmail", "==", user.email));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 2:
                    querySnapshot = _a.sent();
                    invitationsDiv_1 = document.getElementById('pendingInvitations');
                    if (invitationsDiv_1) {
                        invitationsDiv_1.innerHTML = ''; // Clear previous content
                        querySnapshot.forEach(function (invDoc) {
                            var invitationData = invDoc.data();
                            // Create a container for each invitation
                            var invitationContainer = document.createElement('div');
                            invitationContainer.classList.add('invitation-container');
                            // Display invitation details
                            var invitationText = document.createElement('p');
                            invitationText.textContent = "You are invited to a to-do list: ".concat(invitationData.listID);
                            invitationContainer.appendChild(invitationText);
                            // Create accept and decline buttons
                            var acceptButton = document.createElement('button');
                            acceptButton.textContent = 'Accept';
                            acceptButton.classList.add('btn-accept');
                            var declineButton = document.createElement('button');
                            declineButton.textContent = 'Decline';
                            declineButton.classList.add('btn-decline');
                            // Add event listeners for accept and decline buttons
                            acceptButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                                var todoListID, todoListDocRef, todoListDocSnapshot, todoListData, acceptedTodoList_1, todos;
                                var _this = this;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Update the invitation status in Firestore to "accepted"
                                        return [4 /*yield*/, (0, firestore_1.updateDoc)(invDoc.ref, { status: "accepted" })];
                                        case 1:
                                            // Update the invitation status in Firestore to "accepted"
                                            _a.sent();
                                            console.log("Invitation accepted!");
                                            todoListID = invitationData.listID;
                                            todoListDocRef = (0, firestore_1.doc)(firestore, "todoLists", todoListID);
                                            return [4 /*yield*/, (0, firestore_1.getDoc)(todoListDocRef)];
                                        case 2:
                                            todoListDocSnapshot = _a.sent();
                                            if (todoListDocSnapshot.exists()) {
                                                todoListData = todoListDocSnapshot.data();
                                                acceptedTodoList_1 = new Components_1.TodoList(lib_1.root, todoListData.name);
                                                // Set the Firestore document ID as the element ID
                                                acceptedTodoList_1.todoListElement.id = todoListID;
                                                todos = todoListData.todos || [];
                                                todos.forEach(function (todo, index) { return __awaiter(_this, void 0, void 0, function () {
                                                    var card;
                                                    return __generator(this, function (_a) {
                                                        card = new Components_1.Card(todo, acceptedTodoList_1.div, acceptedTodoList_1);
                                                        acceptedTodoList_1.cardArray.push(card);
                                                        return [2 /*return*/];
                                                    });
                                                }); });
                                                console.log("Accepted Todo List rendered:", todoListData.name);
                                            }
                                            // You can also remove the invitation container from the UI
                                            invitationContainer.remove();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            declineButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: 
                                        // Update the invitation status in Firestore to "declined"
                                        return [4 /*yield*/, (0, firestore_1.updateDoc)(invDoc.ref, { status: "declined" })];
                                        case 1:
                                            // Update the invitation status in Firestore to "declined"
                                            _a.sent();
                                            console.log("Invitation declined!");
                                            // You can also remove the invitation container from the UI
                                            invitationContainer.remove();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                            // Append buttons to the container
                            invitationContainer.appendChild(acceptButton);
                            invitationContainer.appendChild(declineButton);
                            // Append the container to the invitationsDiv
                            invitationsDiv_1.appendChild(invitationContainer);
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("Error fetching invitations:", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
