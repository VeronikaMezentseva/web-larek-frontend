import { CardModel } from "../components/CardModel";

export interface CardModelList {
  items: CardModel[];
}

export interface IViewCard {
  cardElement: HTMLElement;
  cardCategory: HTMLElement;
  cardButton?: HTMLButtonElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  render(card: CardModel): HTMLElement;
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;
}

export interface IBasket {
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  _basketList: HTMLElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
  content: HTMLElement;
  total: string;
  disableButton(addedCardList: CardModel[]): void;
  resetContent(): void;
}

export interface IBasketItem {
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;
  render(card: CardModel, cardsList: CardModel[]): HTMLElement;
}

export interface IBasketPage {
  basketButton: HTMLElement;
  basketCounter: HTMLElement;
}

export interface IFormAddress {
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
  resetFields(): void;
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

export interface IFormContacts {
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
  resetFields(): void;
}

export interface ISuccsess {
  element: HTMLElement;
  render(): HTMLElement;
  setDescription(value: string): void;
}

export interface IModal {
  content: HTMLElement;
  closeModal(): void;
  openModal(): void;
}