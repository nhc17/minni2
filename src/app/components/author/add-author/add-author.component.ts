import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Author } from '../../../shared/models/author';
import { AuthorService } from '../../../shared/services/author.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-author',
  templateUrl: './add-author.component.html',
  styleUrls: ['./add-author.component.css']
})
export class AddAuthorComponent implements OnInit {

  uploadAPI: string = `${environment.api_url}/api/upload`
  currentUploadURL: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 40;
  spinnerFlag: boolean = false;
  multipleFilesUpload = [];

  addAuthorForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    profile: new FormControl('', Validators.required),
    thumbnail_url: new FormControl('')
  });

  constructor(
    private authorSvc: AuthorService, 
    private snackSvc: MatSnackBar) { }

  ngOnInit() {
  }

  onSubmit(){
    console.log(this.addAuthorForm.get("firstname").value);
    console.log(this.addAuthorForm.get("lastname").value);
    console.log(this.addAuthorForm.get("profile").value);
    var authorObj: Author = {
      firstname: this.addAuthorForm.get("firstname").value,
      lastname: this.addAuthorForm.get("lastname").value,
      email: this.addAuthorForm.get("email").value,
      profile: this.addAuthorForm.get("profile").value,
      thumbnail_url: this.multipleFilesUpload[0],
    }
    this.authorSvc.addAuthor(authorObj).subscribe((result)=>{
      let snackBarRef = this.snackSvc.open("Author added", 'Done', {
        duration: 3000
      });
      this.addAuthorForm.reset();
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
