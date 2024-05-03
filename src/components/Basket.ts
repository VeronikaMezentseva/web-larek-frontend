
import { card } from "./Card";
import { EventEmitter } from "./base/events";

export interface IBasket extends EventEmitter {
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  _basketList: HTMLElement;
  submitButton: HTMLButtonElement;
  render(): HTMLElement;
  content: HTMLElement;
  total: string;
  disableButton(addedCardList: card[]): void;
}

export class Basket extends EventEmitter implements IBasket {
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  _basketList: HTMLElement;
  submitButton: HTMLButtonElement;

  constructor (template: HTMLTemplateElement) {
    super();
    this.basketElement = template.content.cloneNode(true) as HTMLElement;
    this._basketList = this.basketElement.querySelector('.basket__list');
    this.basketTotalPrice = this.basketElement.querySelector('.basket__price');
    this.submitButton = this.basketElement.querySelector('.basket__button');
    this.submitButton.addEventListener('click', () => this.emit('submit:order'));
  }

  render() {
    return this.basketElement;
  }

  set content(value: HTMLElement) {
    this._basketList.append(value);
  }

  set total(value: string) {
    this.basketTotalPrice.textContent = `${value} синапсов`;
  }

  disableButton(addedCardList: card[]) {
    if (addedCardList.length === 0) {
      this.submitButton.disabled = true;
    } else {
      this.submitButton.disabled = false;
    }
  }
}

export interface IBasketItem extends EventEmitter {
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;
  render(card: card, cardsList: card[]): HTMLElement;
}

export class BasketItem extends EventEmitter implements IBasketItem {
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;

  constructor(template: HTMLTemplateElement) {
    super();
    this.basketElement = template.content.cloneNode(true) as HTMLElement;
    this.basketItem = this.basketElement.querySelector('.basket__item');
    this.basketItemIndex = this.basketElement.querySelector('.basket__item-index');
    this.basketItemTitle = this.basketElement.querySelector('.card__title');
    this.basketItemPrice = this.basketElement.querySelector('.card__price');
    this.basketItemDeleteButton = this.basketElement.querySelector('.basket__item-delete');
    this.basketItemDeleteButton.addEventListener('click', () => this.emit('basket:itemDelete'));
  }

  render(card: card, cardsList: card[]) {
    this.itemId = card.id;
    this.basketItemIndex.textContent = `${cardsList.indexOf(card) + 1}`;
    this.basketItemTitle.textContent = card.title;
    if (card.price === null) {
      this.basketItemPrice.textContent = `0 синапсов`;
    } else {
      this.basketItemPrice.textContent = `${card.price} синапсов`;
    } 
    return this.basketElement;
  }

}

export interface IBasketPage extends EventEmitter {
  basketButton: HTMLElement;
  basketCounter: HTMLElement;
}

export class BasketPage extends EventEmitter implements IBasketPage {
  basketButton: HTMLElement;
  basketCounter: HTMLElement;

  constructor() {
    super();
    this.basketButton = document.querySelector('.header__basket');
    this.basketCounter = document.querySelector('.header__basket-counter');
    this.basketButton.addEventListener('click', () => this.emit('basket:open'));
  }
}