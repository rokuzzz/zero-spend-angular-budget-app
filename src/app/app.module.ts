import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { TransactionComponent } from './transaction/transaction.component';
import { BalanceComponent } from './balance/balance.component';
import { SavingComponent } from './saving/saving.component';

@NgModule({
  declarations: [
    AppComponent,
    TransactionComponent,
    BalanceComponent,
    SavingComponent,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
