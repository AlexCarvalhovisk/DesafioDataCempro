import {bootstrapApplication} from '@angular/platform-browser';
import {importProvidersFrom} from '@angular/core';
import {provideRouter, Routes} from '@angular/router';
// 1. Importe withInterceptorsFromDi
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';

import {JwtModule} from '@auth0/angular-jwt';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {AppComponent} from './app/app.component';
import {AuthGuard} from './app/services/auth-guard.service';
import {Login} from './app/componentes/auth/login.component';
import {Home} from './app/componentes/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: Login},
  {path: 'home', component: Home, canActivate: [AuthGuard]}
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),

    // 2. Esta função faz a "ponte" entre o novo HttpClient e o interceptor do JwtModule
    provideHttpClient(withInterceptorsFromDi()),

    provideAnimations(),
    AuthGuard,
    importProvidersFrom(
      MatSnackBarModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: () => {
            return localStorage.getItem('token');
          },
          allowedDomains: ['localhost:5138'],
          disallowedRoutes: []
        }
      })
    )
  ]
}).catch(err => console.error(err));
