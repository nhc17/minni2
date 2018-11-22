import { Component, OnInit } from '@angular/core';
import { Author } from '../../../shared/models/author';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthorService } from '../../../shared/services/author.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-author',
  templateUrl: './search-author.component.html',
  styleUrls: ['./search-author.component.css']
})
export class SearchAuthorComponent implements OnInit {

  author: Author;
  searchAuthorForm: FormGroup

  constructor(
    private activatedRoute: ActivatedRoute,
    private authorSvc: AuthorService, 
    private fb: FormBuilder
    ) {
      this.searchAuthorForm = fb.group({
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
      })
     }

  ngOnInit() {
  }

  onSubmit() {
    let id = this.activatedRoute.snapshot.params.id;
    console.log(id);
    this.authorSvc.getAuthor(id).subscribe((result)=>{
      console.log(JSON.stringify(result))
      this.searchAuthorForm.patchValue({
        id: result.id,
        firstname: result.firstname,
        lastname: result.lastname,
      });
      this.author = result;
   })
 }
}
