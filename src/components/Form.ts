import { IFormAddress, IFormContacts, ISuccsess } from "../types";
import { EventEmitter } from "./base/events";

export class FormAddress implements IFormAddress {
  eventEmitter: EventEmitter
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.formElement = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.form = this.formElement;
    this.onlineButton = this.form.elements.namedItem('card') as HTMLButtonElement;
    this.offlineButton = this.form.elements.namedItem('cash') as HTMLButtonElement;
    this.inputAddres = this.form.elements.namedItem('address') as HTMLInputElement;
    this.submitButton = this.formElement.querySelector('.order__button');
    this.error = this.formElement.querySelector('.form__errors');

    this.onlineButton.addEventListener('click', (evt) => {
      this.activateOnlineButton();
      this.eventEmitter.emit('user:onlineSelected', {value: evt.target, button: this.submitButton});
    });
    this.offlineButton.addEventListener('click', (evt) => {
      this.activateOfflineButton();
      this.eventEmitter.emit('user:offlineSelected', {value: evt.target, button: this.submitButton});
    });

    this.inputAddres.addEventListener('input', (evt) => {
      this.eventEmitter.emit('user:inputAddres', {value: evt.target, button: this.submitButton, error: this.error});
    });
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.eventEmitter.emit('user:submitForm');
    })
  }

  render() {
    return this.formElement;
  }

  activateOnlineButton() {
    this.onlineButton.classList.add('button_alt-active');
    this.offlineButton.classList.remove('button_alt-active');
  }

  activateOfflineButton() {
    this.offlineButton.classList.add('button_alt-active');
    this.onlineButton.classList.remove('button_alt-active');
  }

  resetFields() {
    this.offlineButton.classList.remove('button_alt-active');
    this.onlineButton.classList.remove('button_alt-active');
    this.submitButton.disabled = true;
    this.inputAddres.value = '';
  }
}

export class FormContacts implements IFormContacts {
  eventEmitter: EventEmitter;
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor (template: HTMLTemplateElement, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.templateForm = template.content.querySelector('.form').cloneNode(true) as HTMLFormElement;
    this.form = this.templateForm;
    this.emailInput = this.form.elements.namedItem('email') as HTMLInputElement;
    this.phoneInput = this.form.elements.namedItem('phone') as HTMLInputElement;
    this.submitButton = this.templateForm.querySelector('.button');
    this.error = this.templateForm.querySelector('.form__errors');

    this.emailInput.addEventListener('input', (evt) => this.eventEmitter.emit('user:emailInput', {value: evt.target, button: this.submitButton, error: this.error}));
    this.phoneInput.addEventListener('input', (evt) => this.eventEmitter.emit('user:phoneInput', {value: evt.target, button: this.submitButton, error: this.error}));
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.eventEmitter.emit('user:contactsFormSubmit');
    })
  }

  render() {
    return this.templateForm;
  }

  resetFields() {
    this.submitButton.disabled = true;
    this.emailInput.value = '';
    this.phoneInput.value = '';
  }
}

export class Succsess implements ISuccsess {
  eventEmitter: EventEmitter;
  element: HTMLElement;
  orderDescription: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.element = template.content.querySelector('.order-success').cloneNode(true) as HTMLFormElement;
    this.orderDescription = this.element.querySelector('.order-success__description');
    this.button = this.element.querySelector('.order-success__close');
    this.button.addEventListener('click', () => this.eventEmitter.emit('succsess:close'));
  }

  setDescription(value: string) {
    this.orderDescription.textContent = value;
  }

  render () {
    return this.element;
  }
}