import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  SavingsGoal,
  Transaction,
  TransactionType,
} from '../models/transaction.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';
  private readonly SAVINGS_GOAL_KEY = 'savings_goal';

  private transactionsSubject = new BehaviorSubject<Transaction[]>(
    this.loadTransactions()
  );
  private savingsGoalSubject = new BehaviorSubject<SavingsGoal | null>(
    this.loadSavingsGoal()
  );

  transactions$ = this.transactionsSubject.asObservable();
  savingsGoal$ = this.savingsGoalSubject.asObservable();

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
    const currentSavings = this.calculateSavings();

    // Check for both expense and savings transactions
    if (
      transaction.type === TransactionType.EXPENSE &&
      transaction.amount > currentBalance
    ) {
      this.toastr.error('Insufficient balance for this expense', 'Error');
      return false;
    }

    if (transaction.type === TransactionType.SAVINGS) {
      if (transaction.amount > 0 && transaction.amount > currentBalance) {
        // Adding to savings but not enough balance
        this.toastr.error('Insufficient balance to add to savings', 'Error');
        return false;
      } else if (
        transaction.amount < 0 &&
        Math.abs(transaction.amount) > currentSavings
      ) {
        // Withdrawing from savings but not enough savings
        this.toastr.error('Insufficient savings to withdraw', 'Error');
        return false;
      }
    }

    const currentTransactions = this.transactionsSubject.value;
    const updatedTransactions = [transaction, ...currentTransactions];
    this.saveTransactions(updatedTransactions);

    this.toastr.success(
      transaction.type === TransactionType.SAVINGS
        ? 'Savings updated successfully'
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

  private loadSavingsGoal(): SavingsGoal | null {
    const stored = localStorage.getItem(this.SAVINGS_GOAL_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  setSavingsGoal(amount: number) {
    const goal: SavingsGoal = {
      amount,
      date: new Date(),
    };
    localStorage.setItem(this.SAVINGS_GOAL_KEY, JSON.stringify(goal));
    this.savingsGoalSubject.next(goal);
    this.toastr.success('Savings target updated', 'Success'); // Updated message
  }

  calculateSavingsProgress(): number {
    const goal = this.savingsGoalSubject.value;
    const currentSavings = this.calculateSavings();

    if (!goal || goal.amount === 0) return 0;
    return (currentSavings / goal.amount) * 100;
  }
}
