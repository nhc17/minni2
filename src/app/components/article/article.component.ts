import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router,  ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../shared/services/article.service';
import { Article} from '../../shared/models/article';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';




export interface DialogData {
  id: string;
  title: string;
}


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {

  articles: Article[];
  displayedColumns: string[] = [ 'category_name', 'title', 'author', 'post_date', 'summary', 'options'];
  dataSource = (new MatTableDataSource([]));

  
  
  @ViewChild(MatSort) sort: MatSort;

  // paginator
  length = 100;
  pageSize = 5;
  pageSizeOption: number[] = [5, 10, 20, 50];
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  
  filterValue = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private articleSvc: ArticleService,
    public dialog: MatDialog,
    private snackSvc: MatSnackBar) { }

  ngOnInit() {
    this.articleSvc.getArticles().subscribe((result)=>{
        this.articles = result;
        this.dataSource = new MatTableDataSource(result);   
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator; 
    }); 
  }
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
   }

  onKey(event: any) {
    this.filterValue += event.target.value;
  }
  
  onEdit(idValue){
    console.log(idValue);
    this.router.navigate([`/Article/Edit/${idValue}`]);
  }


  onPublish(){
    this.router.navigate(['/Publish']);
  }


  onDelete(idValue, title) {
    const dialogRef = this.dialog.open(DeleteArticleDialog, {
      width: '250px',
      data: {id: idValue, title: title}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
      if(typeof(result) !== 'undefined')
      {
        this.articleSvc.deleteArticle(idValue).subscribe((result)=>{
          console.log(result);
          for(let x = 0; x < this.articles.length; x++) {
            if(this.articles[x].id === idValue) {
              this.articles.splice(x, 1);
              break;
            }
          }
          let snackBarRef = this.snackSvc.open("Article Deleted", 'Done', {
            duration: 3000
          });
        })
      }       
    });
  }

}

@Component({
  selector: 'delete-article-dialog',
  templateUrl: 'article-delete-dialog.html',
})
export class DeleteArticleDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteArticleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }


}