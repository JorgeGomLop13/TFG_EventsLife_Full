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
  { path: 'search', loadComponent: () => import('./components/search/search.component').then((m) => m.SearchComponent) },
  { path: 'cart', loadComponent: () => import('./components/cart/cart.component').then((m) => m.CartComponent) },
  { path: 'event/:id', loadComponent: () => import('./components/event/event.component').then((m) => m.EventComponent) },
  {
    path: 'profile',
    loadComponent: () => import('./components/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    data: { animation: 'ProfilePage' }
  },
  {
    path: '',
    loadComponent: () => import('./layouts/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
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
      {
        path: 'success/account/:accountId',
        loadComponent: () => import('./components/success/success.component').then((m) => m.SuccessComponent)
      },
      {
        path: 'success/product/:productId',
        loadComponent: () => import('./components/success/success.component').then((m) => m.SuccessComponent)
      },
      {
        path: 'editUser/:id',
        loadComponent: () => import('./components/edit-profile/edit-profile.component').then((m) => m.EditProfileComponent)
      },
      {
        path: 'terms-and-conditions',
        loadComponent: () =>
          import('./components/terms-and-conditions/terms-and-conditions.component').then((m) => m.TermsAndConditionsComponent)
      },
      {
        path: 'frequent-questions',
        loadComponent: () =>
          import('./components/frequent-questions/frequent-questions.component').then((m) => m.FrequentQuestionsComponent)
      },
      { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then((m) => m.NotFoundComponent) }
    ]
  }
];
