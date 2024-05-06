import { CardModel } from './CardModel';
import { IViewCard } from '../types';
import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';

export class Card implements IViewCard {

  cardSource: CardModel;
  eventEmitter: EventEmitter;
  cardElement: HTMLElement;
  cardButton?: HTMLButtonElement;
  cardCategory: HTMLElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;

  constructor(template: HTMLTemplateElement, card: CardModel, eventEmitter: EventEmitter) {
    this.cardSource = card;
    this.eventEmitter = eventEmitter;
    this.cardElement = template.content.cloneNode(true) as HTMLElement;
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
    }
    if (this.cardElement.querySelector('.gallery__item')) {
      this.cardButton = this.cardElement.querySelector('.gallery__item');
      this.cardButton.addEventListener('click', () => this.eventEmitter.emit('card:open', {data: this.cardSource}));
    }
    this.render(this.cardSource);
  }

  render(card: CardModel) {
    this.cardCategory.textContent = card.category;
    this.cardCategory.classList.remove('card__category_soft');
    switch(card.category) {
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
    this.cardTitle.textContent = card.title;
    this.cardImage.src = `${CDN_URL + card.image}`;
    if (this.cardDescription) {
      this.cardDescription.textContent = card.description;
    }
    if (card.price === null) {
      this.cardPrice.textContent = `Бесценно`;
    } else {
      this.cardPrice.textContent = `${card.price} синапсов`;
    }
    if (this.cardAddButton && card.price === null) {
      this.cardAddButton.disabled = true;
      this.cardAddButton.textContent = 'Товар нельзя купить';
    }
    return this.cardElement;
  }
}

export { CardModel };
