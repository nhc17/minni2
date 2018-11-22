import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject, ReplaySubject, of } from 'rxjs';
import { catchError, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthInfo } from "../models/authinfo";
import * as firebase from 'firebase';
import { LocalStorageService } from 'ngx-localstorage';
import { Router } from "@angular/router";
import { User, Roles } from '../models/user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

static UNKNOWN_USER = new AuthInfo(null, null);  
authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(AuthService.UNKNOWN_USER);
authState: any = null;

private currentUserSubject = new BehaviorSubject<User>({} as User);
public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
public isAuthenticated = this.isAuthenticatedSubject.asObservable();
user$: Observable<User>;
roles: Roles;

  constructor(
      private afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router,
      private storageSvc: LocalStorageService) {
          // Get auth data, then get firestore user document || null
        this.afAuth.authState.pipe(
            switchMap(authData => {
              if (authData) {
                // if signed in
                return this.afs.doc<User>(`users/${authData.uid}`).valueChanges();
              } else {
                // if not signed in
                return of(null);
              }
            }))
            .subscribe((_authInfo$) => {
              console.log(this.authInfo$);
              this.authInfo$.next(_authInfo$);
        });
       }
       
       
       // Social Login 
       loginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        return this.oAuthLogin(provider);
       }

       loginWithGithub(){
        const provider = new firebase.auth.GithubAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        return this.oAuthLogin(provider);
      }
    
        private oAuthLogin(provider) {
            return this.afAuth.auth
            .signInWithPopup(provider)
            .then((credential) => {
                this.updateUserData(credential.user);
            }, err => {
                // console.log(err);
            });
        }

        // Email Login, Register, Forgot Password & Log out
        loginWithEmail(email, password): Observable<AuthInfo> {
            return this.fromFirebaseAuthPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password))
            .pipe(
                catchError(this.handleError('login', AuthInfo))
            );
        }

        signUp(email, password) {
            return this.fromFirebaseAuthPromise(this.afAuth.auth.createUserWithEmailAndPassword(email, password))
            .pipe(
                catchError(this.handleError('sign up error!'))
              );
        }


        forgotPassword(email) {
            return this.afAuth.auth.sendPasswordResetEmail(email);
        }

        
        logout() {
            this.storageSvc.remove('firebaseIdToken');
            this.afAuth.auth.signOut().then(result => this.destroyToken());
            this.authInfo$.next(AuthService.UNKNOWN_USER);
            this.router.navigate(['/login']);
          }
        

          
        // Update database with user info after login
        private updateUserData(authData) {
            // Sets user data to firestore on login
            const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${authData.uid}`);
            const data: User = {
                uid: authData.uid,
                email: authData.email,
                displayName: authData.displayName,
                roles: { user: true, author: true, admin: true }
                };
                return userRef.set(data, { merge: true })
            }


        // Firebase Authentication Promise to Observable & Setting Firebase token to local storage   
        fromFirebaseAuthPromise(promise): Observable<any> {
            const subject = new Subject<any>();
            promise
                .then(res => {
                        const authInfo = new AuthInfo(
                                this.afAuth.auth.currentUser.uid, 
                                this.afAuth.auth.currentUser.email);
                        this.authInfo$.next(authInfo);
                        subject.next(res);
                        subject.complete();
                    
                    },
                    err => {
                        this.authInfo$.error(err);
                        console.log("err1 " + err);
                        subject.error(err);
                        subject.complete();
                    });
            return subject.asObservable();
        }

        setFirebaseTokenToLocalstorage(){
            this.afAuth.auth.currentUser.getIdToken().then(idToken => {
                console.log("FIREBASE TOKEN !!!! " + idToken);
                this.saveToken(idToken);
            });
        }

        getToken(): String {
            return window.localStorage['firebaseToken'];
        }

        saveToken(token: String) {
            console.log("Firebase token ! > " + token);
            window.localStorage['firebaseToken'] = token;
        }
        
        destroyToken() {
            window.localStorage.removeItem('firebaseToken');
        } 
         

        // Roles & Abilities
        canRead(user: User): boolean {
            const allowed = ['user', 'author', 'admin'];
            return this.checkAuth(user, allowed);
          }

        canAdd(user: User): boolean {
            const allowed = ['author', 'admin'];
            return this.checkAuth(user, allowed);
          }

        canEdit(user: User): boolean {
            const allowed = ['author', 'admin'];
            return this.checkAuth(user, allowed);
          }

        canDelete(user: User): boolean {
            const allowed = ['admin'];
            return this.checkAuth(user, allowed);
         }
    
        // determines if user has matching role
        private checkAuth(user: User, allowedRoles: string[]): boolean {
        if (user) {
            for (const role of allowedRoles) {
            if (user.roles[role]) {
                return true;
            } else {
                return false;
             }
            }
          }
        }



        // Handle Errors
        private handleError<T> (operation = 'operation', result?: T) {
            return (error: any): Observable<T> => {
            console.error(JSON.stringify(error))
            return Observable.throw(error  || 'backend server error');
            };
        }

    }