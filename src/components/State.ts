import { CardModel } from "./CardModel";

export class State {
  loadedCards: CardModel[];
  addedCards: CardModel[];
  totalPrice: number;

  constructor() {
    this.loadedCards = [];
    this.addedCards = [];
    this.totalPrice = 0;
  }

  isAlreadyAdded(card: CardModel) {
    let isAlreadyAdded;
    this.addedCards.forEach((item) => {
      if (card.id === item.id) {
        isAlreadyAdded = true;
      } else {
        isAlreadyAdded = false;
      }
    });
    return isAlreadyAdded;
  }

  getTotalPrice() {
    this.totalPrice = 0;
    this.addedCards.forEach((card) => {
      this.totalPrice = this.totalPrice + card.price;
    })
    return this.totalPrice;
  }
}