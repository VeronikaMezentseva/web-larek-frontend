import { Card, IViewCard, card, cardList } from "./Card";
import { API_URL } from "../utils/constants";
import { Api, IApi } from "./base/api";
import { IModal, Modal } from "./Modal";
import { Basket, BasketItem, BasketPage, IBasket, IBasketItem, IBasketPage } from "./Basket";
import { Form, FormContacts, IForm, IFormContacts, ISuccsess, IUserOption, Succsess, UserOptions } from "./Form";
import { IPage, Page } from "./Page";
import { AppState, IAppState } from "./AppState";


export class CardPresenter {
  cardTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  basketItemTemplate: HTMLTemplateElement;
  succsessTemplate: HTMLTemplateElement;
  contactsTemplate: HTMLTemplateElement;
  formTemplate: HTMLTemplateElement;

  page: IPage;
  modal: IModal;
  form: IForm;
  formContacts: IFormContacts;
  succsess: ISuccsess;
  userOptions: IUserOption;

  cardElement: IViewCard;
  cardPreviewElement: IViewCard;
  basketPage: IBasketPage;
  basketItemElement: IBasketItem;
  basketElement: IBasket;

  succsessElement: HTMLElement;
  contactsElement: HTMLElement;
  formElement: HTMLElement;

  contentContainer: HTMLElement;
  modalContainer: HTMLElement;

  appState: IAppState;
  cardList: card[];
  addedCardList: card[];

  basketButton: HTMLElement;
  basketCounter: HTMLElement;

  constructor() {
    this.cardTemplate = document.querySelector('#card-catalog');
    this.cardPreviewTemplate = document.querySelector('#card-preview');
    this.basketTemplate = document.querySelector('#basket');
    this.basketItemTemplate = document.querySelector('#card-basket');
    this.succsessTemplate = document.querySelector('#success');
    this.contactsTemplate = document.querySelector('#contacts');
    this.formTemplate = document.querySelector('#order');

    this.contentContainer = document.querySelector('.gallery');
    this.modalContainer = document.querySelector('#modal-container');

    this.appState = new AppState();
    this.cardList = [];
    this.addedCardList = [];
  
    this.basketPage = new BasketPage();
    this.basketPage.on('basket:open', () => this.openBasket());
    this.basketButton = document.querySelector('.header__basket');
    this.basketCounter = document.querySelector('.header__basket-counter');
  }

  init() {
    this.page = new Page();
    this.modal = new Modal(this.modalContainer);
    this.userOptions = new UserOptions();

    const api = new Api(API_URL);
    api.get('/product')
      .then((data: cardList) => {
        return data.items;
      })
      .then((cards: card[]) => {
        cards.forEach((card: card) => {
          this.cardList.push(card);
          this.cardElement = new Card(this.cardTemplate);
          const cardItem = this.cardElement.render(card);
          this.contentContainer.append(cardItem);
          this.cardElement.on('card:open', () => {
            this.openCard(card);
          });
        })
      });
  }

  openCard(card: card) {
    this.cardPreviewElement = new Card(this.cardPreviewTemplate);
    this.cardPreviewElement.on('basket:cardAdded', () => this.addCardToBasket(card));
    this.modal.content = this.cardPreviewElement.render(card);
    this.modal.openModal();
  }

  addCardToBasket(card: card) {
    let alreadyAdded = false;
    this.addedCardList.forEach((item) => {
      if(item.id === card.id) {
        alreadyAdded = true;
      }
    });
    if (!alreadyAdded) {
      this.addedCardList.push(card);
    }
    this.basketCounter.textContent = `${this.addedCardList.length}`;
  }

  openBasket() {
    this.basketElement = new Basket(this.basketTemplate);
    this.basketElement.disableButton(this.addedCardList);
    this.basketElement.on('submit:order', () => this.openForm());
    if (this.addedCardList.length !== 0) {
      this.addedCardList.forEach((cardItem) => {
        const basketItem = new BasketItem(this.basketItemTemplate);
          basketItem.on('basket:itemDelete', () => this.deleteItem(basketItem));
          this.basketElement.content = basketItem.render(cardItem, this.addedCardList);
        });
        let totalPrice = 0;
        this.addedCardList.forEach((card) => {
          totalPrice = totalPrice + card.price;
        })
        this.basketElement.total = `${totalPrice}`;
    }
      this.modal.content = this.basketElement.render();
      this.modal.openModal();
  }

  deleteItem(basketItem: IBasketItem) {
    this.addedCardList = this.addedCardList.filter((item) => item.id !== basketItem.itemId);
    this.basketCounter.textContent = `${this.addedCardList.length}`;
    this.openBasket();
  }

  openForm() {
    this.form = new Form(this.formTemplate);
    this.modal.content = this.form.render();
    this.form.on('user:onlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.form.on('user:offlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.form.on('user:inputAddres', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleInputAddress(data));
    this.form.on('user:submitForm', () => this.submitAddressForm());
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
    console.log(button);
    if (this.userOptions._addres !== '' && this.userOptions._paymentMethod !== null) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
  
  submitAddressForm() {
    this.formContacts = new FormContacts(this.contactsTemplate);
    this.modal.content = this.formContacts.render();
    this.formContacts.on('user:emailInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleEmailInput(data));
    this.formContacts.on('user:phoneInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handlePhoneInput(data));
    this.formContacts.on('user:contactsFormSubmit', () => this.openSuccsess());
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
    this.succsess = new Succsess(this.succsessTemplate);
    this.succsess.on('succsess:close', () => this.modal.closeModal());
    this.modal.content = this.succsess.render();
    const textSuccsess = `Списано ${this.basketElement.basketTotalPrice.textContent}`;
    this.succsess.setDescription(textSuccsess);
  }

  resetBasket() {
    this.addedCardList = [];
    this.modal.content = this.basketElement.render();
    this.basketCounter.textContent = '0';
    this.userOptions.resetFields();
  }

  postOrder() {
    const addedCardsId: string[] = [];
    let total = 0;
    this.addedCardList.forEach((item) => {
      addedCardsId.push(item.id);
      total = total + item.price;
    })
    const userOrder = {
      payment: this.userOptions._paymentMethod,
      email: this.userOptions._email,
      phone: this.userOptions._phone,
      address: this.userOptions._addres,
      total: total,
      items: addedCardsId
    }
    console.log(userOrder);
    const api = new Api(API_URL);
    api.post('/order', userOrder);
  }
}