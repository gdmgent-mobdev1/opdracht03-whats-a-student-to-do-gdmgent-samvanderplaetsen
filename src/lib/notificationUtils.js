"use strict";
exports.__esModule = true;
exports.displayNotification = void 0;
function displayNotification(message, type) {
    if (type === void 0) { type = 'success'; }
    var notificationContainer = document.getElementById('notificationContainer');
    if (notificationContainer) {
        var notificationElement_1 = document.createElement('div');
        notificationElement_1.className = "notification ".concat(type);
        notificationElement_1.textContent = message;
        notificationContainer.appendChild(notificationElement_1);
        // Automatically remove the notification after a certain time (e.g., 5 seconds)
        setTimeout(function () {
            notificationElement_1.remove();
        }, 2500);
    }
}
exports.displayNotification = displayNotification;
