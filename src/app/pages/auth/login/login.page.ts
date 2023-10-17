import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      email: ['',[ Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  loginUser(){
    if(!this.loginForm.valid){
      console.log("not valid");
      return;
    }
    console.log("valid...");
  }
}
