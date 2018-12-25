import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth-service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { UIService } from '../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  myFormControl: FormGroup;
  private _loadingSubscription: Subscription;
  isLoading = false;

  constructor(
    private _authService: AuthService,
    private _fb: FormBuilder,
    private _uiService: UIService
  ) {}

  ngOnInit() {
    this._loadingSubscription = this._uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    this.createForm();
  }

  createForm() {
    this.myFormControl = this._fb.group({
      email: [''],
      password: ['']
    });
  }
  onSubmit(form) {
    this._authService.login({
      email: this.myFormControl.value.email,
      password: this.myFormControl.value.password
    });
  }

  ngOnDestroy() {
    this._loadingSubscription.unsubscribe();
  }
}
