import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Category } from '../models/category';
import { Subject }    from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private categoriesRootApiUrl = `${environment.api_url}/api/categories`; 
  private editCategoryNameSource = new Subject<string>();
  editCategoryName$ = this.editCategoryNameSource.asObservable();
  
  constructor(
      private http: HttpClient,
      public snackBar: MatSnackBar) { }

  // GET an array of categories
  public getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesRootApiUrl)
     .pipe(catchError(this.handleError<Category[]>('getCategories')));
  }

   //Get a single category by id
   public getCategory(idValue): Observable<Category> {
    return this.http.get<Category>(`${this.categoriesRootApiUrl}/${idValue}`)
      .pipe(catchError(this.handleError<Category>('getCategory')));
  }

   editNameBroadcast(name: string) {
    this.editCategoryNameSource.next(name);
  }

  getEditCategoryName$() : Observable<any>
  {
    return this.editCategoryName$;
  }
  
  editCategory(details): Observable<Category> {
    console.log(details);
    return this.http.put<Category>(this.categoriesRootApiUrl, details)
     .pipe(catchError(this.handleError<Category>('editCategories')));
  }

  addCategory(category): Observable<Category> {
    return this.http.post<Category>(this.categoriesRootApiUrl, category)
    .pipe(catchError(this.handleError<Category>('addCategory')));
  }

  deleteCategory(idValue): Observable<Category> {
    console.log(idValue);
    return this.http.delete<Category>(`${this.categoriesRootApiUrl}?id=${idValue}`)
    .pipe(catchError(this.handleError<Category>('deleteCategory')));
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

