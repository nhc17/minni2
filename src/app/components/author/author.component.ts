import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Author } from '../../shared/models/author';
import { AuthorService } from '../../shared/services/author.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

export interface DialogData {
  id: string;
  firstname: string;
  lastname: string;
}

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})

export class AuthorComponent implements OnInit {

  authors: Author[];
  author: Author;

  constructor(
    private router: Router,
    private authorSvc: AuthorService, 
    public dialog: MatDialog,
    private snackSvc: MatSnackBar) { }

  ngOnInit() {
    this.authorSvc.getAuthors().subscribe((result)=>{
      this.authors = result;
    });
  }


  onEdit(idValue){
    console.log(idValue);
    this.router.navigate([`/Author/Edit/${idValue}`]);
  }

  onAdd(){
    this.router.navigate(['/Author/Add']);
  }

  onSearch(idValue){
    console.log(idValue);
    this.router.navigate([`/Author/Search/${idValue}`]);
  }
  
  onDelete(idValue, firstname, lastname) {
    const dialogRef = this.dialog.open(DeleteAuthorDialog, {
      width: '250px',
      data: {id: idValue, firstname: firstname, lastname: lastname}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(typeof(result) !== 'undefined')
      {
        this.authorSvc.deleteAuthor(idValue).subscribe((result)=>{
          console.log(result);
          for(let x = 0; x < this.authors.length; x++) {
            if(this.authors[x].id === idValue) {
              this.authors.splice(x, 1);
              break;
            }
          }
          let snackBarRef = this.snackSvc.open("Author Deleted", 'Done', {
            duration: 3000
          });
        })
      }       
    });
  }

}

@Component({
  selector: 'delete-author-dialog',
  templateUrl: 'author-delete-dialog.html',
})
export class DeleteAuthorDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteAuthorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}