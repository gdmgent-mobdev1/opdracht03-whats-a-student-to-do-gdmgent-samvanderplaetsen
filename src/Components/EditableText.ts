import { Property } from "../lib";
import Card from "./Card";

export default class EditableText{
  text: string;
  place: HTMLElement;
  card: Card;
  typeOfInput: string;

  div?: HTMLDivElement;

  p?: HTMLParagraphElement;
  input?: HTMLInputElement;

  saveButton?: HTMLButtonElement;

  property: Property;

  constructor(
    text: string,
    place: HTMLElement,
    card: Card,
    property: Property,
    typeOfInput: string
  ){
    this.text = text;
    this.place = place;
    this.card = card;
    this.property = property;
    this.typeOfInput = typeOfInput;
    this.render();
  }

  render() {
    this.div = document.createElement('div');
    this.p = document.createElement('p');
    this.p.innerText = this.text;

    this.p.addEventListener('click', () => {
      this.showEditableTextArea.Call(this);
    });

    this.div.appendChild(this.p);
    this.place.append(this.div);
  }

  showEditableTextArea() {
    const prevText = this.text;

    this.input = document.createElement(this.typeOfInput) as HTMLInputElement;
    this.saveButton = document.createElement('button');

    this.input.value = prevText;
    this.p?.remove();
    this.saveButton.innerHTML = 'save';
    this.saveButton.classList.add('btn-save');
    this.input.classList.add('comment');

    this.saveButton.addEventListener('click', () => {
      this.text = this.input?.value;
      if(this.property ===  'description') {
      //this.card.state.description = this.input.value
        
      }

      if(this.property ===  'text') {
        //this.card.state.innerText = this.input.value
          
      }
      this.div?.remove();
      this.render();
    })
  }


}