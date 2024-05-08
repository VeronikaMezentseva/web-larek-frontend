import { IFormAddress, IFormContacts } from "../types";
import { Component } from "./base/component";
import { EventEmitter } from "./base/events";

export class FormAddress extends Component<FormAddress> implements IFormAddress<FormAddress> {
  eventEmitter: EventEmitter
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor(container: HTMLFormElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.formElement = container;
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
    this.setDisabled(this.submitButton, true);
    this.inputAddres.value = '';
  }
}

export class FormContacts extends Component<FormContacts> implements IFormContacts<FormContacts> {
  eventEmitter: EventEmitter;
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor (container: HTMLFormElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.templateForm = container;
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

  resetFields() {
    this.setDisabled(this.submitButton, true);
    this.emailInput.value = '';
    this.phoneInput.value = '';
  }
}