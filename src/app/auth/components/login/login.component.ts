import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup;
  submit = false;

  ngOnInit(): void {

    this.initForm();

  }

  initForm() {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required,Validators.minLength(5)]),
      'password': new FormControl('', [Validators.required, Validators.minLength(5)])
    });
  }

  get f() { return this.loginForm.controls; }


  onSubmit() : void{
    console.log('Form Submitted');
    if (this.loginForm.valid) {
      this.submit = true;
      //this.loginForm.reset();
      console.log(this.loginForm.get('email')?.value);
      console.log(this.loginForm.get('password')?.value);
    }else{
      this.submit = false;
      return;
    }


  }

  ForgotPassword() {
    this.loginForm.reset();
    this.submit = false;
    console.log('Forgot Password Clicked');
  }

}