import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { Transaction, TransactionType } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule],
  templateUrl: './transaction-history.component.html',
})
export class TransactionHistoryComponent implements OnInit {
  displayedColumns: string[] = ['date', 'title', 'type', 'amount'];
  transactions: Transaction[] = [];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.transactionService.transactions$.subscribe(
      (transactions) => (this.transactions = transactions)
    );
  }

  getTransactionColor(type: TransactionType): string {
    switch (type) {
      case TransactionType.INCOME:
        return 'text-green-600';
      case TransactionType.EXPENSE:
        return 'text-red-600';
      case TransactionType.SAVINGS:
        return 'text-purple-600';
      default:
        return '';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}
