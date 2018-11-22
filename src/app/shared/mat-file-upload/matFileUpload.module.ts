import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FileUploadInputFor } from './fileUploadInputFor.directive';
import { BytesPipe } from './bytes.pipe';
import { MatFileUpload } from './mat-file-upload/matFileUpload.component';
import { MatFileUploadQueue} from './mat-file-upload/matFileUpload.component';

import { MatProgressBarModule, MatCardModule, MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  imports: [
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    MatCardModule,
    HttpClientModule,
    CommonModule
  ],
  declarations: [
    MatFileUpload,
    MatFileUploadQueue,
    FileUploadInputFor,
    BytesPipe
  ],
  exports: [
    MatFileUpload,
    MatFileUploadQueue,
    FileUploadInputFor,
    BytesPipe
  ]
})
export class MatFileUploadModule { }
