import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { PasswordValidation } from '../../validation/password-match';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';  //open source authentication wrapper
import { auth } from 'firebase/app'; // the object that does the authentication
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm :FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    public afAuth: AngularFireAuth,
    private authSvc: AuthService,
    private snackSvc:  MatSnackBar
    ) {
        this.forgotPasswordForm = fb.group({
          email: ['', [Validators.required, Validators.email]],
         })
      }
      
  ngOnInit() {
  }

  onSubmit(){
    let email = this.forgotPasswordForm.get("email").value;
    
    this.authSvc.forgotPassword(email).then(() => {
      let snackBarRef = this.snackSvc.open("Reset Password email! sent", 'Done', {
        duration: 2000
      });
      setTimeout(function() {
        this.router.navigate(['/login']);
      }.bind(this), 2000);
      
    })
  }


}
