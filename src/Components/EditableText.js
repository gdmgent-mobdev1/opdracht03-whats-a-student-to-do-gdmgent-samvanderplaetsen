"use strict";
exports.__esModule = true;
var EditableText = /** @class */ (function () {
    function EditableText(text, place, card, property, typeOfInput) {
        this.text = text;
        this.place = place;
        this.card = card;
        this.property = property;
        this.typeOfInput = typeOfInput;
        this.render();
    }
    EditableText.prototype.render = function () {
        var _this = this;
        this.div = document.createElement('div');
        this.p = document.createElement('p');
        this.p.innerText = this.text;
        this.p.addEventListener('click', function () {
            _this.showEditableTextArea.call(_this);
        });
        this.div.append(this.p);
        this.place.append(this.div);
    };
    EditableText.prototype.showEditableTextArea = function () {
        var _this = this;
        var _a, _b;
        var oldText = this.text;
        this.input = document.createElement(this.typeOfInput);
        this.saveButton = document.createElement('button');
        if (this.p instanceof HTMLParagraphElement) {
            this.p.remove();
        }
        this.input.value = oldText;
        this.saveButton.innerText = 'Save';
        this.saveButton.className = 'btn-save';
        this.input.classList.add('comment');
        this.saveButton.addEventListener('click', function () {
            var _a;
            console.log(_this);
            if (_this.input instanceof HTMLTextAreaElement || _this.input instanceof HTMLInputElement) {
                _this.text = _this.input.value;
            }
            if (_this.property === 'description' && (_this.input != null)) {
                _this.card.state.description = _this.input.value;
            }
            if (_this.property === 'text' && (_this.input != null) && (_this.card.p != null)) {
                _this.card.p.innerText = _this.input.value;
                _this.card.state.text = _this.input.value;
            }
            (_a = _this.div) === null || _a === void 0 ? void 0 : _a.remove();
            _this.render();
        });
        function clickSaveButton(event, object) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.key === 'Enter') {
                // Cancel the default action, if needed
                event.preventDefault();
                // Trigger the button element with a click
                object.saveButton.click();
            }
        }
        this.input.addEventListener('keyup', function (e) {
            if (_this.typeOfInput === 'input') {
                clickSaveButton(e, _this);
            }
        });
        (_a = this === null || this === void 0 ? void 0 : this.div) === null || _a === void 0 ? void 0 : _a.append(this.input);
        if (this.typeOfInput === 'textarea') {
            (_b = this === null || this === void 0 ? void 0 : this.div) === null || _b === void 0 ? void 0 : _b.append(this.saveButton);
        }
        this.input.select();
    };
    return EditableText;
}());
exports["default"] = EditableText;
