import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myFormControl: FormGroup;
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.myFormControl = this.fb.group({
      email: [''],
      password: ['']
    });
  }
  onSubmit(form) {
    this.authService.login({
      email: this.myFormControl.value.email,
      password: this.myFormControl.value.password
    });
  }
}
