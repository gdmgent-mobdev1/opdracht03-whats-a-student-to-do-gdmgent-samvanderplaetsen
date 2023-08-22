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
/* eslint-disable import/no-cycle */
var uuid_1 = require("uuid");
var lib_1 = require("../lib");
var dragAndDrop_1 = require("../lib/dragAndDrop");
var Comment_1 = require("./Comment");
var EditableText_1 = require("./EditableText");
var firestore_1 = require("firebase/firestore");
var app_1 = require("firebase/app");
require("firebase/firestore");
var firebaseConfig_1 = require("../lib/firebaseConfig");
var auth_1 = require("firebase/auth");
var notificationUtils_1 = require("../lib/notificationUtils");
var firebaseApp = (0, app_1.initializeApp)(firebaseConfig_1["default"]);
var firestore = (0, firestore_1.getFirestore)(firebaseApp);
var auth = (0, auth_1.getAuth)();
var Card = /** @class */ (function () {
    function Card(text, place, todoList) {
        this.id = (0, uuid_1.v4)();
        this.place = place;
        this.todoList = todoList;
        this.state = {
            text: text,
            description: 'Click to write a description...',
            comments: []
        };
        this.render();
    }
    Card.prototype.render = function () {
        var _this = this;
        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.card.setAttribute('draggable', 'true');
        this.card.id = this.id;
        this.card.addEventListener('click', function (e) {
            if (e.target !== _this.deleteButton) {
                _this.showMenu.call(_this);
            }
        });
        this.card.addEventListener('dragstart', dragAndDrop_1.dragstartHandler);
        this.p = document.createElement('p');
        this.p.innerText = this.state.text;
        this.deleteButton = document.createElement('button');
        this.deleteButton.innerText = 'X';
        this.deleteButton.addEventListener('click', function () {
            _this.deleteCard.call(_this);
        });
        this.card.append(this.p);
        this.card.append(this.deleteButton);
        this.place.append(this.card);
    };
    Card.prototype.deleteCard = function () {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var i, todoListId, docRef, docSnapshot, existingTodos, cardId, todoItemValue, error_1;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!this.card) return [3 /*break*/, 5];
                        // Remove from UI
                        this.card.remove();
                        i = this.todoList.cardArray.indexOf(this);
                        this.todoList.cardArray.splice(i, 1);
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 4, , 5]);
                        todoListId = (_a = this.todoList.todoListElement) === null || _a === void 0 ? void 0 : _a.id;
                        docRef = (0, firestore_1.doc)(firestore, 'todoLists', "".concat(todoListId));
                        return [4 /*yield*/, (0, firestore_1.getDoc)(docRef)];
                    case 2:
                        docSnapshot = _d.sent();
                        existingTodos = ((_b = docSnapshot.data()) === null || _b === void 0 ? void 0 : _b.todos) || [];
                        cardId = this.card;
                        todoItemValue = (_c = this.p) === null || _c === void 0 ? void 0 : _c.innerText;
                        existingTodos.splice(existingTodos.indexOf(todoItemValue), 1);
                        // Update the document with the updated todos array
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(docRef, {
                                todos: existingTodos
                            })];
                    case 3:
                        // Update the document with the updated todos array
                        _d.sent();
                        this.updatePoints(10); // Award 10 points for completing a task
                        (0, notificationUtils_1.displayNotification)('10 points added successfully!', 'success');
                        (0, notificationUtils_1.displayNotification)('Card successfully deleted from Firestore', 'success');
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _d.sent();
                        console.error('Error deleting card from Firestore:', error_1);
                        (0, notificationUtils_1.displayNotification)('An error occurred while deleting card from Firestore.', 'error');
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Card.prototype.updatePoints = function (pointsToAdd) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var user, userID, userDocRef, userDocSnapshot, currentPoints, error_2;
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
                        // Update the user's points
                        return [4 /*yield*/, (0, firestore_1.updateDoc)(userDocRef, {
                                points: currentPoints + pointsToAdd
                            })];
                    case 3:
                        // Update the user's points
                        _b.sent();
                        console.log('Points updated in Firestore');
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _b.sent();
                        console.error('Error updating points:', error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Card.prototype.showMenu = function () {
        var _this = this;
        // Create elements
        this.menu = document.createElement('div');
        this.menuContainer = document.createElement('div');
        this.menuTitle = document.createElement('div');
        this.menuDescription = document.createElement('div');
        this.commentsInput = document.createElement('input');
        this.commentsButton = document.createElement('button');
        this.menuComments = document.createElement('div');
        // Add class names
        this.menu.className = 'menu';
        this.menuContainer.className = 'menuContainer';
        this.menuTitle.className = 'menuTitle';
        this.menuDescription.className = 'menuDescription';
        this.menuComments.className = 'menuComments';
        this.commentsInput.className = 'commentsInput comment';
        this.commentsButton.className = 'commentsButton btn-save';
        // Add inner Text
        this.commentsButton.innerText = 'Add';
        this.commentsInput.placeholder = 'Write a comment...';
        // Event listeners
        this.menuContainer.addEventListener('click', function (e) {
            var _a;
            if (e.target.classList.contains('menuContainer') && (_this.menuContainer != null)) {
                (_a = _this.menuContainer) === null || _a === void 0 ? void 0 : _a.remove();
            }
        });
        this.commentsButton.addEventListener('click', function () {
            var _a, _b;
            if (((_a = _this.commentsInput) === null || _a === void 0 ? void 0 : _a.value) !== '' && (_this.commentsInput != null)) {
                (_b = _this.state.comments) === null || _b === void 0 ? void 0 : _b.push(_this.commentsInput.value);
                _this.renderComments();
                _this.commentsInput.value = '';
            }
        });
        // Append
        this.menu.append(this.menuTitle);
        this.menu.append(this.menuDescription);
        this.menu.append(this.commentsInput);
        this.menu.append(this.commentsButton);
        this.menu.append(this.menuComments);
        this.menuContainer.append(this.menu);
        lib_1.root.append(this.menuContainer);
        this.editableDescription = new EditableText_1["default"](this.state.description, this.menuDescription, this, 'description', 'textarea');
        this.editableTitle = new EditableText_1["default"](this.state.text, this.menuTitle, this, 'text', 'input');
        this.renderComments();
    };
    Card.prototype.renderComments = function () {
        var _this = this;
        var _a;
        if (this.menuComments instanceof HTMLElement && this.menuComments != null) {
            var currentCommentsDOM = Array.from(this.menuComments.childNodes);
            currentCommentsDOM.forEach(function (commentDOM) {
                commentDOM.remove();
            });
            (_a = this.state.comments) === null || _a === void 0 ? void 0 : _a.forEach(function (comment) {
                if (_this.menuComments instanceof HTMLElement) {
                    // eslint-disable-next-line no-new
                    new Comment_1["default"](comment, _this.menuComments, _this);
                }
            });
        }
    };
    return Card;
}());
exports["default"] = Card;
