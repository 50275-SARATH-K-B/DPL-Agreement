import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EligibleCustomerComponent } from './eligible-customer/eligible-customer.component';
import { CustomerLoanComponent } from './customer-loan/customer-loan.component';
import { DisbursementComponent } from './disbursement/disbursement.component';
import { DisbursementDetailsComponent } from './disbursement-details/disbursement-details.component';
import { CollectionComponent } from './collection/collection.component';
import { CollectionDetailsComponent } from './collection-details/collection-details.component';
import { OutstandingComponent } from './outstanding/outstanding.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ExportExcelComponent } from './export-excel/export-excel.component';
import { DueListComponent } from './due-list/due-list.component';
import { CustomerWiseComponent } from './customer-wise/customer-wise.component';
import { DisbursementReportComponent } from './disbursement-report/disbursement-report.component';
import { RbiReportComponent } from './rbi-report/rbi-report.component';
import {EnachPresentationComponent} from './enach-presentation/enach-presentation.component';
import {EnachRealisationComponent} from './enach-realisation/enach-realisation.component';
import { EligibilityUpdateComponent } from './eligibility-update/eligibility-update.component';
import { EligibilityApprovalComponent } from './eligibility-approval/eligibility-approval.component';
import { EnachresendComponent } from './enachresend/enachresend.component';
import { ChargeBulkUploadComponent } from './charge-bulk-upload/charge-bulk-upload.component';
import { CollectionPresentationComponent } from './collection-presentation/collection-presentation.component';
import { WaiverEntryComponent } from './waiver-entry/waiver-entry.component';
import { WaiverApprovalComponent } from './waiver-approval/waiver-approval.component';
import { NOCComponent } from './noc/noc.component';
import { InsuranceComponent } from './insurance/insurance.component';
import { CollectionUploadComponent } from '../../pages/collection-upload/collection-upload.component';
import { EnachpresComponent } from './enachpres/enachpres.component';
import { DisbursexcelComponent } from './disbursexcel/disbursexcel.component';
import { EnachUploadComponent } from './enach-upload/enach-upload.component';
import { SanctionletterComponent } from './sanctionletter/sanctionletter.component';
import { SanctionreportComponent } from './sanctionreport/sanctionreport.component';
// import { IdentityverifyComponent } from './identityverify/identityverify.component';
// import { IdentityviewComponent } from './identityview/identityview.component';




const routes: Routes = [
  { path: 'eligible-customer-list', component: EligibleCustomerComponent, data: { breadcrumb: 'Eligible Customer List' }, pathMatch: 'full' },
  { path: 'customer-loan-list', component: CustomerLoanComponent, data: { breadcrumb: 'Customer Loan List' }, pathMatch: 'full' },
  { path: 'disbursement', component: DisbursementComponent, data: { breadcrumb: 'Disbursement Report' }, pathMatch: 'full' },
  { path: 'disbursement-details', component: DisbursementDetailsComponent, data: { breadcrumb: 'Disbursement Detail Report' }, pathMatch: 'full' },
  { path: 'collection', component: CollectionComponent, data: { breadcrumb: 'Collection Report' }, pathMatch: 'full' },
  { path: 'collection-details', component: CollectionDetailsComponent, data: { breadcrumb: 'Collection Detail Report' }, pathMatch: 'full' },
  // { path: 'outstanding', component: OutstandingComponent, data: { breadcrumb: 'Outstanding' }, pathMatch: 'full' },
  { path: 'acoount-statement', component: AccountStatementComponent, data: { breadcrumb: 'Account Statement' }, pathMatch: 'full' },
  { path: 'excel-export', component: ExportExcelComponent, data: { breadcrumb: 'Account Statement' }, pathMatch: 'full' },
  { path: 'due-list', component: DueListComponent, data: { breadcrumb: 'Due List' }, pathMatch: 'full' },
  { path: 'customer-wise', component: CustomerWiseComponent, data: { breadcrumb: 'Customer Outstanding Report' }, pathMatch: 'full' },
  { path: 'disbursement-report', component: DisbursementReportComponent, data: { breadcrumb: 'Disbursement Report' }, pathMatch: 'full' },
  { path: 'rbi-report', component: RbiReportComponent, data: { breadcrumb: 'RBI Report' }, pathMatch: 'full' },
  { path: 'e-nach-presentation', component: EnachPresentationComponent, data: { breadcrumb: 'E-Nach Presentation' }, pathMatch: 'full' },
  { path: 'e-nach-realisation', component: EnachRealisationComponent, data: { breadcrumb: 'E-Nach Realisation' }, pathMatch: 'full' },
  { path: 'eligibility-updation', component: EligibilityUpdateComponent, data: { breadcrumb: 'Eligibility Updation' }, pathMatch: 'full' },
  { path: 'collection-presentation', component: CollectionPresentationComponent, data: { breadcrumb: 'Collection Presentation' }, pathMatch: 'full' },
  { path: 'eligibility-approval', component: EligibilityApprovalComponent, data: { breadcrumb: 'Eligibility Approval' }, pathMatch: 'full' },
  { path: 'charge-bulk-upload', component: ChargeBulkUploadComponent, data: { breadcrumb: 'Charges bulk Upload' }, pathMatch: 'full' },
  { path: 'enach-resend', component: EnachresendComponent, data: { breadcrumb: 'ENach resend' }, pathMatch: 'full' },
  { path: 'bulk-upload', component: CollectionUploadComponent, data: { breadcrumb: 'Collection Upload' }, pathMatch: 'full' },
  { path: 'eligibility-approval', component: EligibilityApprovalComponent, data: { breadcrumb: 'Eligibility Approval' }, pathMatch: 'full' },
  { path: 'charge-bulk-upload', component: ChargeBulkUploadComponent, data: { breadcrumb: 'Charges bulk Upload' }, pathMatch: 'full' },
  { path: 'enach-resend', component: EnachresendComponent, data: { breadcrumb: 'ENach resend' }, pathMatch: 'full' },
  { path: 'waiver-entry', component: WaiverEntryComponent, data: { breadcrumb: 'Waiver Entry' }, pathMatch: 'full' },
  { path: 'waiver-approval', component: WaiverApprovalComponent, data: { breadcrumb: 'Waiver Approval' }, pathMatch: 'full' },
  { path: 'noc', component: NOCComponent, data: { breadcrumb: 'NOC' }, pathMatch: 'full' },
  { path: 'enach-upload',component:EnachUploadComponent, data: { breadcrumb: 'Enach Upload'}, pathMatch: 'full'},
  { path: 'insurance', component: InsuranceComponent, data: { breadcrumb: 'Insurance' }, pathMatch: 'full' },
  {path:'enachinternalapi',component:EnachpresComponent,data: { breadcrumb: 'Insurance' }, pathMatch: 'full'},
  {path:'disbexcl',component:DisbursexcelComponent,data: { breadcrumb: 'Disburse Upload' }, pathMatch: 'full'},
  {path:'sanctionletter',component:SanctionletterComponent,data: { breadcrumb: 'Sanction Letter' }, pathMatch: 'full'},
  {path:'sanctionurl',component:SanctionreportComponent,data: { breadcrumb: 'Sanction Letter Report' }, pathMatch: 'full'},
   

  // {path:'identity-verify',component:IdentityverifyComponent,data: { breadcrumb: 'Identity Verify' }, pathMatch: 'full'},
  // {path:'identity-view',component:IdentityviewComponent,data: { breadcrumb: 'Identity view' }, pathMatch: 'full'}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
