import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TransactionType, Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction-card',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
  ],
  templateUrl: './transaction-card.component.html',
})
export class TransactionCardComponent implements OnInit {
  @Input() transactionType!: TransactionType;
  @Output() onTransactionAdded = new EventEmitter<Transaction>();
  TransactionType = TransactionType;

  form = this._formBuilder.group({
    amount: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d*\.?\d{0,2}$/),
      ],
    ],
    title: [null], 
    action: ['add', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit() {
    if (this.transactionType !== TransactionType.SAVINGS) {
      this.form
        .get('title')
        ?.setValidators([
          Validators.required,
          Validators.pattern(/^(?!\s*$).+/),
        ]);
    } else {
      this.form.get('title')?.clearValidators();
    }
    this.form.get('title')?.updateValueAndValidity();
  }

  getCardTitle(): string {
    switch (this.transactionType) {
      case TransactionType.INCOME:
        return 'Add Income';
      case TransactionType.EXPENSE:
        return 'Add Expense';
      case TransactionType.SAVINGS:
        return 'Modify Savings';
      default:
        return '';
    }
  }

  getCardColor(): string {
    switch (this.transactionType) {
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

  getPlaceholder(): string {
    switch (this.transactionType) {
      case TransactionType.INCOME:
        return 'e.g., Salary, Gift';
      case TransactionType.EXPENSE:
        return 'e.g., Rent, Food';
      case TransactionType.SAVINGS:
        return ''; // No placeholder needed
      default:
        return '';
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const amount = this.form.get('amount')?.value;
    const title = this.form.get('title')?.value;
    const action = this.form.get('action')?.value;

    if (!amount) {
      return;
    }

    const transaction: Transaction = {
      amount: Number(amount) * (action === 'withdraw' ? -1 : 1),
      title: title ? (title as string).trim() : undefined,
      type: this.transactionType,
      date: new Date(),
    };

    this.onTransactionAdded.emit(transaction);

    this.form.reset({
      amount: null,
      title: null,
      action: 'add',
    });
  }

  getErrorMessage(fieldName: 'amount' | 'title'): string {
    const control = this.form.get(fieldName);

    if (!control) return '';

    if (control.hasError('required')) {
      return `${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } is required`;
    }

    if (fieldName === 'amount') {
      if (control.hasError('min')) {
        return 'Amount must be greater than 0';
      }
      if (control.hasError('pattern')) {
        return 'Invalid amount';
      }
    }

    if (fieldName === 'title' && control.hasError('pattern')) {
      return 'Title cannot be empty';
    }

    return '';
  }
}
