"use strict";
exports.__esModule = true;
exports.dropHandler = exports.dragoverHandler = exports.dragstartHandler = void 0;
var app_1 = require("firebase/app");
require("firebase/firestore"); // Import firestore module if you're using it
var firestore_1 = require("firebase/firestore");
var firebaseConfig_1 = require("./firebaseConfig");
var firestore = (0, firestore_1.getFirestore)();
(0, app_1.initializeApp)(firebaseConfig_1["default"]);
/* eslint-disable no-param-reassign */
function dragstartHandler(ev) {
    // Add the target element's id to the data transfer object
    if (ev.target instanceof HTMLElement && ev.dataTransfer != null) {
        ev.dataTransfer.setData('text/plain', ev.target.id);
        ev.dataTransfer.dropEffect = 'move';
    }
}
exports.dragstartHandler = dragstartHandler;
function dragoverHandler(ev) {
    if (ev instanceof DragEvent && (ev.dataTransfer != null)) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'move';
    }
}
exports.dragoverHandler = dragoverHandler;
// export function dropHandler(ev: DragEvent): void {
//   if (ev instanceof DragEvent && (ev.dataTransfer != null)) {
//     ev.preventDefault();
//     // Get the id of the target and add the moved element to the target's DOM
//     const data = ev.dataTransfer.getData('text/plain');
//     (ev.target as HTMLElement).appendChild(document.querySelector(`#${data}`) as HTMLElement);
//   }
// }
// own version of dropHandler
function dropHandler(ev) {
    if (ev instanceof DragEvent && ev.dataTransfer != null) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData('text/plain');
        var draggedElement = document.getElementById(data);
        if (draggedElement && ev.target instanceof HTMLElement) {
            // Append the dragged element to the target's DOM
            ev.target.appendChild(draggedElement);
        }
    }
}
exports.dropHandler = dropHandler;
