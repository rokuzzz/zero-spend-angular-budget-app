import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction, TransactionType } from '../models/transaction.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';
  private transactionsSubject = new BehaviorSubject<Transaction[]>(
    this.loadTransactions()
  );

  transactions$ = this.transactionsSubject.asObservable();

  constructor(private toastr: ToastrService) {}

  private loadTransactions(): Transaction[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return [];

    try {
      const transactions = JSON.parse(stored);
      return transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));
    } catch (e) {
      console.error('Error loading transactions:', e);
      return [];
    }
  }

  private saveTransactions(transactions: Transaction[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    this.transactionsSubject.next(transactions);
  }

  // transaction.service.ts
  addTransaction(transaction: Transaction): boolean {
    const currentBalance = this.calculateBalance();

    // Check for both expense and savings transactions
    if (
      (transaction.type === TransactionType.EXPENSE ||
        transaction.type === TransactionType.SAVINGS) &&
      transaction.amount > currentBalance
    ) {
      this.toastr.error(
        transaction.type === TransactionType.SAVINGS
          ? 'Insufficient balance to add to savings'
          : 'Insufficient balance for this expense',
        'Error'
      );
      return false;
    }

    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = [transaction, ...currentTransactions];
    this.saveTransactions(updatedTransactions);

    this.toastr.success(
      transaction.type === TransactionType.SAVINGS
        ? 'Added to savings successfully'
        : 'Transaction added successfully',
      'Success'
    );
    return true;
  }

  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  calculateSavings(): number {
    return this.transactionsSubject.value.reduce((acc, curr) => {
      return curr.type === TransactionType.SAVINGS ? acc + curr.amount : acc;
    }, 0);
  }

  calculateBalance(): number {
    return this.transactionsSubject.value.reduce((acc, curr) => {
      if (curr.type === TransactionType.INCOME) return acc + curr.amount;
      if (
        curr.type === TransactionType.EXPENSE ||
        curr.type === TransactionType.SAVINGS
      )
        return acc - curr.amount;
      return acc;
    }, 0);
  }
}
