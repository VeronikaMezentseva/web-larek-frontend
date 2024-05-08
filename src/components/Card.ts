import { CardModel } from './CardModel';
import { IViewCard } from '../types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';
import { Component } from './base/component';

export class Card extends Component<Card> implements IViewCard {

  cardSource: CardModel;
  eventEmitter: EventEmitter;
  gallery: HTMLElement;
  cardElement: HTMLElement;
  cardButton?: HTMLButtonElement;
  cardCategory: HTMLElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;

  constructor(container: HTMLElement, card: CardModel, eventEmitter: EventEmitter) {
    super(container);
    this.cardSource = card;
    this.eventEmitter = eventEmitter;
    this.gallery = document.querySelector('.gallery');
    this.cardElement = container;
    this.cardCategory = this.cardElement.querySelector('.card__category');
    this.cardTitle = this.cardElement.querySelector('.card__title');
    this.cardImage = this.cardElement.querySelector('.card__image');
    this.cardPrice = this.cardElement.querySelector('.card__price');
    if (this.cardElement.querySelector('.card__text')) {
      this.cardDescription = this.cardElement.querySelector('.card__text');
    }
    if (this.cardElement.querySelector('.card__button')) {
      this.cardAddButton = this.cardElement.querySelector('.card__button');
      this.cardAddButton.addEventListener('click', () => this.eventEmitter.emit('basket:cardAdded', {data: this.cardSource}));
      this.cardAddButton.addEventListener('click', () => this.eventEmitter.emit('basket:changed', {data: this.cardSource}));
    }
    if (this.cardElement.querySelector('.gallery__item')) {
      this.cardButton = this.cardElement.querySelector('.gallery__item');
      this.cardButton.addEventListener('click', () => this.eventEmitter.emit('card:open', {data: this.cardSource}));
    }
  }

  appendCard(card: HTMLElement) {
    this.gallery.append(card);
  }

  set title(value: string) {
    this.setText(this.cardTitle, value);
  }

  set image(value: string) {
    this.setImage(this.cardImage, `${CDN_URL + value}`);
  }

  set category(value: string) {
    this.setText(this.cardCategory, value);
    switch(value) {
      case 'софт-скил': this.cardCategory.classList.add('card__category_soft');
        break;
      case 'другое': this.cardCategory.classList.add('card__category_other');
        break;
      case 'дополнительное': this.cardCategory.classList.add('card__category_additional');
        break;
      case 'кнопка': this.cardCategory.classList.add('card__category_button');
        break;
      case 'хард-скил': this.cardCategory.classList.add('card__category_hard');
        break;      
    }
  }

  set description(value: string) {
    this.setText(this.cardDescription, value);
  }

  set price(value: number) {
    if (value === null) {
      this.setText(this.cardPrice, 'Бесценно');
    } else {
      this.setText(this.cardPrice, `${value} синапсов`);
    }

    if (value === null && this.cardAddButton) {
      this.setDisabled(this.cardAddButton, true);
      this.setText(this.cardAddButton, 'Товар нельзя купить');
    }
  }
}