import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { PasswordValidation } from '../../validation/password-match';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';  //open source authentication wrapper
import { auth } from 'firebase/app'; // the object that does the authentication
import { MatSnackBar } from '@angular/material';
import * as firebase from 'firebase';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  PASSWORD_PATTERN = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  resetPasswordForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    public afAuth: AngularFireAuth,
    private authSvc: AuthService,
    private snackSvc:  MatSnackBar
    ) {
        this.resetPasswordForm = fb.group({
          password: ['', [Validators.required, Validators.pattern(this.PASSWORD_PATTERN)]],
          confirmPassword: ['', Validators.required]
        }, {
            validator: [PasswordValidation.MatchPassword]
          })
      }

  ngOnInit() {}
  

  onSubmit() {
    let user = firebase.auth().currentUser;
    let newPassword = this.resetPasswordForm.get("confirmPassword").value;

    user.updatePassword(newPassword).then(() => {
      console.log("Password reset!");
      let snackBarRef = this.snackSvc.open("Password Reset Successful!", 'Done', {
        duration: 2000
        })
        setTimeout(function() {
          this.router.navigate(['/Author']);
        }.bind(this), 3000);
        
      }).catch((error) => { 
        console.log(error); 
        let snackBarRef = this.snackSvc.open("Invalid !", 'Done', {
          duration: 2000
        });
      });
    }

}

