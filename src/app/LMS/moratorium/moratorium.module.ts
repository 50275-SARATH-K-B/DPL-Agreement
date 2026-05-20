import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MoratoriumRoutingModule } from './moratorium-routing.module';
import { MoratoriumRequestComponent } from './moratorium-request/moratorium-request.component';
import { MoratoriumApprovalComponent } from './moratorium-approval/moratorium-approval.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directive.module';
import { MoratoriumService } from '../../services/LMS/moratorium.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    MoratoriumRoutingModule
  ],
  declarations: [MoratoriumRequestComponent, MoratoriumApprovalComponent],
  providers: [MoratoriumService,DatePipe]
})
export class MoratoriumModule { }
