import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BranchdashboardRoutingModule } from './branchdashboard-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { AppModule } from '../../../app.module';

@NgModule({
  imports: [
    CommonModule,
    BranchdashboardRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    AppModule,
    RouterModule

  ],
  declarations: [ ]
})
export class BranchdashboardModule { }
