import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  TransactionType = TransactionType;
  currentBalance = 0;
  savingAmount = 0;
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(transactions => {
      this.transactions = transactions;
      this.currentBalance = this.transactionService.calculateBalance();
    });
  }

  handleAddTransaction(transaction: Transaction) {
    this.transactionService.addTransaction(transaction);
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
