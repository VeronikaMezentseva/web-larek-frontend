import { ISuccsess } from "../types";
import { Component } from "./base/component";
import { EventEmitter } from "./base/events";

export class Succsess extends Component<Succsess> implements ISuccsess<Succsess> {
  eventEmitter: EventEmitter;
  element: HTMLElement;
  orderDescription: HTMLElement;
  button: HTMLButtonElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container)
    this.eventEmitter = eventEmitter;
    this.element = container;
    this.orderDescription = this.element.querySelector('.order-success__description');
    this.button = this.element.querySelector('.order-success__close');
    this.button.addEventListener('click', () => this.eventEmitter.emit('succsess:close'));
  }

  setDescription(value: string) {
    this.orderDescription.textContent = `Списано ${value}`;
  }
}