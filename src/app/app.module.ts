import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SavingsComponent } from './pages/savings/savings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    SavingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatFormFieldModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      timeOut: 3000,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
