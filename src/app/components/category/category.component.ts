import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../shared/models/category';
import { CategoryService } from '../../shared/services/category.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';

export interface DialogData {
  id: string;
  category_name: string;
  
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit {

  categories: Category[];

  constructor(
    private router: Router,
    private catSvc: CategoryService, 
    public dialog: MatDialog,
    private snackSvc: MatSnackBar) { }

  ngOnInit() {
    this.catSvc.getCategories().subscribe((result)=>{
      this.categories = result;
      
    });
  }

  onEdit(idValue){
    console.log(idValue);
    this.router.navigate([`/Category/Edit/${idValue}`]);
  }

  onAdd(){
    this.router.navigate(['/Category/Add']);
  }

  
  onDelete(idValue, category_name) {
    const dialogRef = this.dialog.open(DeleteCategoryDialog, {
      width: '250px',
      data: {id: idValue, category_name: category_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(typeof(result) !== 'undefined')
      {
        this.catSvc.deleteCategory(idValue).subscribe((result)=>{
          console.log(result);
          for(let x = 0; x < this.categories.length; x++) {
            if(this.categories[x].id === idValue) {
              this.categories.splice(x, 1);
              break;
            }
          }
          let snackBarRef = this.snackSvc.open("Category Deleted", 'Done', {
            duration: 3000
          });
        })
      }       
    });
  }

}

@Component({
  selector: 'delete-category-dialog',
  templateUrl: 'category-delete-dialog.html',
})
export class DeleteCategoryDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteCategoryDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}