import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent) /*,canActivate: [AuthGuard]*/
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
    data: { animation: 'HomePage' }
  },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then((m) => m.RegisterComponent) },
  { path: 'login', loadComponent: () => import('./components/login/login.component').then((m) => m.LoginComponent) },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    data: { animation: 'ProfilePage' }
  },
  {
    path: 'createEvent',
    loadComponent: () => import('./components/create-event/create-event.component').then((m) => m.CreateEventComponent),
    canActivate: [authGuard]
  },
  {
    path: 'editEvent/:id',
    loadComponent: () => import('./components/edit-event/edit-event.component').then((m) => m.EditEventComponent),
    canActivate: [authGuard]
  },
  { path: 'search', loadComponent: () => import('./components/search/search.component').then((m) => m.SearchComponent) },
  {
    path: 'success/account/:accountId',
    loadComponent: () => import('./components/success/success.component').then((m) => m.SuccessComponent)
  },
  {
    path: 'success/product/:productId',
    loadComponent: () => import('./components/success/success.component').then((m) => m.SuccessComponent)
  },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then((m) => m.CartComponent) },
  { path: 'event/:id', loadComponent: () => import('./components/event/event.component').then((m) => m.EventComponent) },

  { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then((m) => m.NotFoundComponent) }
];
