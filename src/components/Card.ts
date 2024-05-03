import { CDN_URL } from '../utils/constants';
import { EventEmitter } from './base/events';

export interface cardList {
  items: card[];
}

export type card = {
  id: string;
  description: string;
  image: string;
  title: string;
  category: CardCategory;
  price: number | null;
}

export interface IViewCard extends EventEmitter {
  cardElement: HTMLElement;
  cardCategory: HTMLElement;
  cardButton?: HTMLButtonElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  render(card: card): HTMLElement;
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;
}

export class Card extends EventEmitter implements IViewCard {

  cardElement: HTMLElement;
  cardButton?: HTMLButtonElement;
  cardCategory: HTMLElement;
  cardTitle: HTMLElement;
  cardImage: HTMLImageElement;
  cardPrice: HTMLElement;
  cardDescription?: HTMLElement;
  cardAddButton?: HTMLButtonElement;

  constructor(template: HTMLTemplateElement) {
    super();
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
      this.cardAddButton.addEventListener('click', () => this.emit('basket:cardAdded'));
    }
    if (this.cardElement.querySelector('.gallery__item')) {
      this.cardButton = this.cardElement.querySelector('.gallery__item');
      this.cardButton.addEventListener('click', () => this.emit('card:open'));
    }
    
  }

  render(card: card) {
    this.cardCategory.textContent = card.category;
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
    return this.cardElement;
  }
}

enum CardCategory {
  SOFT_SKILL = 'софт-скил',
  OTHER = 'другое',
  EXTRA = 'дополнительное',
  BUTTON = 'кнопка',
  HARD_SKILL = 'хард-скил'
}