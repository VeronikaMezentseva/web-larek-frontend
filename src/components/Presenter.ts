import { Card } from "./Card";
import { CardModel } from './CardModel';
import { UserOptions } from "./UserOptionsModel";
import { IViewCard, CardModelList, IModal, IBasket, IBasketItem, IBasketPage,
  IFormAddress, IFormContacts, ISuccsess, IUserOption} from "../types";
import { API_URL } from "../utils/constants";
import { Api } from "./base/api";
import { Modal } from "./Modal";
import { Basket, BasketItem, BasketPage } from "./Basket";
import { FormAddress, FormContacts } from "./Form";
import { Succsess } from "./Succsess";
import { EventEmitter, EmitterEvent } from "./base/events";
import { CardsState } from "./CardsState";


export class Presenter {
  eventEmitter: EventEmitter;
  state: CardsState;
  api: Api;

  cardTemplate: HTMLTemplateElement;
  cardPreviewTemplate: HTMLTemplateElement;
  basketTemplate: HTMLTemplateElement;
  basketItemTemplate: HTMLTemplateElement;
  succsessTemplate: HTMLTemplateElement;
  contactsTemplate: HTMLTemplateElement;
  formTemplate: HTMLTemplateElement;

  modal: IModal;
  form: IFormAddress<FormAddress>;
  formContacts: IFormContacts<FormContacts>;
  succsess: ISuccsess<Succsess>;
  userOptions: IUserOption;
  cardPreviewElement: IViewCard;
  basketPage: IBasketPage<BasketPage>;
  basketItemElement: IBasketItem<BasketItem>;
  basketElement: IBasket<Basket>;

  modalContainer: HTMLElement;

