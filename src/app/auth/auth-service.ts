import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;
  private _isAuth = false;

  constructor(
    private router: Router,
    private _auth: AngularFireAuth,
    private _trainingService: TrainingService
  ) {}

  registerUser(authData: AuthData) {
    this._auth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSucess();
      });
  }

  login(authData: AuthData) {
    this._auth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this.authSucess();
      });
  }
  logout() {
    this._trainingService.cancelSuscription();
    this._auth.auth.signOut();
    this._isAuth = false;
    this.authChange.next(false);
  }
  getUser() {
    return { ...this.user };
  }
  isAuth() {
    return this._isAuth;
  }
  authSucess() {
    this._isAuth = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
