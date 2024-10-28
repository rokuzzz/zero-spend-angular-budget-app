import { Component, OnInit } from '@angular/core';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionService } from 'src/app/services/transaction.service';
import { CommonModule } from '@angular/common';
import { TransactionHistoryComponent } from '../../components/transaction-history/transaction-history.component';
import { TransactionCardComponent } from '../../components/transaction-card/transaction-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TransactionHistoryComponent,
    TransactionCardComponent,
  ],
})
export class HomeComponent implements OnInit {
  TransactionType = TransactionType;
  currentBalance = 0;
  savingsAmount = 0;
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe((transactions) => {
      this.transactions = transactions;
      this.currentBalance = this.transactionService.calculateBalance();
      this.savingsAmount = this.transactionService.calculateSavings();
    });
  }

  handleAddTransaction(transaction: Transaction) {
    this.transactionService.addTransaction(transaction);
  }
}
