import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TransactionType, Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './transaction.component.html',
})
export class TransactionComponent {
  @Input() transactionType!: TransactionType;
  @Output() onTransactionAdded = new EventEmitter<Transaction>();

  form = this._formBuilder.group({
    amount: [
      null,
      [
        Validators.required,
        Validators.min(0.01),
        Validators.pattern(/^\d*\.?\d{0,2}$/),
      ],
    ],
    title: [null, [Validators.required, Validators.pattern(/^(?!\s*$).+/)]],
  });

  constructor(private _formBuilder: FormBuilder) {}

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
     
    if (!amount || typeof title !== 'string') {
      return;
    }

    const transaction: Transaction = {
      amount: Number(amount),
      title: (title as string).trim(),
      type: this.transactionType,
      date: new Date(),
    };

    this.onTransactionAdded.emit(transaction);

    this.form.reset({
      amount: null,
      title: null,
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
