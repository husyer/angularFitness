import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth-service';
import { NgForm } from '@angular/forms';
import { UIService } from '../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;
  isLoading = false;
  private _loadingSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private _uiService: UIService
  ) {}

  ngOnInit() {
    this._loadingSubscription = this._uiService.loadingStateChanged.subscribe(
      isLoading => {
        this.isLoading = isLoading;
      }
    );
    // On definit l'age minimum a 18 ans
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    });
  }

  ngOnDestroy() {
    this._loadingSubscription.unsubscribe();
  }
}
