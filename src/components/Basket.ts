
import { IBasket, IBasketItem, IBasketPage } from "../types";
import { CardModel } from "./CardModel";
import { EventEmitter } from "./base/events";

export class Basket implements IBasket {
  eventEmitter: EventEmitter;
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  _basketList: HTMLElement;
  submitButton: HTMLButtonElement;

  constructor (template: HTMLTemplateElement, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.basketElement = template.content.querySelector('.basket').cloneNode(true) as HTMLElement;
    this._basketList = this.basketElement.querySelector('.basket__list');
    this.basketTotalPrice = this.basketElement.querySelector('.basket__price');
    this.submitButton = this.basketElement.querySelector('.basket__button');
    this.submitButton.addEventListener('click', () => this.eventEmitter.emit('submit:order'));
  }

  render() {
    return this.basketElement;
  }

  set content(value: HTMLElement) {
    this._basketList.append(value);
  }

  resetContent() {
    this._basketList.innerHTML = '';
  }

  set total(value: string) {
    this.basketTotalPrice.textContent = `${value} синапсов`;
  }

  disableButton(addedCardList: CardModel[]) {
    if (addedCardList.length === 0) {
      this.submitButton.disabled = true;
    } else {
      this.submitButton.disabled = false;
    }
  }
}

export class BasketItem implements IBasketItem {
  eventEmitter: EventEmitter;
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;

  constructor(template: HTMLTemplateElement, eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.basketElement = template.content.cloneNode(true) as HTMLElement;
    this.basketItem = this.basketElement.querySelector('.basket__item');
    this.basketItemIndex = this.basketElement.querySelector('.basket__item-index');
    this.basketItemTitle = this.basketElement.querySelector('.card__title');
    this.basketItemPrice = this.basketElement.querySelector('.card__price');
    this.basketItemDeleteButton = this.basketElement.querySelector('.basket__item-delete');
    this.basketItemDeleteButton.addEventListener('click', () => this.eventEmitter.emit('basket:itemDelete', {data: this}));
  }

  render(card: CardModel, cardsList: CardModel[]) {
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

export class BasketPage implements IBasketPage {
  eventEmitter: EventEmitter;
  basketButton: HTMLElement;
  _basketCounter: HTMLElement;

  constructor(eventEmitter: EventEmitter) {
    this.eventEmitter = eventEmitter;
    this.basketButton = document.querySelector('.header__basket');
    this._basketCounter = document.querySelector('.header__basket-counter');
    this.basketButton.addEventListener('click', () => this.eventEmitter.emit('basket:open'));
  }

  set basketCounter(value: string) {
    this._basketCounter.textContent = value;
  }
}