  constructor(state: CardsState) {
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

    this.eventEmitter.on('basket:changed', () => {
      this.renderItems();
    });

    this.eventEmitter.on('basket:open', () => this.openBasket());
    this.eventEmitter.on('basket:itemDelete', (evt) => {
      const data = (evt as EmitterEvent).data;
      this.deleteItem(data as IBasketItem<BasketItem>);
    });
    this.eventEmitter.on('submit:order', () => this.openForm());

    this.eventEmitter.on('user:onlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.eventEmitter.on('user:offlineSelected', (data: {value: HTMLElement, button: HTMLButtonElement}) => this.handlePaymentOption(data));
    this.eventEmitter.on('user:inputAddres', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleInputAddress(data));
    this.eventEmitter.on('user:submitForm', () => this.submitAddressForm());
    this.eventEmitter.on('user:emailInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handleEmailInput(data));
    this.eventEmitter.on('user:phoneInput', (data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) => this.handlePhoneInput(data));
    this.eventEmitter.on('user:contactsFormSubmit', () => this.postOrder());
    this.eventEmitter.on('succsess:close', () => this.modal.closeModal());

    this.cardTemplate = document.querySelector('#card-catalog');
    this.cardPreviewTemplate = document.querySelector('#card-preview');
    this.basketTemplate = document.querySelector('#basket');
    this.basketItemTemplate = document.querySelector('#card-basket');
    this.succsessTemplate = document.querySelector('#success');
    this.contactsTemplate = document.querySelector('#contacts');
    this.formTemplate = document.querySelector('#order');
    this.modalContainer = document.querySelector('#modal-container');
    
    this.api = new Api(API_URL);
    this.basketPage = new BasketPage(document.querySelector('.header__basket-counter'), this.eventEmitter);
    this.basketElement = new Basket(this.basketTemplate.content.querySelector('.basket').cloneNode(true) as HTMLElement, this.eventEmitter);
    this.userOptions = new UserOptions();
    this.modal = new Modal(this.modalContainer);
    this.form = new FormAddress(this.formTemplate.content.querySelector('.form').cloneNode(true) as HTMLFormElement, this.eventEmitter);
    this.formContacts = new FormContacts(this.contactsTemplate.content.querySelector('.form').cloneNode(true) as HTMLFormElement, this.eventEmitter);
    this.succsess = new Succsess(this.succsessTemplate.content.querySelector('.order-success').cloneNode(true) as HTMLFormElement, this.eventEmitter);
  }

  init() {
    this.api.get('/product')
      .then((data: CardModelList) => {
        return data.items;
      })
      .then((cards: CardModel[]) => {
        cards.forEach((card: CardModel) => {
          this.state.loadedCards.push(card);
          const cardElement = new Card(this.cardTemplate.content.cloneNode(true) as HTMLElement, card, this.eventEmitter);
          const cardItem = cardElement.render({
            title: card.title,
            image: card.image,
            category: card.category,
            price: card.price
          });
          cardElement.appendCard(cardItem);
        })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  openCard(card: CardModel) {
    const cardView = new Card(this.cardPreviewTemplate.content.cloneNode(true) as HTMLElement, card, this.eventEmitter);
    if (this.state.isAlreadyAdded(card.id)) {
      cardView.setDisabled(cardView.cardAddButton, true);
    }
    this.modal.content = cardView.render({
      title: card.title,
      image: card.image,
      category: card.category,
      price: card.price,
      description: card.description
    });
    this.modal.openModal();
  }

  addCardToBasket(card: CardModel) {
    if (!this.state.isAlreadyAdded(card.id)) {
      this.state.addedCards.push(card);
    }
    this.basketPage.counter = `${this.state.addedCards.length}`;
  }
  
  renderItems() {
    this.basketElement.disableButton(this.state.addedCards);
    this.basketElement.resetContent();
    this.state.addedCards.forEach((cardItem) => {
      const basketItem = new BasketItem(this.basketItemTemplate.content.cloneNode(true) as HTMLElement, this.eventEmitter);
        this.basketElement.content = basketItem.render({
          id: cardItem.id,
          title: cardItem.title,
          price: cardItem.price,
          index: this.state.addedCards.indexOf(cardItem)
        });
      });
      this.basketElement.total = `${this.state.getTotalPrice()}`;
      this.modal.content = this.basketElement.render({});
  }

  openBasket() {
    this.renderItems();
    this.modal.openModal();
  }


  deleteItem(basketItem: IBasketItem<BasketItem>) {
    this.state.addedCards = this.state.addedCards.filter((item) => item.id !== basketItem.itemId);
    this.basketElement.total = `${this.state.getTotalPrice()}`;
    this.basketPage.counter = `${this.state.addedCards.length}`;
  }

  openForm() {
    this.modal.content = this.form.render({});
  }

  handlePaymentOption(data: {value: HTMLElement, button: HTMLButtonElement}) {
    const paymentMethod = data.value.getAttribute('name');
    if (paymentMethod === 'card') {
      this.userOptions.paymentMethod = 'card';
    } else {
      this.userOptions.paymentMethod = 'cash';
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
    this.userOptions.address = data.value.value;
    this.toggleButtonForm(data.button);
  }

  toggleButtonForm(button: HTMLButtonElement) {
    if (this.userOptions.userAddress !== '' && this.userOptions.userPaymentMethod !== null) {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }
  
  submitAddressForm() {
    this.modal.content = this.formContacts.render({});
  }

  handleEmailInput(data: {value: HTMLInputElement, button: HTMLButtonElement, error: HTMLElement}) {
    if (data.value.value === '') {
      data.value.setCustomValidity('Invalid empty input');
      data.error.textContent = 'Пожалуйста, введите свою почту';
    } else {
      data.value.setCustomValidity('');
      data.error.textContent = '';
    }
    this.userOptions.email = data.value.value;
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

    this.userOptions.phone = data.value.value;
    this.toggleButtonFormContacts(data.button);
  }

  toggleButtonFormContacts(button: HTMLButtonElement) {
    if (this.userOptions.userEmail !== '' && this.userOptions.userPhone !== '') {
      button.disabled = false;
    } else {
      button.disabled = true;
    }
  }

  openSuccsess() {
    this.resetBasket();
    this.form.resetFields();
    this.modal.content = this.succsess.render({});
    const textSuccsess = this.basketElement.basketTotalPrice.textContent;
    this.succsess.setDescription(textSuccsess);
  }

  resetBasket() {
    this.state.addedCards = [];
    this.modal.content = this.basketElement.render({});
    this.basketPage.counter = `${this.state.addedCards.length}`;
    this.userOptions.resetFields();
    this.formContacts.resetFields();
  }

  postOrder() {
    const addedCardsId: string[] = [];
    this.state.addedCards.forEach((card) => {
      addedCardsId.push(card.id);
    });
    const userOrder = {
      payment: this.userOptions.userPaymentMethod,
      email: this.userOptions.userEmail,
      phone: this.userOptions.userPhone,
      address: this.userOptions.userAddress,
      total: this.state.getTotalPrice(),
      items: addedCardsId
    };
    this.api.post('/order', userOrder)
    .then(() => this.openSuccsess())
    .catch((err) => {
      console.log(err);
    });
  }
}