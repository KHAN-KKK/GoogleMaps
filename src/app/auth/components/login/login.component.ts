import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private route : Router, private fb: FormBuilder){
    this.sampleForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      gender: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

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
    this.route.navigate(['/dash']);
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


   sampleForm: FormGroup;
  uploadedFile: File | null = null;



  get email() { return this.sampleForm.get('email')!; }
  get password() { return this.sampleForm.get('password')!; }
  get mobile() { return this.sampleForm.get('mobile')!; }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.uploadedFile = event.target.files[0];
    }
  }

  onSubmit2() {
    
    if (this.sampleForm.valid) {
      console.log('Form Values:', this.sampleForm.value);
      console.log('Uploaded File:', this.uploadedFile);
    }
  }

  onReset() {
    this.sampleForm.reset();
    this.uploadedFile = null;
  }

}