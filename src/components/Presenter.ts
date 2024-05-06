import { Card, CardModel } from "./Card";
import { UserOptions } from "./UserOptionsModel";
import { IViewCard, CardModelList, IModal, IBasket, IBasketItem, IBasketPage,
  IFormAddress, IFormContacts, ISuccsess, IUserOption} from "../types";
import { API_URL } from "../utils/constants";
import { Api } from "./base/api";
import { Modal } from "./Modal";
import { Basket, BasketItem, BasketPage } from "./Basket";
import { FormAddress, FormContacts, Succsess } from "./Form";
import { EventEmitter, EmitterEvent } from "./base/events";
import { State } from "./State";


export class Presenter {
  eventEmitter: EventEmitter;
  state: State;

  cardTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  basketItemTemplate: HTMLTemplateElement;
  succsessTemplate: HTMLTemplateElement;
  contactsTemplate: HTMLTemplateElement;
  formTemplate: HTMLTemplateElement;

  modal: IModal;
  form: IFormAddress;
  formContacts: IFormContacts;
  succsess: ISuccsess;
  userOptions: IUserOption;

  cardPreviewElement: IViewCard;
  basketPage: IBasketPage;
  basketItemElement: IBasketItem;
  basketElement: IBasket;

  contentContainer: HTMLElement;
  modalContainer: HTMLElement;

