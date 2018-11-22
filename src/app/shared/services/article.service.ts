import { Injectable } from '@angular/core';
import { Article } from '../models/article';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class ArticleService {

  private articlesRootApiUrl = `${environment.api_url}/api/articles`;

  constructor(
      private http: HttpClient,
      public snackBar: MatSnackBar) { }

  // GET an array of articles
  public getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.articlesRootApiUrl)
    .pipe(catchError(this.handleError<Article[]>('getArticles')));
  }

  // GET an array of articles by Category
  public getArticlesbyCategory(idValue): Observable<Article[]> {
  return this.http.get<Article[]>(`${this.articlesRootApiUrl}/${idValue}`)
  .pipe(catchError(this.handleError<Article[]>('getArticlesbyCategory')));
}
  
  // GET an array of articles by Author
  public getArticlesbyAuthor(idValue): Observable<Article[]> {
    return this.http.get<Article[]>(`${this.articlesRootApiUrl}/${idValue}`)
    .pipe(catchError(this.handleError<Article[]>('getArticlesbyAuthor')));
  }

  //Get a single article
  public getArticle(idValue): Observable<Article> {
    return this.http.get<Article>(`${this.articlesRootApiUrl}/${idValue}`)
      .pipe(catchError(this.handleError<Article>('getArticle')));
  }

  // Add an article
  publishArticle(article): Observable<Article> {
      return this.http.post<Article>(this.articlesRootApiUrl, article)
      .pipe(catchError(this.handleError<Article>('publishArticles')));
    }

  // Edit an article  
  editArticle(details): Observable<Article> {
    console.log(details);
    return this.http.put<Article>(this.articlesRootApiUrl, details)
     .pipe(catchError(this.handleError<Article>('editArticle')));
  }

  // Delete an article
  deleteArticle(idValue): Observable<Article> {
    console.log(idValue);
    return this.http.delete<Article>(`${this.articlesRootApiUrl}?id=${idValue}`)
    .pipe(catchError(this.handleError<Article>('deleteArticle')));
  }
  
  private handleError<T>(operation = 'operation', result?: T){
    return (error: any): Observable<T> => {
      console.log(JSON.stringify(error.error));
      this.showErrorMessage(JSON.stringify(error.error));
      return throwError(error || 'generic backend error');
  }
}

  showErrorMessage(msg) {
    let snackBarRef = this.snackBar.open(msg, 'Undo');
    console.log(snackBarRef);
  }
}