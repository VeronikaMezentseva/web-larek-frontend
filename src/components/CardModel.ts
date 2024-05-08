export class CardModel {
 
  constructor( public id: string,
    public description: string,
    public image: string,
    public title: string,
    public category: string,
    public price: number | null) {

  }
}