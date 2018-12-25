import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { MatSnackBar } from '@angular/material';
import { UIService } from './shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private user: User;
  private _isAuth = false;

  constructor(
    private router: Router,
    private _auth: AngularFireAuth,
    private _trainingService: TrainingService,
    private _matSnackBar: MatSnackBar,
    private _uiService: UIService
  ) {}

  initAuthListener() {
    this._auth.authState.subscribe(user => {
      if (user) {
        this._isAuth = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this._trainingService.cancelSuscription();
        this._auth.auth.signOut();
        this._isAuth = false;
        this.authChange.next(false);
      }
    });
  }

  registerUser(authData: AuthData) {
    this._uiService.loadingStateChanged.next(true);
    this._auth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this._uiService.loadingStateChanged.next(false);
      })
      .catch(err => {
        this._matSnackBar.open(err.message, null, {
          duration: 3000
        });
      });
  }

  login(authData: AuthData) {
    this._uiService.loadingStateChanged.next(true);
    this._auth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        this._uiService.loadingStateChanged.next(false);
      })
      .catch(err => {
        this._matSnackBar.open(err.message, null, {
          duration: 3000
        });
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
}
