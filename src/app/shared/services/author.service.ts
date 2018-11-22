import { Injectable } from '@angular/core';
import { Author } from '../models/author';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class AuthorService {

  private authorsRootApiUrl = `${environment.api_url}/api/authors`;
  private searchAuthorApiUrl = this.authorsRootApiUrl + "/search";

  constructor(
    private http: HttpClient,
    public snackBar: MatSnackBar) { }

  // Get an array of authors
  public getAuthors(): Observable<Author[]> {
    return this.http.get<Author[]>(this.authorsRootApiUrl)
      .pipe(catchError(this.handleError<Author[]>('getAuthors')));
  }

  //Get a single author by id
  public getAuthor(idValue): Observable<Author> {
    return this.http.get<Author>(`${this.authorsRootApiUrl}/${idValue}`)
      .pipe(catchError(this.handleError<Author>('getAuthor')));
  }

  //Get a single author by name - need to test out
  public getAuthorbyName(details): Observable<Author> {
    return this.http.get<Author>(`${this.searchAuthorApiUrl}/${details}`)
      .pipe(catchError(this.handleError<Author>('getAuthor')));
  }

   // Add an author
   addAuthor(author): Observable<Author> {
    return this.http.post<Author>(this.authorsRootApiUrl, author)
    .pipe(catchError(this.handleError<Author>('addAuthor')));
  }

   // Edit an author
   editAuthor(details): Observable<Author> {
    console.log(details);
    return this.http.put<Author>(this.authorsRootApiUrl, details)
    .pipe(catchError(this.handleError<Author>('editAuthor')));
  }
  
  // Delete an author  
  deleteAuthor(idValue): Observable<Author> {
    console.log(idValue);
    return this.http.delete<Author>(`${this.authorsRootApiUrl}?id=${idValue}`)
    .pipe(catchError(this.handleError<Author>('deleteAuthor')));
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