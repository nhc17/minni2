import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Modules & Components
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AuthorComponent } from './components/author/author.component';
import { AddAuthorComponent } from './components/author/add-author/add-author.component';
import { SearchAuthorComponent } from './components/author/search-author/search-author.component';
import { EditAuthorComponent } from './components/author/edit-author/edit-author.component';
import { DeleteAuthorDialog } from './components/author/author.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { EditCategoryComponent } from './components/category/edit-category/edit-category.component';
import { DeleteCategoryDialog } from './components/category/category.component';
import { ArticleComponent } from './components/article/article.component';
import { PublishComponent } from './components/article/publish/publish.component';
import { EditArticleComponent } from './components/article/edit-article/edit-article.component';
import { DeleteArticleDialog } from './components/article/article.component';
//import { MemberComponent } from './components/member/member.component';
import { RegisterComponent } from './shared/security/register/register.component';
import { LoginComponent } from './shared/security/login/login.component';
import { ChangePasswordComponent } from './shared/security/change-password/change-password.component';
import { ForgotPasswordComponent } from './shared/security/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './shared/security/reset-password/reset-password.component';

// Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Design Materials
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/layout/header/header.component';
import { MaterialModule } from './shared/layout/material.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
// import { ArticleThumbnailPreloadDirective } from './shared/layout/img-preload/article-thumbnail-preload.directive';
import { MatSortModule,  MatPaginatorModule } from '@angular/material';



// Services
import { HttpClientModule } from '@angular/common/http';
import { RoutingModule } from './app.routing';
import { MatFileUploadModule } from './shared/mat-file-upload/matFileUpload.module';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material';
import { environment } from '../environments/environment';
import { NgxLocalStorageModule } from 'ngx-localstorage';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

// Firebase 
import { AngularFireModule} from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthorComponent,
    SearchAuthorComponent,
    AddAuthorComponent,
    EditAuthorComponent,
    DeleteAuthorDialog,
    ArticleComponent,
    PublishComponent,
    EditArticleComponent,
    DeleteArticleDialog,
    CategoryComponent,
    AddCategoryComponent,
    EditCategoryComponent,
    DeleteCategoryDialog,
   // MemberComponent,    
    RegisterComponent,
    LoginComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  //  ArticleThumbnailPreloadDirective,
    
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RoutingModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    MatFileUploadModule,
    PerfectScrollbarModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule, 
    AngularFireStorageModule,
    AngularFontAwesomeModule,
    AngularFireMessagingModule,
    NgxLocalStorageModule.forRoot(),
    MatSortModule, MatPaginatorModule,
    
  ],

  providers: [

     AngularFirestore,
    
    { 
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {separatorKeyCodes: [ENTER, COMMA]}
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
   

],
  entryComponents: [DeleteAuthorDialog, DeleteArticleDialog],
  bootstrap: [AppComponent]
})

export class AppModule { }
