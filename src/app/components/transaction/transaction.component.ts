import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Transaction, TransactionType } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css'],
})
export class TransactionComponent {
  @Input() transactionType: TransactionType = TransactionType.INCOME;
  @Output() onTransactionAdded = new EventEmitter<Transaction>();

  TransactionType = TransactionType;

  addTransaction(amount: string, title: string) {
    const newTransaction: Transaction = {
      amount: parseFloat(amount),
      title,
      type: this.transactionType,
      date: new Date(),
    };

    this.onTransactionAdded.emit(newTransaction);
  }
}
