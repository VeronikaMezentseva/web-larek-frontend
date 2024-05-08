import { CardModel } from "./CardModel";

export class CardsState {
  loadedCards: CardModel[];
  addedCards: CardModel[];
  totalPrice: number;

  constructor() {
    this.loadedCards = [];
    this.addedCards = [];
    this.totalPrice = 0;
  }

  isAlreadyAdded(cardId: string) {
    let isAlreadyAdded = false;
    for (let i = 0; i < this.addedCards.length; i++) {
      if (this.addedCards[i].id === cardId) {
        isAlreadyAdded = true;
        break;
      }
    }
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