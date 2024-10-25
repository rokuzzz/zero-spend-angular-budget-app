import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../models/transaction.model';
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

  addTransaction(transaction: Transaction): boolean {
    const currentBalance = this.calculateBalance();

    if (transaction.type === 'expense' && transaction.amount > currentBalance) {
      this.toastr.error('Insufficient balance for this transaction', 'Error');
      return false;
    }

    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = [transaction, ...currentTransactions];
    this.saveTransactions(updatedTransactions);

    this.toastr.success('Transaction added successfully', 'Success');
    return true;
  }

  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  calculateBalance(): number {
    return this.transactionsSubject.value.reduce((acc, curr) => {
      const amount = curr.type === 'income' ? curr.amount : -curr.amount;
      return acc + amount;
    }, 0);
  }
}
