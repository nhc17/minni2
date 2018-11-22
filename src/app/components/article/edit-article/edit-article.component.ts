import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../shared/services/article.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})

export class EditArticleComponent implements OnInit  {

  article: Article;
  editArticleForm: FormGroup

  uploadAPI: string = `${environment.api_url}/api/upload`
  currentUploadURL: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 40;
  spinnerFlag: boolean = false;
  multipleFilesUpload = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private articleSvc: ArticleService,
    private fb: FormBuilder,
    private snackSvc: MatSnackBar,
    ) {
      this.editArticleForm = fb.group({
        category_name: ['', Validators.required],
        title: ['', Validators.required],
        tags: fb.group({
          tag0: ['', Validators.required],
          tag1: ['', Validators.required],
          tag2: ['', Validators.required],
          tag3: ['', Validators.required],
          tag4: ['', Validators.required],
        }),
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        post_date: ['', Validators.required],
        duration: ['', Validators.required],
        summary: ['', Validators.required],
        content: ['', Validators.required],
      })
    }
   
    ngOnInit() {
      let id = this.activatedRoute.snapshot.params.id;
      console.log(id);
      this.articleSvc.getArticle(id).subscribe((result)=>{
        console.log(JSON.stringify(result))
        this.editArticleForm.patchValue({
          id: result.id,
          category_name: result.category_name,
          title: result.title,
          tags: result.tags,
          firstname: result.author_firstname,
          lastname: result.author_lastname,
          post_date: result.post_date,
          duration: result.duration,
          summary: result.summary,
          content: result.content
        });
        this.article = result;
      })
    }


    onSubmit(){
      console.log(this.editArticleForm.get("category_name").value);
      console.log(this.editArticleForm.get("title").value);
      var articleObj: Article = {
        id: this.article.id,
        category_name: this.editArticleForm.get("category_name").value,
        title: this.editArticleForm.get("title").value,
        tags: this.editArticleForm.get("tags").value,
        author_firstname: this.editArticleForm.get("firstname").value,
        author_lastname: this.editArticleForm.get("lastname").value,
        post_date: this.editArticleForm.get("post_date").value,
        duration: this.editArticleForm.get("duration").value,
        summary: this.editArticleForm.get("summary").value,
        content: this.editArticleForm.get("content").value,
        thumbnail_url: this.multipleFilesUpload[0],
      }
      this.articleSvc.editArticle(articleObj).subscribe((result)=>{
        let snackBarRef = this.snackSvc.open("Article updated", 'Done', {
          duration: 3000
        });
        this.editArticleForm.reset();
      })
    }
  
    doneUpload(evt){
      console.log(evt.file);
      console.log(">>>" + JSON.stringify(evt.event));
      let evtObj = {... evt.event};
      console.log(">>>" + evtObj);
      this.spinnerFlag = true;
      if(typeof(evtObj.body) !== 'undefined'){
        console.log(evtObj.body);
          this.currentUploadURL = evtObj.body;
          this.multipleFilesUpload.push(this.currentUploadURL);
          this.spinnerFlag = false;
      }
    }
}