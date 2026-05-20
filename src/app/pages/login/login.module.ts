import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from '../../theme/guards/auth.guard';
import { AuthenticationService } from './authentication.service';
import { DirectivesModule } from '../../directives/directive.module';
import { ElectronService } from 'ngx-electron';
import { NOCComponent } from '../../Report/report/noc/noc.component';
import { ReportModule } from '../../Report/report/report.module';

export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DirectivesModule,
    HttpClientModule,
  ],
  declarations: [LoginComponent],
  providers: [AuthenticationService, ElectronService, AuthGuard]
})
export class LoginModule { }