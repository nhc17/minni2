import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';  //open source authentication wrapper
import { auth } from 'firebase/app'; // the object that does the authentication

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    public afAuth: AngularFireAuth,
    private authService: AuthService) { }

  ngOnInit() {
  }

  navigateToArticle() {
  this.router.navigate(['/Article']);
  }
  
  navigateToLogin(){
    this.router.navigate(['/login']);
  }

  navigateToRegister(){
    this.router.navigate(['/register']);
  }

  navigateToAuthor(){
    this.router.navigate(['/Author']);
  }

  navigateToCategory(){
    this.router.navigate(['/Category']);
  }

  navigateToPublish(){
    this.router.navigate(['/Publish']);
  }

  logout(){
    this.afAuth.auth.signOut().then(result=>this.authService.destroyToken());
    this.router.navigate(['/Article']);
  }
}