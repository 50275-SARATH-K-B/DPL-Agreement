import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsecondComponent } from './dashboardsecond/dashboardsecond.component';

const routes: Routes = [
  {path: 'dashboard2', component: DashboardsecondComponent, data: { breadcrumb: 'Dashboard' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchdashboardRoutingModule { }
