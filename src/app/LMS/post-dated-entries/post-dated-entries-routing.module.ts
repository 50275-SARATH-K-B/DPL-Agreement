import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostDatedDocumentDetailsComponent } from './post-dated-document-details/post-dated-document-details.component';
import { PostDatedChequeComponent } from './post-dated-cheque/post-dated-cheque.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'post-dated-document',
        component: PostDatedDocumentDetailsComponent,
        data: {
          breadcrumb: 'POST DATED DOCUMENT DETAILS'
        },
        pathMatch: 'full'
      },
      {
        path: 'post-dated-cheque',
        component: PostDatedChequeComponent,
        data: {
          breadcrumb: 'POST DATED CHEQUE DETAILS'
        },
        pathMatch: 'full'
      },
          ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostDatedEntriesRoutingModule { }
