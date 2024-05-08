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
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;
}

export interface IBasket<T> {
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  basketList: HTMLElement;
  submitButton: HTMLButtonElement;
  content: HTMLElement;
  total: string;
  disableButton(addedCardList: CardModel[]): void;
  resetContent(): void;
  render(container: Partial<T>): HTMLElement;
}

export interface IBasketItem<T> {
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;
  render(container: Partial<T>): HTMLElement;
}

export interface IBasketPage<T> {
  basketButton: HTMLElement;
  basketCounter: HTMLElement;
  counter: string;
}

export interface IFormAddress<T> {
  formElement: HTMLFormElement;
  form: HTMLFormElement;
  onlineButton: HTMLButtonElement;
  offlineButton: HTMLButtonElement;
  inputAddres: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(container: Partial<T>): HTMLElement;
  resetFields(): void;
}

export interface IUserOption {
  userPaymentMethod: 'card' | 'cash' | null;
  userAddress: string;
  userEmail: string;
  userPhone: string;
  paymentMethod: 'card' | 'cash' | null;
  address: string;
  email: string;
  phone: string;
  resetFields(): void;
}

export interface IFormContacts<T> {
  templateForm: HTMLFormElement;
  form: HTMLFormElement;
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  render(container: Partial<T>): HTMLElement;
  resetFields(): void;
}

export interface ISuccsess<T> {
  element: HTMLElement;
  render(container: Partial<T>): HTMLElement;
  setDescription(value: string): void;
}

export interface IModal {
  content: HTMLElement;
  closeModal(): void;
  openModal(): void;
}