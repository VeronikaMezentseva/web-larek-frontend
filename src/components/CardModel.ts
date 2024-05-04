enum CardCategory {
  SOFT_SKILL = 'софт-скил',
  OTHER = 'другое',
  EXTRA = 'дополнительное',
  BUTTON = 'кнопка',
  HARD_SKILL = 'хард-скил'
}

export class CardModel {
 
  constructor( public id: string,
    public description: string,
    public image: string,
    public title: string,
    public category: CardCategory,
    public price: number | null) {

  }
}