import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoratoriumRequestComponent } from './moratorium-request/moratorium-request.component';
import { MoratoriumApprovalComponent } from './moratorium-approval/moratorium-approval.component';

const routes: Routes = [
  {
    path: 'moratorium-request',
    component: MoratoriumRequestComponent,
    data: {
      breadcrumb: 'Moratorium Request'
    },
    pathMatch: 'full'
  },
  {
    path: 'moratorium-approval',
    component: MoratoriumApprovalComponent,
    data: {
      breadcrumb: 'Moratorium Approval'
    },
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoratoriumRoutingModule { }
