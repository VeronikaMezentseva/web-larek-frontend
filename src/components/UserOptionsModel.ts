import { IUserOption } from "../types";

export class UserOptions implements IUserOption {
  _paymentMethod: 'card' | 'cash' | null;
  _addres: string;
  _email: string;
  _phone: string;

  constructor() {
    this._paymentMethod = null;
    this._addres = '';
    this._email = '';
    this._phone = '';
  };

  set paymentMethod(value: 'card' | 'cash' | null) {
    this._paymentMethod = value;
  }

  set address(value: string) {
    this._addres = value;
  }

  set email(value: string) {
    this._email = value;
  }

  set phone(value: string) {
    this._phone = value;
  }

  resetFields() {
    this._paymentMethod = null;
    this._addres = '';
    this._email = '';
    this._phone = '';
  }
}