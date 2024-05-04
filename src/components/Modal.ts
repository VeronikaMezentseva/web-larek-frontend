import { IModal } from "../types";

export class Modal implements IModal {
  closeBtnElement: HTMLButtonElement;
  _content: HTMLElement;
  modalContainer: HTMLElement;
  rootContainer: HTMLElement;
  pageWrapper: HTMLElement;

  constructor(container: HTMLElement) {
    this.modalContainer = container;
    this._content = container.querySelector('.modal__content');
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
    this._content.replaceChildren(value);
  }
}