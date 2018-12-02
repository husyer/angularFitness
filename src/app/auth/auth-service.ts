import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSucess();
  }

  login(authData: AuthData) {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSucess();
  }
  logout() {
    this.user = null;
    this.authChange.next(false);
  }
  getUser() {
    return { ...this.user };
  }
  isAuth() {
    return this.user != null;
  }
  authSucess() {
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
