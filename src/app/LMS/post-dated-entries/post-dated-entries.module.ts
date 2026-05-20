import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostDatedEntriesRoutingModule } from './post-dated-entries-routing.module';
import { PostDatedDocumentDetailsComponent } from './post-dated-document-details/post-dated-document-details.component';
import { PostDatedChequeComponent } from './post-dated-cheque/post-dated-cheque.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directive.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    PostDatedEntriesRoutingModule,
  ],
  declarations: [PostDatedDocumentDetailsComponent, PostDatedChequeComponent],
  entryComponents: [
  ],
  exports : [
    PostDatedChequeComponent
  ]
})
export class PostDatedEntriesModule { }
