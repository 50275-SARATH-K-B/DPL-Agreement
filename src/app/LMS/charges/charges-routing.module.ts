import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChargeEntryComponent } from './charge-entry/charge-entry.component';

const routes: Routes = [
  {
    path: 'charge-entry',
    component: ChargeEntryComponent,
    data: {
      breadcrumb: 'Charge Entry'
    },
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChargesRoutingModule { }
