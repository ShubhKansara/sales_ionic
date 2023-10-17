import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public registerForm!: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }


  initializeForm() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      conf_password: ['', [Validators.required]]
    })
  }

  registerUser() {
    if (!this.registerForm.valid) {
      console.log("not valid");
      return;
    }
    console.log("valid...");
  }

}
