import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidation } from '../../validation/password-match';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';  //open source authentication wrapper
import { auth } from 'firebase/app'; // the object that does the authentication
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  
  PASSWORD_PATTERN = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    public afAuth: AngularFireAuth,
    private authSvc: AuthService,
    private snackSvc:  MatSnackBar
    ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required], 
      lastname: ['', Validators.required], 
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: [PasswordValidation.MatchPassword]
    })
   }

   
   ngOnInit() {
  }

  signUp(){
    const formValue = this.registerForm.value;
    if(this.registerForm.valid){
      this.authSvc.signUp(formValue.email, formValue.password)
            .subscribe((result) => {
              console.log(result);
              
              this.authSvc.setFirebaseTokenToLocalstorage();
                  
                setTimeout(function() {
                  // this.spinnerService.hide();
                    this.router.navigate(['']);
                    console.log("delay ...");
                  }.bind(this), 4000);
                  let snackBarRef = this.snackSvc.open("Registered Successfully", 'Done', {
                    duration: 2000
                  })
                })
              } else{
                let snackBarRef = this.snackSvc.open("Invalid !", 'Done', {
                  duration: 2000
                });
              }
            }
          }
