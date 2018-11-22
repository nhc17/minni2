import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';  //open source authentication wrapper
import { auth } from 'firebase/app'; // the object that does the authentication
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  PASSWORD_PATTERN = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  loginForm :FormGroup;
  user = firebase.auth().currentUser;
  timer: any;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    public afAuth: AngularFireAuth,
    private authSvc: AuthService,
    private snackSvc:  MatSnackBar    
     ) {
       this.loginForm = fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]],
      })
    }

   loginGoogle(){
    this.authSvc.loginWithGoogle();
  }

 
  loginGithub(){
    this.authSvc.loginWithGithub();
  }

  loginWithEmail(){
    const formValue = this.loginForm.value;
    if(this.loginForm.valid){
      this.authSvc.loginWithEmail(formValue.email, formValue.password)
            .subscribe((result) => {
                  console.log(result);
                  
                  this.authSvc.setFirebaseTokenToLocalstorage();
                  let snackBarRef = this.snackSvc.open("Logged In Successfully", 'Done', {
                    duration: 2000
                  })
                  
                  this.timer = setTimeout(function() {
                      //this.spinnerService.hide();
                    this.router.navigate(['/Author']);
                      console.log("delay ...");
                    }.bind(this), 4000);
                  })
                } else {
                  let snackBarRef = this.snackSvc.open("Invalid! Pls try logging in again", 'Done', {
                    duration: 2000
                  });
                }
              }
           

  changePassword() {
    clearTimeout(this.timer);
    this.router.navigate(['/ChangePassword']);
  }
  
  forgotPassword() {
    clearTimeout(this.timer);
    this.router.navigate(['/ForgotPassword']);
  }

  resetPassword() {
    clearTimeout(this.timer);
    this.router.navigate(['/ResetPassword']);
  }

  

  ngOnInit() {
  }

 
}
