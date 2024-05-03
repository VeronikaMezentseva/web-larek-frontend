export interface IAppState {
  modalOpen: boolean;
}

export class AppState implements IAppState {
  modalOpen: boolean;

  constructor() {
    this.modalOpen = false;
  }
}