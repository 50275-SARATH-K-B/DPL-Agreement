import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportRoutingModule } from './report-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CamReportComponent } from './cam-report/cam-report.component';
import { EligibleCustomerComponent } from './eligible-customer/eligible-customer.component';
import { CustomerLoanComponent } from './customer-loan/customer-loan.component';
import { DisbursementComponent } from './disbursement/disbursement.component';
import { DisbursementDetailsComponent } from './disbursement-details/disbursement-details.component';
import { CollectionComponent } from './collection/collection.component';
import { CollectionDetailsComponent } from './collection-details/collection-details.component';
// import { OutstandingComponent } from './outstanding/outstanding.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ExportExcelComponent } from './export-excel/export-excel.component';
// import { DueListComponent } from './due-list/due-list.component';
// import { CustomerWiseComponent } from './customer-wise/customer-wise.component';
import { DisbursementReportComponent } from './disbursement-report/disbursement-report.component';
import { RbiReportComponent } from './rbi-report/rbi-report.component';
import {AppModule} from '../../app.module';
import { EnachresendComponent } from './enachresend/enachresend.component';
import { ChargeBulkUploadComponent } from './charge-bulk-upload/charge-bulk-upload.component';
import { LoanAgreementComponent } from './loan-agreement/loan-agreement.component';
import { RouterModule } from '@angular/router';
import { EnachpresComponent } from './enachpres/enachpres.component';
import { FileviewerComponent } from './fileviewer/fileviewer.component';
import { SanctionletterComponent } from './sanctionletter/sanctionletter.component';
import { CustomerremovalComponent } from './customerremoval/customerremoval.component';
// import { AadharmaskingComponent } from './aadharmasking/aadharmasking.component';
import { IdentityverifyComponent } from './identityverify/identityverify.component';
import { IdentityviewComponent } from './identityview/identityview.component';
import { AadharmaskingComponent } from './aadharmasking/aadharmasking.component';
import { SanctionreportComponent } from './sanctionreport/sanctionreport.component';
import { NOCComponent } from './noc/noc.component';
import { CollectionuploadComponent } from './collectionupload/collectionupload.component';
import { CsedataComponent } from './csedata/csedata.component';
import { AllocationdataComponent } from './allocationdata/allocationdata.component';
import { KycstatusComponent } from './kycstatus/kycstatus.component';
import { EligibilitydatauploadComponent } from './eligibilitydataupload/eligibilitydataupload.component';
import { KycVerifiedStatusComponent } from '../../Report/report/kyc-verified-status/kyc-verified-status.component';
import { KycVerificationComponent } from '../../Report/report/kyc-verification/kyc-verification.component';
import { KycViewComponent } from '../../Report/report/kyc-view/kyc-view.component';
import { EnachreportssComponent } from './enachreportss/enachreportss.component';
import { LoanAccountStatusComponent } from '../../Report/report/loan-account-status/loan-account-status.component';
import { SchemeCreationComponent } from './scheme-creation/scheme-creation.component';
import { SchemeCreationDashboardComponent } from './scheme-creation-dashboard/scheme-creation-dashboard.component';
import { SchemeCreationApprovalComponent } from './scheme-creation-approval/scheme-creation-approval.component';
import { SchemeCreationViewComponent } from './scheme-creation-view/scheme-creation-view.component';
import { LoanAccountApprovalComponent } from '../../Report/report/loan-account-approval/loan-account-approval.component';
import { LoanAccntReqViewComponent } from '../../Report/report/loan-accnt-req-view/loan-accnt-req-view.component';
import { LoanAccountStatusDashboardComponent } from '../../Report/report/loan-account-status-dashboard/loan-account-status-dashboard.component';
import {MatChipsModule} from '@angular/material/chips';
// import { IdentityviewComponent } from './identityview/identityview.component';



@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    RouterModule,
    MatChipsModule
  ],
  declarations: [ 
    CamReportComponent,
    EligibleCustomerComponent,
    CustomerLoanComponent,
    DisbursementComponent,
    DisbursementDetailsComponent,
    CollectionComponent,
    CollectionDetailsComponent,
    // OutstandingComponent,
    AccountStatementComponent,
    ExportExcelComponent,
    // DueListComponent,
    // CustomerWiseComponent,
    // DisbursementReportComponent,
    // RbiReportComponent,
    // CollectionUploadComponent,
    LoanAgreementComponent,
    SanctionletterComponent,
    CustomerremovalComponent,
    AadharmaskingComponent,
    IdentityverifyComponent,
    IdentityviewComponent,
    SanctionreportComponent,
    CollectionuploadComponent,
    CsedataComponent,
    AllocationdataComponent,
    KycstatusComponent,
    EligibilitydatauploadComponent,
    KycVerifiedStatusComponent,
    KycVerificationComponent,
    KycViewComponent,
    EnachreportssComponent,
    LoanAccountStatusComponent,
    SchemeCreationComponent,
    SchemeCreationDashboardComponent,
    SchemeCreationApprovalComponent,
    SchemeCreationViewComponent,
    LoanAccountApprovalComponent,
    LoanAccntReqViewComponent,
    LoanAccountStatusDashboardComponent
    // FileviewerComponent,
    
    // EnachpresComponent,
    
    
    

    // EnachresendComponent,

  ],
  exports: [CamReportComponent],
  providers: [CamReportComponent ]
})
export class ReportModule { }
