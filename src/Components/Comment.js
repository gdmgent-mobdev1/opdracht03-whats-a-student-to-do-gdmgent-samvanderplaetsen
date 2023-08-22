"use strict";
exports.__esModule = true;
/* eslint-disable import/no-cycle */
var uuid_1 = require("uuid");
var Comment = /** @class */ (function () {
    function Comment(text, place, card) {
        this.text = text;
        this.place = place;
        this.card = card;
        this.id = (0, uuid_1.v4)();
        this.render();
    }
    Comment.prototype.render = function () {
        this.div = document.createElement('div');
        this.div.className = 'comment';
        this.card.id = this.id;
        this.div.innerText = this.text;
        this.place.append(this.div);
    };
    return Comment;
}());
exports["default"] = Comment;
