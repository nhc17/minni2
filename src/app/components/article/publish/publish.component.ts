import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Article } from '../../../shared/models/article';
import { ArticleService } from '../../../shared/services/article.service';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
  
})
export class PublishComponent implements OnInit  {

  uploadAPI: string = `${environment.api_url}/api/upload`
  currentUploadURL: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 40;
  spinnerFlag: boolean = false;
  multipleFilesUpload = [];

  addArticleForm: FormGroup;
  tags: FormGroup;

  ngOnInit() {
  }
  
  constructor(
    private fb: FormBuilder,
    private articleSvc: ArticleService,
    private snackSvc: MatSnackBar) {
      this.addArticleForm = fb.group({
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
   
    onSubmit(){
      console.log(this.addArticleForm.get("category_name").value);
      console.log(this.addArticleForm.get("title").value);
      var articleObj: Article = {
        category_name: this.addArticleForm.get("category_name").value,
        title: this.addArticleForm.get("title").value,
        tags: this.addArticleForm.get("tags").value,
        author_firstname: this.addArticleForm.get("firstname").value,
        author_lastname: this.addArticleForm.get("lastname").value,
        post_date: this.addArticleForm.get("post_date").value,
        duration: this.addArticleForm.get("duration").value,
        summary: this.addArticleForm.get("summary").value,
        content: this.addArticleForm.get("content").value,
        thumbnail_url: this.multipleFilesUpload[0],
      }
      this.articleSvc.publishArticle(articleObj).subscribe((result)=>{
        let snackBarRef = this.snackSvc.open("Article added", 'Done', {
          duration: 3000
        });
        this.addArticleForm.reset();
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