  constructor(state: State) {
    this.state = state;
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.on('basket:cardAdded', (evt) => {
      const data = (evt as EmitterEvent).data;
      this.addCardToBasket(data as CardModel);
      this.modal.closeModal();
    })

    this.eventEmitter.on('card:open', (evt) => {
      const data = (evt as EmitterEvent).data;
      this.openCard(data as CardModel);
    });

    this.eventEmitter.on('basket:open', () => this.openBasket());
    this.eventEmitter.on('basket:itemDelete', (evt) => {
      const data = (evt as EmitterEvent).data;
      this.deleteItem(data as IBasketItem);
    });
    this.eventEmitter.on('submit:order', () => this.openForm());

    this.eventEmitter.on('user:onlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.eventEmitter.on('user:offlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.eventEmitter.on('user:inputAddres', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleInputAddress(data));
    this.eventEmitter.on('user:submitForm', () => this.submitAddressForm());
    this.eventEmitter.on('user:emailInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleEmailInput(data));
    this.eventEmitter.on('user:phoneInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handlePhoneInput(data));
    this.eventEmitter.on('user:contactsFormSubmit', () => this.openSuccsess());
    this.eventEmitter.on('succsess:close', () => this.modal.closeModal());

    this.cardTemplate = document.querySelector('#card-catalog');
    this.cardPreviewTemplate = document.querySelector('#card-preview');
    this.basketTemplate = document.querySelector('#basket');
    this.basketItemTemplate = document.querySelector('#card-basket');
    this.succsessTemplate = document.querySelector('#success');
    this.contactsTemplate = document.querySelector('#contacts');
    this.formTemplate = document.querySelector('#order');
    this.modalContainer = document.querySelector('#modal-container');
    this.contentContainer = document.querySelector('.gallery');
    
    this.basketPage = new BasketPage(this.eventEmitter);
    this.basketElement = new Basket(this.basketTemplate, this.eventEmitter);
    this.userOptions = new UserOptions();
    this.modal = new Modal(this.modalContainer);
    this.form = new FormAddress(this.formTemplate, this.eventEmitter);
    this.formContacts = new FormContacts(this.contactsTemplate, this.eventEmitter);
    this.succsess = new Succsess(this.succsessTemplate, this.eventEmitter);
  }

  init() {
    const api = new Api(API_URL);
    api.get('/product')
      .then((data: CardModelList) => {
        return data.items;
      })
      .then((cards: CardModel[]) => {
        cards.forEach((card: CardModel) => {
          this.state.loadedCards.push(card);
          const cardElement = new Card(this.cardTemplate, card, this.eventEmitter);
          const cardItem = cardElement.render(card);
          this.contentContainer.append(cardItem);
        })
      });
  }

  openCard(card: CardModel) {
    const cardView = new Card(this.cardPreviewTemplate, card, this.eventEmitter);
    if (this.state.isAlreadyAdded(card)) {
      cardView.cardAddButton.disabled = true;
    }
    this.modal.content = cardView.render(card);
    this.modal.openModal();
  }

  addCardToBasket(card: CardModel) {
    if (!this.state.isAlreadyAdded(card)) {
      this.state.addedCards.push(card);
    }
    this.basketPage.basketCounter = `${this.state.addedCards.length}`;
  }

  openBasket() {
    this.basketElement.disableButton(this.state.addedCards);
    this.basketElement.resetContent();
    this.state.addedCards.forEach((cardItem) => {
      const basketItem = new BasketItem(this.basketItemTemplate, this.eventEmitter);
        this.basketElement.content = basketItem.render(cardItem, this.state.addedCards);
      });
      this.basketElement.total = `${this.state.getTotalPrice()}`;
      this.modal.content = this.basketElement.render();
      this.modal.openModal();
  }

  deleteItem(basketItem: IBasketItem) {
    this.state.addedCards = this.state.addedCards.filter((item) => item.id !== basketItem.itemId);
    this.basketElement.total = `${this.state.getTotalPrice()}`;
    this.basketPage.basketCounter = `${this.state.addedCards.length}`;
    this.openBasket();
  }

  openForm() {
    this.modal.content = this.form.render();
  }

  handlePaymentOption(data: {value: HTMLElement, button: HTMLButtonElement}) {
    const paymentMethod = data.value.getAttribute('name');
    if (paymentMethod === 'card') {
      this.userOptions._paymentMethod = 'card';
    } else {
      this.userOptions._paymentMethod = 'cash';
    }
    this.toggleButtonForm(data.button);
  }

  handleInputAddress(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) {
    if (data.value.value === '') {
      data.value.setCustomValidity('Invalid empty input');
      data.error.textContent = 'Пожалуйста, введите адрес';
    } else {
      data.value.setCustomValidity('');
      data.error.textContent = '';
    }
    this.userOptions._addres = data.value.value;
    this.toggleButtonForm(data.button);
  }

  toggleButtonForm(button: HTMLButtonElement) {
    if (this.userOptions._addres !== '' && this.userOptions._paymentMethod !== null) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
  
  submitAddressForm() {
    this.modal.content = this.formContacts.render();
  }

  handleEmailInput(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) {
    if (data.value.value === '') {
      data.value.setCustomValidity('Invalid empty input');
      data.error.textContent = 'Пожалуйста, введите свою почту';
    } else {
      data.value.setCustomValidity('');
      data.error.textContent = '';
    }
    this.userOptions._email = data.value.value;
    this.toggleButtonFormContacts(data.button);
  }

  handlePhoneInput(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) {
    if (data.value.value === '') {
      data.value.setCustomValidity('Invalid empty input');
      data.error.textContent = 'Пожалуйста, введите свой номер телефона';
    } else {
      data.value.setCustomValidity('');
      data.error.textContent = '';
    }

    this.userOptions._phone = data.value.value;
    this.toggleButtonFormContacts(data.button);
  }

  toggleButtonFormContacts(button: HTMLButtonElement) {
    if (this.userOptions._email !== '' && this.userOptions._phone !== '') {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }

  openSuccsess() {
    this.postOrder();
    this.resetBasket();
    this.form.resetFields();
    this.modal.content = this.succsess.render();
    const textSuccsess = `Списано ${this.basketElement.basketTotalPrice.textContent}`;
    this.succsess.setDescription(textSuccsess);
  }

  resetBasket() {
    this.state.addedCards = [];
    this.modal.content = this.basketElement.render();
    this.basketPage.basketCounter = '0';
    this.userOptions.resetFields();
    this.formContacts.resetFields();
  }

  postOrder() {
    const addedCardsId: string[] = [];
    this.state.addedCards.forEach((card) => {
      addedCardsId.push(card.id);
    });
    const userOrder = {
      payment: this.userOptions._paymentMethod,
      email: this.userOptions._email,
      phone: this.userOptions._phone,
      address: this.userOptions._addres,
      total: this.state.getTotalPrice(),
      items: addedCardsId
    }
    const api = new Api(API_URL);
    api.post('/order', userOrder);
  }
}