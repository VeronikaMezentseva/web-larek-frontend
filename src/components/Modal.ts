import { IModal } from "../types";
import { Component } from "./base/component";

export class Modal extends Component<Modal> implements IModal {
  closeBtnElement: HTMLButtonElement;
  modalContent: HTMLElement;
  modalContainer: HTMLElement;
  rootContainer: HTMLElement;
  pageWrapper: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.modalContainer = container;
    this.modalContent = container.querySelector('.modal__content');
    this.closeBtnElement = container.querySelector('.modal__close');
    this.pageWrapper = document.querySelector('.page__wrapper');
    this.rootContainer = document.querySelector('.modal__container');
    this.rootContainer.addEventListener('click', (evt) => evt.stopPropagation());

    this.closeBtnElement.addEventListener('click', this.closeModal.bind(this));
    this.modalContainer.addEventListener('click', () => this.closeModal());
  };

  closeModal() {
    this.pageWrapper.classList.remove('page__wrapper_locked');
    this.modalContainer.classList.remove('modal_active');
 }

  openModal() {
    this.pageWrapper.classList.add('page__wrapper_locked');
    this.modalContainer.classList.add('modal_active');
  }

  set content(value: HTMLElement) {
    this.modalContent.replaceChildren(value);
  }
}