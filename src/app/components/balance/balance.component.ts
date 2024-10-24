import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
})
export class BalanceComponent {
  @Input() currentBalance: number = 0;
  @Output() onTransferToSaving = new EventEmitter<number>();

  transferToSavings(amount: number) {
    if (amount <= this.currentBalance) {
      this.onTransferToSaving.emit(amount);
    }
  }
}
