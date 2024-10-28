import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SavingsComponent } from './pages/savings/savings.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'savings',
    component: SavingsComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];
