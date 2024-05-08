import { IUserOption } from "../types";

export class UserOptions implements IUserOption {
  userPaymentMethod: 'card' | 'cash' | null;
  userAddress: string;
  userEmail: string;
  userPhone: string;

  constructor() {
    this.paymentMethod = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  };

  set paymentMethod(value: 'card' | 'cash' | null) {
    this.userPaymentMethod = value;
  }

  set address(value: string) {
    this.userAddress = value;
  }

  set email(value: string) {
    this.userEmail = value;
  }

  set phone(value: string) {
    this.userPhone = value;
  }

  resetFields() {
    this.userPaymentMethod = null;
    this.userAddress = '';
    this.userEmail = '';
    this.userPhone = '';
  }
}