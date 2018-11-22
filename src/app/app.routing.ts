import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule, PreloadAllModules } from '@angular/router';
import { AuthorComponent } from './components/author/author.component';
import { SearchAuthorComponent } from './components/author/search-author/search-author.component';
import { AddAuthorComponent } from './components/author/add-author/add-author.component';
import { EditAuthorComponent } from './components/author/edit-author/edit-author.component';
import { ArticleComponent } from './components/article/article.component';
import { CategoryComponent } from './components/category/category.component';
import { AddCategoryComponent } from './components/category/add-category/add-category.component';
import { EditCategoryComponent } from './components/category/edit-category/edit-category.component';
import { PublishComponent } from './components/article/publish/publish.component';
import { EditArticleComponent } from './components/article/edit-article/edit-article.component';
import { RegisterComponent } from './shared/security/register/register.component';
import { LoginComponent } from './shared/security/login/login.component';




const appRoutes = [
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'login',
        component: LoginComponent, 
    },
    {
        path: 'Author',
        component: AuthorComponent,
    },
    {
        path: 'Author/Search/:id',
        component: SearchAuthorComponent,
    },
    {
        path: 'Author/Add',
        component: AddAuthorComponent,
    },
    {
        path: 'Author/Edit/:id',
        component: EditAuthorComponent,
    },
    {
        path: 'Category',
        component: CategoryComponent,
    },
    {
        path: 'Category/Add',
        component: AddCategoryComponent,
    },
    {
        path: 'Category/Edit/:id',
        component: EditCategoryComponent,
    },
    {
        path: 'Article',
        component: ArticleComponent
    },
    {
        path: 'Publish',
        component: PublishComponent,
    },
    {
        path: 'Article/Edit/:id',
        component: EditArticleComponent,
    },
    {
        path: '', 
        redirectTo: '/Article', 
        pathMatch: 'full' 
    },
    {
        path: '**', 
        component: ArticleComponent,
    }

]

@NgModule({
    declarations: [
    
    ],
    imports: [
      BrowserModule,
      RouterModule.forRoot(appRoutes) // { enableTracing: true, preloadingStrategy: PreloadAllModules })
    ],
    exports: [ RouterModule ],
    providers: []
  })
export class RoutingModule { }