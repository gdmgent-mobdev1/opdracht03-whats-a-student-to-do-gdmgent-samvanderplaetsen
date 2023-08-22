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
exports.__esModule = true;
var app_1 = require("firebase/app");
var dragAndDrop_1 = require("../lib/dragAndDrop");
// eslint-disable-next-line import/no-cycle
var Card_1 = require("./Card");
// import firebase config
var firebaseConfig_1 = require("../lib/firebaseConfig");
var notificationUtils_1 = require("../lib/notificationUtils");
// firestore
var firestore_1 = require("firebase/firestore");
var auth_1 = require("firebase/auth");
// Initialize Firebase
(0, app_1.initializeApp)(firebaseConfig_1["default"]);
var auth = (0, auth_1.getAuth)();
console.log(auth);
var firestore = (0, firestore_1.getFirestore)();
var TodoList = /** @class */ (function () {
    function TodoList(place, title, previousTime) {
        if (title === void 0) { title = 'to-do list'; }
        if (previousTime === void 0) { previousTime = '00:00:00'; }
        // Initialize the timer variables
        this.timerInterval = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isTimerRunning = false;
        this.place = place;
        this.title = title;
        this.cardArray = [];
        this.previousTime = previousTime;
        this.div = document.createElement('div');
        this.createToDoListElement();
        this.render();
    }
    TodoList.prototype.addToDo = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var text, todoListId, docRef, docSnapshot, existingTodos, taskExists;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(this.input instanceof HTMLInputElement && this.div instanceof HTMLDivElement)) return [3 /*break*/, 4];
                        text = this.input.value;
                        this.cardArray.push(new Card_1["default"](text, this.div, this));
                        todoListId = (_a = this.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
                        docRef = (0, firestore_1.doc)(firestore, 'todoLists', "".concat(todoListId));
                        return [4 /*yield*/, (0, firestore_1.getDoc)(docRef)];
                    case 1:
                        docSnapshot = _c.sent();
                        existingTodos = ((_b = docSnapshot.data()) === null || _b === void 0 ? void 0 : _b.todos) || [];
                        taskExists = existingTodos.includes(text);
                        if (!!taskExists) return [3 /*break*/, 3];
                        existingTodos.push(text);
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(docRef, {
                                todos: existingTodos
                            })];
                    case 2:
                        _c.sent();
                        console.log('Document successfully updated!');
                        (0, notificationUtils_1.displayNotification)('Task added successfully!', 'success');
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('Task already exists in the array.');
                        (0, notificationUtils_1.displayNotification)('Task already exists.', 'error');
                        _c.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TodoList.prototype.deleteListFirestore = function () {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var todoListId, docRef, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        todoListId = (_a = this.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
                        docRef = (0, firestore_1.doc)(firestore, 'todoLists', "".concat(todoListId));
                        return [4 /*yield*/, (0, firestore_1.deleteDoc)(docRef)];
                    case 1:
                        _b.sent();
                        console.log('Document deleted from Firestore');
                        if (this.todoListElement instanceof HTMLElement) {
                            this.todoListElement.remove();
                            (0, notificationUtils_1.displayNotification)('List deleted successfully!', 'success');
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error deleting document:', error_1);
                        (0, notificationUtils_1.displayNotification)('An error occurred while deleting the list.', 'error');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TodoList.prototype.invitePersonByEmail = function (email) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, userID, todoListID, invitationsCollection, newInvitation, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = auth.currentUser;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        if (!user) return [3 /*break*/, 3];
                        userID = user.uid;
                        todoListID = (_a = this.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
                        invitationsCollection = (0, firestore_1.collection)(firestore, "invitations");
                        newInvitation = {
                            inviter: userID,
                            inviteeEmail: email,
                            listID: todoListID,
                            status: "pending"
                        };
                        return [4 /*yield*/, (0, firestore_1.addDoc)(invitationsCollection, newInvitation)];
                    case 2:
                        _b.sent();
                        console.log("Invitation sent successfully!");
                        // success message
                        (0, notificationUtils_1.displayNotification)('Invitation sent successfully!', 'success');
                        _b.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error("Error sending invitation:", error_2);
                        // error
                        (0, notificationUtils_1.displayNotification)('An error occurred while sending the invitation.', 'error');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TodoList.prototype.startTimer = function () {
        var _this = this;
        if (!this.isTimerRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(function () {
                var _a;
                _this.elapsedTime = Date.now() - _this.startTime;
                _this.updateTimerDisplay();
                var todoListId = (_a = _this.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
                var docRef = (0, firestore_1.doc)(firestore, 'todoLists', "".concat(todoListId));
                (0, firestore_1.updateDoc)(docRef, {
                    timer: {
                        startTime: new Date(_this.startTime),
                        elapsedTime: _this.elapsedTime / 1000,
                        isRunning: true,
                        formattedTime: _this.getFormattedTime()
                    }
                });
            }, 1000);
            this.isTimerRunning = true;
            (0, notificationUtils_1.displayNotification)('Timer started.', 'success');
        }
        else {
            console.log('Timer is already running.');
            (0, notificationUtils_1.displayNotification)('Timer is already running.', 'error');
        }
    };
    TodoList.prototype.pauseTimer = function () {
        var _a;
        if (this.isTimerRunning && this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isTimerRunning = false;
            var todoListId = (_a = this.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
            var docRef = (0, firestore_1.doc)(firestore, 'todoLists', "".concat(todoListId));
            (0, firestore_1.updateDoc)(docRef, {
                timer: {
                    startTime: new Date(this.startTime),
                    elapsedTime: this.elapsedTime / 1000,
                    isRunning: false,
                    formattedTime: this.getFormattedTime()
                }
            });
            (0, notificationUtils_1.displayNotification)('Timer paused.', 'success');
        }
        else {
            console.log('Timer is not running.');
            (0, notificationUtils_1.displayNotification)('Timer is not running.', 'error');
        }
    };
    // Helper method to get formatted time string
    TodoList.prototype.getFormattedTime = function () {
        var hours = Math.floor(this.elapsedTime / 3600000);
        var minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
        var seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        return "".concat(String(hours).padStart(2, '0'), ":").concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
    };
    TodoList.prototype.updateTimerDisplay = function () {
        var hours = Math.floor(this.elapsedTime / 3600000);
        var minutes = Math.floor((this.elapsedTime % 3600000) / 60000);
        var seconds = Math.floor((this.elapsedTime % 60000) / 1000);
        var formattedTime = "".concat(String(hours).padStart(2, '0'), ":").concat(String(minutes).padStart(2, '0'), ":").concat(String(seconds).padStart(2, '0'));
        if (this.time) {
            this.time.innerHTML = "".concat(formattedTime, "<br>Previous Time: ").concat(this.previousTime);
        }
    };
    // aan verderwerken
    TodoList.prototype.updatePoints = function (pointsToAdd) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, userID, userDocRef, userDocSnapshot, currentPoints, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        user = auth.currentUser;
                        if (!user) return [3 /*break*/, 5];
                        userID = user.uid;
                        userDocRef = (0, firestore_1.doc)(firestore, 'users', userID);
                        console.log(userDocRef);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, (0, firestore_1.getDoc)(userDocRef)];
                    case 2:
                        userDocSnapshot = _b.sent();
                        currentPoints = ((_a = userDocSnapshot.data()) === null || _a === void 0 ? void 0 : _a.points) || 0;
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(userDocRef, {
                                points: currentPoints + pointsToAdd
                            })];
                    case 3:
                        _b.sent();
                        console.log('Points updated in Firestore');
                        (0, notificationUtils_1.displayNotification)("Points updated: +".concat(pointsToAdd), 'success');
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _b.sent();
                        console.error('Error updating points:', error_3);
                        (0, notificationUtils_1.displayNotification)('Error updating points', 'error');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TodoList.prototype.getMillisecondsFromFormattedTime = function (formattedTime) {
        var _a = formattedTime.split(':').map(Number), hours = _a[0], minutes = _a[1], seconds = _a[2];
        return (hours * 3600 + minutes * 60 + seconds) * 1000;
    };
    TodoList.prototype.render = function () {
        var _this = this;
        if (this.todoListElement instanceof HTMLElement) {
            this.todoListElement.addEventListener('drop', dragAndDrop_1.dropHandler);
            this.todoListElement.addEventListener('dragover', dragAndDrop_1.dragoverHandler);
            // Add a delete button and event listener
            var deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete List';
            deleteButton.classList.add('btn-delete');
            deleteButton.addEventListener('click', function () {
                var user = auth.currentUser;
                if (user) {
                    _this.deleteListFirestore();
                }
            });
            this.todoListElement.append(deleteButton);
            this.place.append(this.todoListElement);
        }
    };
    TodoList.prototype.createToDoListElement = function () {
        var _this = this;
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
        this.todoListElement.id = "todoList_".concat(Date.now());
        // timer
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.classList.add('timer-display');
        this.timerDisplay.id = "timerDisplay_".concat(Date.now());
        this.time = document.createElement('p');
        this.time.innerText = this.previousTime || '00:00:00'; // Use the previous time or default to '00:00:00'
        this.startButton = document.createElement('button');
        this.startButton.innerText = 'start';
        this.startButton.addEventListener('click', function () {
            if (_this.previousTime) {
                var previousTimeMilliseconds = _this.getMillisecondsFromFormattedTime(_this.previousTime);
                _this.startTime = Date.now() - previousTimeMilliseconds;
                _this.elapsedTime = previousTimeMilliseconds;
            }
            else {
                _this.startTime = Date.now();
                _this.elapsedTime = 0;
            }
            _this.startTimer();
        });
        this.pauseButton = document.createElement('button');
        this.pauseButton.innerText = 'pause';
        this.pauseButton.addEventListener('click', function () {
            _this.pauseTimer();
            console.log('pause');
        });
        // Create invite person button
        var invitePersonButton = document.createElement('button');
        invitePersonButton.innerText = '+';
        invitePersonButton.classList.add('btn-add');
        // Create email input field
        var emailInput = document.createElement('input');
        emailInput.placeholder = 'Enter email';
        emailInput.type = 'email';
        emailInput.classList.add('email-input');
        // Add event listener to invite person button
        invitePersonButton.addEventListener('click', function () {
            var email = emailInput.value;
            if (email) {
                _this.invitePersonByEmail(email);
                emailInput.value = '';
            }
        });
        // Add Event listener
        this.button.addEventListener('click', function () {
            var _a;
            if ((_this.input !== null) && ((_a = _this.input) === null || _a === void 0 ? void 0 : _a.value) !== '') {
                _this.addToDo.call(_this);
                _this.input.value = '';
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
    };
    return TodoList;
}());
exports["default"] = TodoList;
