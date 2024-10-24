import { Component } from '@angular/core';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  currentBalance: number = 0;
  savingAmount: number = 0;
  TransactionType = TransactionType;

  handleAddTransaction(transaction: Transaction) {
    if (transaction.type === TransactionType.INCOME) {
      this.currentBalance += transaction.amount;
    } else {
      this.currentBalance -= transaction.amount;
    }
  }

  handleTransferToSaving(amount: number) {
    if (amount <= this.currentBalance) {
      this.currentBalance -= amount;
      this.savingAmount += amount;
    }
  }

  handleTransferToBalance(amount: number) {
    if (amount <= this.savingAmount) {
      this.savingAmount -= amount;
      this.currentBalance += amount;
    }
  }
}
