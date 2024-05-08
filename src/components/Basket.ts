
import { IBasket, IBasketItem, IBasketPage } from "../types";
import { CardModel } from "./CardModel";
import { Component } from "./base/component";
import { EventEmitter } from "./base/events";

export class Basket extends Component<Basket> implements IBasket<Basket> {
  eventEmitter: EventEmitter;
  basketElement: HTMLElement;
  basketTotalPrice: HTMLElement;
  basketList: HTMLElement;
  submitButton: HTMLButtonElement;

  constructor (container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.basketElement = container;
    this.basketList = this.basketElement.querySelector('.basket__list');
    this.basketTotalPrice = this.basketElement.querySelector('.basket__price');
    this.submitButton = this.basketElement.querySelector('.basket__button');
    this.submitButton.addEventListener('click', () => this.eventEmitter.emit('submit:order'));
  }

  set content(value: HTMLElement) {
    this.basketList.append(value);
  }

  resetContent() {
    this.basketList.innerHTML = '';
  }

  set total(value: string) {
    this.basketTotalPrice.textContent = `${value} синапсов`;
  }

  disableButton(addedCardList: CardModel[]) {
    if (addedCardList.length === 0) {
      this.setDisabled(this.submitButton, true)
    } else {
      this.setDisabled(this.submitButton, false)
    }
  }
}

export class BasketItem extends Component<BasketItem> implements IBasketItem<BasketItem> {
  eventEmitter: EventEmitter;
  basketElement: HTMLElement;
  basketItemIndex: HTMLElement;
  basketItem: HTMLElement;
  basketItemTitle: HTMLElement;
  basketItemPrice: HTMLElement;
  basketItemDeleteButton: HTMLButtonElement;
  itemId: string;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.basketElement = container;
    this.basketItem = this.basketElement.querySelector('.basket__item');
    this.basketItemIndex = this.basketElement.querySelector('.basket__item-index');
    this.basketItemTitle = this.basketElement.querySelector('.card__title');
    this.basketItemPrice = this.basketElement.querySelector('.card__price');
    this.basketItemDeleteButton = this.basketElement.querySelector('.basket__item-delete');
    this.basketItemDeleteButton.addEventListener('click', () => this.eventEmitter.emit('basket:itemDelete', {data: this}));
    this.basketItemDeleteButton.addEventListener('click', () => this.eventEmitter.emit('basket:changed', {data: this}));
  }

  set id(value: string) {
    this.itemId = value;
  }

  set title(value: string) {
    this.setText(this.basketItemTitle, value);
  }

  set price(value: number) {
    this.setText(this.basketItemPrice, `${value} синапсов`)
  }

  set index(value: number) {
    this.setText(this.basketItemIndex, `${value + 1}`)
  }
}

export class BasketPage extends Component<BasketPage> implements IBasketPage<BasketPage> {
  eventEmitter: EventEmitter;
  basketButton: HTMLElement;
  basketCounter: HTMLElement;

  constructor(container: HTMLElement, eventEmitter: EventEmitter) {
    super(container);
    this.eventEmitter = eventEmitter;
    this.basketButton = document.querySelector('.header__basket');
    this.basketCounter = container;
    this.basketButton.addEventListener('click', () => this.eventEmitter.emit('basket:open'));
  }

  set counter(value: string) {
    this.setText(this.basketCounter, value)
  }
}