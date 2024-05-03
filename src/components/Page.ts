export interface IPage {
  page: HTMLElement;
  pageWrapper: HTMLElement;
  lockPage(): void;
  unlockPage(): void;
}

export class Page implements IPage {
  page: HTMLElement;
  pageWrapper: HTMLElement;

  constructor() {
    this.page = document.querySelector('.page');
    this.pageWrapper = this.page.querySelector('.page__wrapper');
  }

  lockPage() {
    this.pageWrapper.classList.add('page__wrapper_locked');
  }

  unlockPage() {
    this.pageWrapper.classList.remove('page__wrapper_locked');
  }
}