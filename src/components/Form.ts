import { EventEmitter } from "./base/events";

export interface IForm extends EventEmitter {
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
}

export class Form extends EventEmitter implements IForm {
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor(template: HTMLTemplateElement) {
    super();
    this.formElement = template.content.cloneNode(true) as HTMLFormElement;
    this.form = this.formElement.querySelector('.form');
    this.onlineButton = this.form.elements.namedItem('card') as HTMLButtonElement;
    this.offlineButton = this.form.elements.namedItem('cash') as HTMLButtonElement;
    this.inputAddres = this.form.elements.namedItem('address') as HTMLInputElement;
    this.submitButton = this.formElement.querySelector('.order__button');
    this.error = this.formElement.querySelector('.form__errors');

    this.onlineButton.addEventListener('click', (evt) => {
      this.activateOnlineButton();
      this.emit('user:onlineSelected', {value: evt.target, button: this.submitButton});
    });
    this.offlineButton.addEventListener('click', (evt) => {
      this.activateOfflineButton();
      this.emit('user:offlineSelected', {value: evt.target, button: this.submitButton});
    });

    this.inputAddres.addEventListener('input', (evt) => {
      this.emit('user:inputAddres', {value: evt.target, button: this.submitButton, error: this.error});
    });
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.emit('user:submitForm');
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
}

export interface IUserOption {
  _paymentMethod: 'card' | 'cash' | null;
  _addres: string;
  _email: string;
  _phone: string;
  paymentMethod: 'card' | 'cash' | null;
  address: string;
  email: string;
  phone: string;
  resetFields(): void;
}

export class UserOptions implements IUserOption {
  _paymentMethod: 'card' | 'cash' | null;
  _addres: string;
  _email: string;
  _phone: string;

  constructor() {
    this._paymentMethod = null;
    this._addres = '';
    this._email = '';
    this._phone = '';
  };

  set paymentMethod(value: 'card' | 'cash' | null) {
    this._paymentMethod = value;
  }

  set address(value: string) {
    this._addres = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set phone(value: string) {
    this._phone = value;
  }

  resetFields() {
    this._paymentMethod = null;
    this._addres = '';
    this._email = '';
    this._phone = '';
  }
}

export interface IFormContacts extends EventEmitter {
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
}

export class FormContacts extends EventEmitter implements IFormContacts {
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  error: HTMLElement;

  constructor (template: HTMLTemplateElement) {
    super();
    this.templateForm = template.content.cloneNode(true) as HTMLFormElement;
    this.form = this.templateForm.querySelector('.form');
    this.emailInput = this.form.elements.namedItem('email') as HTMLInputElement;
    this.phoneInput = this.form.elements.namedItem('phone') as HTMLInputElement;
    this.submitButton = this.templateForm.querySelector('.button');
    this.error = this.templateForm.querySelector('.form__errors');

    this.emailInput.addEventListener('input', (evt) => this.emit('user:emailInput', {value: evt.target, button: this.submitButton, error: this.error}));
    this.phoneInput.addEventListener('input', (evt) => this.emit('user:phoneInput', {value: evt.target, button: this.submitButton, error: this.error}));
    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.emit('user:contactsFormSubmit');
    })
  }

  render() {
    return this.templateForm;
  }
}

export interface ISuccsess extends EventEmitter {
  element: HTMLElement;
  render(): HTMLElement;
  setDescription(value: string): void;
}

export class Succsess extends EventEmitter implements ISuccsess {
  element: HTMLElement;
  orderDescription: HTMLElement;
  button: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super();
    this.element = template.content.cloneNode(true) as HTMLFormElement;
    this.orderDescription = this.element.querySelector('.order-success__description');
    this.button = this.element.querySelector('.order-success__close');
    this.button.addEventListener('click', () => this.emit('succsess:close'));
  }

  setDescription(value: string) {
    this.orderDescription.textContent = value;
  }

  render () {
    return this.element;
  }
}