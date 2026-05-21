import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { LeadsDashboardComponent } from './pages/leads-dashboard/leads-dashboard.component';
import { AuthGuard } from './theme/guards/auth.guard';
import { CashrecieptComponent } from './autoprint/cashreciept/cashreciept.component';
import { AccountStatementInstallmentScheduleComponent } from './pages/reports/account-statement-installment-schedule/account-statement-installment-schedule.component';
import { CollectionReportComponent } from './pages/reports/collection-report/collection-report.component';
import { LoanDashboardComponent } from './pages/loan-dashboard/loan-dashboard.component';
import { ApplicationStatusDashboardComponent } from './pages/application-status-dashboard/application-status-dashboard.component';
import { MannualEntryComponent } from './pages/mannual-entry/mannual-entry.component';
import { ReportTestComponent } from './personal-loan/report-test/report-test.component';
import { ReportsSearchComponent } from './pages/report-search/reports-search/reports-search.component';
import { MISreportCheckComponent } from './personal-loan/report-details/misreport-check.component';
import { InstallmentReceiptComponent } from './personal-loan/installment-receipt/installment-receipt.component';
import { SettlementComponent } from './personal-loan/settlement/settlement.component';
import { DetailedStatementAccountComponent } from './personal-loan/detailed-statement-account/detailed-statement-account.component';

import { ChartComponent } from './personal-loan/report-details/chart/chart.component';
import { ManualEntryComponent } from './LMS/repayment/manual-entry/manual-entry.component';
import { DisbursementCancelApprovalComponent } from './personal-loan/disbursement-cancel-approval/disbursement-cancel-approval.component';
import { DisbursementCancelComponent } from './personal-loan/disbursement-cancel/disbursement-cancel.component';
import { PayuUpdationComponent} from './personal-loan/payu-updation/payu-updation.component';
import { AgreementComponent } from './personal-loan/agreement/agreement.component';


import { from } from 'rxjs';
import { DownloadAgreementComponent } from './personal-loan/download-agreement/download-agreement.component';
import { NoticeComponent } from './personal-loan/notice/notice.component';
import { EnachPresentationComponent } from './Report/report/enach-presentation/enach-presentation.component';
import { EnachRealisationComponent } from './Report/report/enach-realisation/enach-realisation.component';
import { ManualEntryApprovalComponent } from './LMS/repayment/manual-entry-approval/manual-entry-approval.component';
import { EnachApprovalComponent } from './Report/report/enach-approval/enach-approval.component';
import { DeclarationComponent } from './personal-loan/declaration/declaration.component';
import { EligibilityUpdateComponent } from './Report/report/eligibility-update/eligibility-update.component';
import { EligibilityApprovalComponent } from './Report/report/eligibility-approval/eligibility-approval.component';
import { EnachresendComponent } from './Report/report/enachresend/enachresend.component';
import { ChargeBulkUploadComponent } from './Report/report/charge-bulk-upload/charge-bulk-upload.component';
import { CollectionPresentationComponent } from './Report/report/collection-presentation/collection-presentation.component';
import { CollectionUploadComponent } from './pages/collection-upload/collection-upload.component';
import { EnachUploadComponent } from './Report/report/enach-upload/enach-upload.component';
import { WaiverEntryComponent } from './Report/report/waiver-entry/waiver-entry.component';
import { WaiverApprovalComponent } from './Report/report/waiver-approval/waiver-approval.component';
import { NOCComponent } from './Report/report/noc/noc.component';
import { OutstandingComponent } from './Report/report/outstanding/outstanding.component';
import { MaindeclarationComponent } from './pages/maindeclaration/maindeclaration.component';
import { InsuranceComponent } from './Report/report/insurance/insurance.component';
import { DueListComponent } from './Report/report/due-list/due-list.component';
import { CustomerWiseComponent } from './Report/report/customer-wise/customer-wise.component';
import { DisbursementReportComponent } from './Report/report/disbursement-report/disbursement-report.component';
import { RbiReportComponent } from './Report/report/rbi-report/rbi-report.component';
import { EnachpresComponent } from './Report/report/enachpres/enachpres.component';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { DashboardsecondComponent } from './Report/report/branchdashboard/dashboardsecond/dashboardsecond.component';
import { DashboardfirstComponent } from './Report/report/dashboardfirst/dashboardfirst.component';
import { EnachtestComponent } from './Report/report/enachtest/enachtest.component';
import { EnachlinkComponent } from './Report/report/enachlink/enachlink.component';


import { AuthbranchService } from './theme/guards/authbranch.service';
import { BranchdashboardModule } from './Report/report/branchdashboard/branchdashboard.module';
import { BranchdashboardRoutingModule } from './Report/report/branchdashboard/branchdashboard-routing.module';
import { Pages2Component } from './Report/report/branchdashboard/pages2/pages2.component';
import { PagescommonComponent } from './Report/report/branchdashboard/pagescommon/pagescommon.component';
import { DisbursexcelComponent } from './Report/report/disbursexcel/disbursexcel.component';
import { PayuuploadComponent } from './Report/payuupload/payuupload.component';
import { SanctionletterComponent } from './Report/report/sanctionletter/sanctionletter.component';
import { ExceluploadComponent } from './Report/report/excelupload/excelupload.component';
import { KycupdationComponent } from './pages/kycupdation/kycupdation.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { CustomerremovalComponent } from './Report/report/customerremoval/customerremoval.component';
import { IdentityverifyComponent } from './Report/report/identityverify/identityverify.component';
import { IdentityviewComponent } from './Report/report/identityview/identityview.component';
import { AadharmaskingComponent } from './Report/report/aadharmasking/aadharmasking.component';
import { EligibilityforloopupComponent } from './eligibilityforloopup/eligibilityforloopup.component';
import { SanctionreportComponent } from './Report/report/sanctionreport/sanctionreport.component';
import { SoaComponent } from './soa/soa.component';
import { CollectionuploadComponent } from './Report/report/collectionupload/collectionupload.component';
import { CsedataComponent } from './Report/report/csedata/csedata.component';
import { AllocationdataComponent } from './Report/report/allocationdata/allocationdata.component';
import { KycstatusComponent } from './Report/report/kycstatus/kycstatus.component';
import { EligibilitydatauploadComponent } from './Report/report/eligibilitydataupload/eligibilitydataupload.component';
import { KycVerifiedStatusComponent } from './Report/report/kyc-verified-status/kyc-verified-status.component';
import { KycVerificationComponent } from './Report/report/kyc-verification/kyc-verification.component';
import { KycViewComponent } from './Report/report/kyc-view/kyc-view.component';
import { NewangComponent } from './newang/newang.component';
import { EnachreportssComponent } from './Report/report/enachreportss/enachreportss.component';
import { LoanAccountStatusComponent } from './Report/report/loan-account-status/loan-account-status.component';
import { SchemeCreationComponent } from './Report/report/scheme-creation/scheme-creation.component';
import { SchemeCreationDashboardComponent } from './Report/report/scheme-creation-dashboard/scheme-creation-dashboard.component';
import { SchemeCreationApprovalComponent } from './Report/report/scheme-creation-approval/scheme-creation-approval.component';
import { LoanAccountApprovalComponent } from './Report/report/loan-account-approval/loan-account-approval.component';
import { LoanAccntReqViewComponent } from './Report/report/loan-accnt-req-view/loan-accnt-req-view.component';
import { LoanAccountStatusDashboardComponent } from './Report/report/loan-account-status-dashboard/loan-account-status-dashboard.component';
import { CollRevComponent } from './coll-rev/coll-rev.component';
import { DueDateChangeComponent } from './due-date-change/due-date-change.component';
import { DueDateChangeApprovalComponent } from './due-date-change-approval/due-date-change-approval.component';
import { SettlementNewComponent } from './settlement-new/settlement-new.component';
import { DigioesignComponent } from './due-date-change/digioesign/digioesign.component';
import { CollapprComponent } from './collappr/collappr.component';
import { SettlementapprComponent } from './settlementappr/settlementappr.component';
import { RejectapprComponent } from './rejectappr/rejectappr.component';
import { NocreportComponent } from './nocreport/nocreport.component';
import { SalesempUploadComponent } from './salesemp-upload/salesemp-upload.component';
import { DeathstatusreqComponent } from './deathstatusreq/deathstatusreq.component';
import { DeathstatusapprComponent } from './deathstatusappr/deathstatusappr.component';
import { SettlementBlockComponent } from './settlement-block/settlement-block.component';
import { SettlementBlockApprComponent } from './settlement-block-appr/settlement-block-appr.component';
import { InsuranceUploadComponent } from './insurance-upload/insurance-upload.component';
import { DeathreportComponent } from './deathreport/deathreport.component';
import { WelcomeLetterReportComponent } from './welcome-letter-report/welcome-letter-report.component';
import { WelcomeLetterComponent } from './welcome-letter/welcome-letter.component';
import { TimeoutcomponentComponent } from './timeoutcomponent/timeoutcomponent.component';
import { AlmdataComponent } from './almdata/almdata.component';
import { BillingCheckerComponent } from './billing-checker/billing-checker.component';
import { BillingCheckerDashboardComponent } from './billing-checker-dashboard/billing-checker-dashboard.component';
import { BillingCheckerReportComponent } from './billing-checker-report/billing-checker-report.component';
import { PayuVerifyComponent } from './personal-loan/payu-verify/payu-verify.component';
import { PayurequestComponent } from './personal-loan/payurequest/payurequest.component';
import { CliamreqestComponent } from './cliamreqest/cliamreqest.component';
import { CliamapprovalComponent } from './cliamapproval/cliamapproval.component';
import { LoansettletclaimreqComponent } from './loansettletclaimreq/loansettletclaimreq.component';
import { LoansettletclaimapprComponent } from './loansettletclaimappr/loansettletclaimappr.component';
import { NewsettlementrequestComponent } from './newsettlementrequest/newsettlementrequest.component';
import { NewsettlementapprovalComponent } from './newsettlementapproval/newsettlementapproval.component';
import { LoanAgreementComponent } from './loan-agreement/loan-agreement.component';

export const routes: Routes = [
    
    {
        path: 'dashboard',
        component: PagesComponent, children: [

            { path: '', loadChildren: 'app/pages/dashboard/dashboard.module#DashboardModule', data: { breadcrumb: 'Dashboard' } },
            { path: 'dashboard', component: BlankComponent, data: { breadcrumb: 'Dashboard' } },
            { path: 'application-status-dashboard/:id', component: ApplicationStatusDashboardComponent, data: { breadcrumb: 'Application Status Dashboard' } },
            { path: 'LoanDashboard', component: LoanDashboardComponent, data: { breadcrumb: 'Loan Dashboard' } },
            { path: 'LeadDashboard', component: LeadsDashboardComponent, data: { breadcrumb: 'Lead Dashboard' } },
        ], canActivate: [AuthGuard]
    },
    

    {
        path: 'entry',
        component: PagesComponent, children: [
            { path: 'manual', component: MannualEntryComponent, data: { breadcrumb: 'Manual Entry' } },
        ], canActivate: [AuthGuard]
    },
    
{

    path:'branchboard',
    component: Pages2Component, children: [
    {path: 'dashboard2', component: DashboardsecondComponent, data: { breadcrumb: 'Dashboard' } },
    ], canActivate: [AuthGuard]
    

},

    {
        path: 'personal-report',
        component: PagesComponent, children: [
            { path: 'dashboard1', component: DashboardfirstComponent },
            { path: 'test', component: ReportTestComponent, data: { breadcrumb: 'Personal Test' } },
            { path: 'report', component: MISreportCheckComponent, data: { breadcrumb: 'MIS REPORT' } },
            { path: 'detail-account-statement', component: DetailedStatementAccountComponent, data: { breadcrumb: 'ACCOUNT STATEMENT' } },
            { path: 'disbursement-cancel-approval', component: DisbursementCancelApprovalComponent, data: { breadcrumb: 'Disbursement Cancel Approval' } },
            { path: 'disbursement-cancel-request', component: DisbursementCancelComponent, data: { breadcrumb: 'Disbursement Cancel' } },
            { path: 'payu-updation', component: PayuUpdationComponent, data: { breadcrumb: 'PayU Updation' } },
            { path: 'agreement', component: AgreementComponent, data: { breadcrumb: 'Agreement' } },
            { path: 'agreement-download', component: DownloadAgreementComponent, data: { breadcrumb: 'AGREEMENT DOWNLOAD' } },
            { path: 'arbitration-report', component: NoticeComponent, data: { breadcrumb: 'Arbitration Report' } },
            { path: 'declaration', component: DeclarationComponent, data: { breadcrumb: 'Declaration' } },
            { path: 'e-nach-presentation', component: EnachPresentationComponent, data: { breadcrumb: 'E-Nach Presentation' } },
            { path: 'e-nach-realisation', component: EnachRealisationComponent, data: { breadcrumb: 'E-Nach Realisation' } },
            { path: 'eligibility-updation', component: EligibilityUpdateComponent, data: { breadcrumb: 'Eligibility Updation' } },
            { path: 'eligibility-approval', component: EligibilityApprovalComponent, data: { breadcrumb: 'Eligibility Approval' } },
            { path: 'charge-bulk-upload', component: ChargeBulkUploadComponent, data: { breadcrumb: 'Charges Bulk Upload' } },
            { path: 'e-nach-disbursement-approval', component: EnachApprovalComponent, data: { breadcrumb: 'E-Nach Disbursement Approval' } },
            { path: 'enach-resend', component: EnachresendComponent, data: { breadcrumb: 'E-Nach Resend ' } },
            { path: 'collection-presentation', component: CollectionPresentationComponent, data: { breadcrumb: 'Collection Presentation ' } },
            { path: 'bulk-upload', component: CollectionUploadComponent, data: { breadcrumb: 'bulk Upload ' } },
            { path: 'enach-upload',component:EnachUploadComponent, data: { breadcrumb: 'enach upload'}},
            { path: 'waiver-entry', component: WaiverEntryComponent, data: { breadcrumb: 'Waiver Entry' } },
            { path: 'waiver-approval', component: WaiverApprovalComponent, data: { breadcrumb: 'Waiver Approval' } },
            { path: 'noc', component: NOCComponent, data: { breadcrumb: 'NOC' } },
            { path: 'outstanding', component: OutstandingComponent, data: { breadcrumb: 'Outstanding' }, pathMatch: 'full' },
            { path: 'insurance', component: InsuranceComponent, data: { breadcrumb: 'Insurance' }, pathMatch: 'full' },
            { path: 'customer-wise', component: CustomerWiseComponent, data: { breadcrumb: 'Customer Outstanding Report' }, pathMatch: 'full' },
            { path: 'disbursement-report', component: DisbursementReportComponent, data: { breadcrumb: 'Disbursement Report' }, pathMatch: 'full' },
            { path: 'rbi-report', component: RbiReportComponent, data: { breadcrumb: 'RBI Report' }, pathMatch: 'full' },
            { path:'enachinternalapi',component:EnachpresComponent,data: { breadcrumb: 'Enach Presentation' }, pathMatch: 'full'},
            { path:'testvalue',component:EnachtestComponent,data:{breadcrump:'test'},pathMatch:'full'},
            { path:'enachlink',component:EnachlinkComponent,data:{breadcrump:'test'},pathMatch:'full'},
            { path: 'manual-entry', component: ManualEntryComponent, data: { breadcrumb: 'MANUAL ENTRY REQUEST' }, pathMatch: 'full' },
            { path: 'disbexcl', component: DisbursexcelComponent, data: { breadcrumb: 'Disburse Upload' }, pathMatch: 'full' },
            { path: 'excelupload', component: ExceluploadComponent, data: { breadcrumb: 'Charge Upload' }, pathMatch: 'full' },
            { path: 'payuupload', component: PayuuploadComponent, data: { breadcrumb: 'PayU Upload' }, pathMatch: 'full' },
            { path: 'sanction-letter', component: SanctionletterComponent, data: { breadcrumb: 'Sanction Letter' }, pathMatch: 'full' },
            { path:'customer-removal',component:CustomerremovalComponent,data:{breadcrumb:'Customer Removal'},pathMatch:'full'},
            { path:'identity-verify',component:IdentityverifyComponent,data: { breadcrumb: 'Identity Verify' }, pathMatch: 'full'},
            { path:'identity-view',component:IdentityviewComponent,data: { breadcrumb: 'Identity view' }, pathMatch: 'full'},
            { path:'aadar-masking',component:AadharmaskingComponent,data: { breadcrumb: 'Aadhar Masking' }, pathMatch: 'full'},
            { path:'eleigibi-for',component:EligibilityforloopupComponent,data: { breadcrumb: 'Eligibility Updation2' }, pathMatch: 'full'},
            { path:'sanctionurl',component:SanctionreportComponent,data: { breadcrumb: 'Sanction Letter Report' }, pathMatch: 'full'},
            { path:'soa',component:SoaComponent,data: { breadcrumb: 'SOA' }, pathMatch: 'full'},
            { path:'collection-upload',component:CollectionuploadComponent,data: { breadcrumb: 'Collection Upload' }, pathMatch: 'full'},
            { path:'cse-data',component:CsedataComponent,data: { breadcrumb: 'CSE Data Upload' }, pathMatch: 'full'},
            { path:'allocation-data',component:AllocationdataComponent,data: { breadcrumb: 'Customer Data for Allocation' }, pathMatch: 'full'},
            { path:'kyc-status',component:KycstatusComponent,data: { breadcrumb: 'KYC Status' }, pathMatch: 'full'},
            { path:'eligible-dataupload',component:EligibilitydatauploadComponent,data: { breadcrumb: 'Eligible Data Upload' }, pathMatch: 'full'},
            { path:'kyc-verification-status',component:KycVerifiedStatusComponent,data: { breadcrumb: 'KYC Status Report' }, pathMatch: 'full'},
            { path:'kyc-verification',component:KycVerificationComponent,data: { breadcrumb: 'KYC Verification' }, pathMatch: 'full'},
            { path:'kyc-view',component:KycViewComponent,data: { breadcrumb: 'Identity view' }, pathMatch: 'full'},
            { path:'new-angular',component:NewangComponent,data: { breadcrumb: 'Identity view' }, pathMatch: 'full'},
            { path:'enach-reports',component:EnachreportssComponent,data: { breadcrumb: 'Enach Reports' }, pathMatch: 'full'},
            { path: 'coll-rev', component: CollRevComponent, data: { breadcrumb: 'Personal Test' } },
            { path: 'coll-rev-appr', component: CollapprComponent, data: { breadcrumb: 'Personal Test' } },

            { path:'due-date-change',component:DueDateChangeComponent,data: { breadcrumb: 'Due Date Change' }, pathMatch: 'full'},
            { path:'due-approval',component:DueDateChangeApprovalComponent,data: { breadcrumb: 'Due-approval' }, pathMatch: 'full'},
            { path:'loan-account-status',component:LoanAccountStatusComponent,data: { breadcrumb: 'Death Account Status Request' }, pathMatch: 'full'},
            { path:'schemeCreation',component:SchemeCreationComponent,data: { breadcrumb: 'Scheme Creation' }, pathMatch: 'full'},
            { path:'SchemeDashboard',component:SchemeCreationDashboardComponent,data: { breadcrumb: 'Scheme Creation Dashboard' }, pathMatch: 'full'},
            { path:'SchemeApproval',component:SchemeCreationApprovalComponent,data: { breadcrumb: 'Scheme Creation Approval' }, pathMatch: 'full'},
            { path:'loan-account-approval',component:LoanAccountApprovalComponent,data: { breadcrumb: 'Death Account Approval' }, pathMatch: 'full'},
            { path:'req-view',component:LoanAccntReqViewComponent,data: { breadcrumb: 'Death Account View' }, pathMatch: 'full'},
            { path:'loan-account-dashboard',component:LoanAccountStatusDashboardComponent,data: { breadcrumb: 'Death Account Status Dashboard' }, pathMatch: 'full'},
            { path:'digio-sign',component:DigioesignComponent,data: { breadcrumb: 'Loan Account Status Dashboard' }, pathMatch: 'full'},
            { path:'approve-de',component:RejectapprComponent,data: { breadcrumb: 'Loan Account Status Dashboard' }, pathMatch: 'full'},
            { path:'noc-reports',component:NocreportComponent,data: { breadcrumb: 'NOC Reports' }, pathMatch: 'full'},
            { path:'sales-empdata',component:SalesempUploadComponent,data: { breadcrumb: 'Sales Emp Upload' }, pathMatch: 'full'},
            { path:'Death-Request',component:DeathstatusreqComponent,data: { breadcrumb: 'Death Status Request' }, pathMatch: 'full'},
            { path:'Death-Approve',component:DeathstatusapprComponent,data: { breadcrumb: 'Death Status Approval' }, pathMatch: 'full'},
            { path:'Insurance-upload',component:InsuranceUploadComponent,data: { breadcrumb: 'Insurance Upload' }, pathMatch: 'full'},
            { path:'Death-report',component:DeathreportComponent,data: { breadcrumb: 'Death Report' }, pathMatch: 'full'},
            { path:'welcome-letter',component:WelcomeLetterComponent,data: { breadcrumb: 'Welcome Letter' }, pathMatch: 'full'},
            { path:'welcome-letter-report',component:WelcomeLetterReportComponent,data: { breadcrumb: 'Welcome Letter Report' }, pathMatch: 'full'},
            { path:'alm-report',component:AlmdataComponent,data: { breadcrumb: 'ALM RBI Report' }, pathMatch: 'full'},
            { path:'billing-checker',component:BillingCheckerComponent,data: { breadcrumb: 'Billing Checker' }, pathMatch: 'full'},
            { path:'billing-checker-dashboard',component:BillingCheckerDashboardComponent,data: { breadcrumb: 'Billing Checker Dashboard' }, pathMatch: 'full'},
            { path:'billing-checker-report',component:BillingCheckerReportComponent,data: { breadcrumb: 'Billing Checker Report' }, pathMatch: 'full'},
            { path:'payu-verify',component:PayuVerifyComponent,data: { breadcrumb: 'Payu Verification' }, pathMatch: 'full'},
            { path:'payu-request',component:PayurequestComponent,data: { breadcrumb: 'Payu Request' }, pathMatch: 'full'},
            { path:'claim-updation',component:CliamreqestComponent,data: { breadcrumb: 'Claim Updation Request' }, pathMatch: 'full'},
            { path:'claim-approval',component:CliamapprovalComponent,data: { breadcrumb: 'Claim Updation Approval' }, pathMatch: 'full'},


        ], canActivate: [AuthGuard]
    },

    {
        path: 'post-dated-entries',
        component: PagesComponent, children: [
            { path: '', loadChildren: 'app/LMS/post-dated-entries/post-dated-entries.module#PostDatedEntriesModule', data: { breadcrumb: 'Loan Application' } },
        ], canActivate: [AuthGuard]
    },

    {
        path: 'report',
        component: PagesComponent, children: [
            { path: 'due-list', component: DueListComponent, data: { breadcrumb: 'Due-List' } },
            { path: '', loadChildren: 'app/Report/report/report.module#ReportModule', data: { breadcrumb: 'Reports' } },
        ], canActivate: [AuthGuard]
    },

    {
        path: 'repayment',
        component: PagescommonComponent, children: [
            { path: 'installment-receipt', component: InstallmentReceiptComponent, data: { breadcrumb: 'Installment Receipt' } },
            { path: 'settlement', component: SettlementComponent, data: { breadcrumb: 'Settlement' } },
            { path:'settlement-new',component:SettlementNewComponent,data: { breadcrumb: 'Settlement' }, pathMatch: 'full'},
            { path:'settlement-apprv',component:SettlementapprComponent,data: { breadcrumb: 'Settlement Approval' }, pathMatch: 'full'},
            { path:'settlement-block',component:SettlementBlockComponent,data: { breadcrumb: 'Settlement Block' }, pathMatch: 'full'},
            { path:'settlement-block-appr',component:SettlementBlockApprComponent,data: { breadcrumb: 'Settlement Block Approval' }, pathMatch: 'full'},
            { path:'settlement-claim-req',component:LoansettletclaimreqComponent,data: { breadcrumb: 'Settlement Claim Request' }, pathMatch: 'full'},
            { path:'settlement-claim-appr',component:LoansettletclaimapprComponent,data: { breadcrumb: 'Settlement Claim Approval' }, pathMatch: 'full'},
            { path:'new-settlement-request',component:NewsettlementrequestComponent,data: { breadcrumb: 'New Settlement Request' }, pathMatch: 'full'},
            { path:'new-settlement-approval',component:NewsettlementapprovalComponent,data: { breadcrumb: 'New Settlement Approval' }, pathMatch: 'full'},
            { path:'Loan-Agreement',component:LoanAgreementComponent,data: { breadcrumb: 'Loan-Agreement' }, pathMatch: 'full'},


            // { path: 'manual-entry-request', component: ManualEntryComponent, data: { breadcrumb: 'MANUAL ENTRY REQUEST' }, pathMatch: 'full' },
            // { path: 'manual-entry-approval', component: ManualEntryApprovalComponent, data: { breadcrumb: 'MANUAL ENTRY APPROVAL' }, pathMatch: 'full' },
            { path: 'installment-schedule-account-statement', component: AccountStatementInstallmentScheduleComponent, data: { breadcrumb: 'Account Statement/Installment Schedule' } },

        ],canActivate: [AuthGuard]
    },
    {

        path: 'moratorium',
        component: PagesComponent, children: [
            { path: '', loadChildren: 'app/LMS/moratorium/moratorium.module#MoratoriumModule', data: { breadcrumb: 'Moratorium' } },
        ], canActivate: [AuthGuard]
    },
    {
        path: 'payment-restructuring',
        component: PagesComponent, children: [
            { path: '', loadChildren: 'app/LMS/payment-restructuring/payment-restructuring.module#PaymentRestructuringModule', data: { breadcrumb: 'Payment Restructuring' } },
        ], canActivate: [AuthGuard]
    },
    {
        path: 'charges',
        component: PagesComponent, children: [
            { path: '', loadChildren: 'app/LMS/charges/charges.module#ChargesModule', data: { breadcrumb: 'Charges' } },
        ], canActivate: [AuthGuard]
    },
    {
        path: 'autoprint',
        component: PagesComponent, children: [
            { path: 'cash-reciept', component: CashrecieptComponent, data: { breadcrumb: 'Cash Reciept' } },

        ], canActivate: [AuthGuard]
    },
    {
        path: 'reports',
        component: PagesComponent, children: [
            { path: 'collection-report', component: CollectionReportComponent, data: { breadcrumb: 'Collection Report' } },


        ], canActivate: [AuthGuard]
    },
    {
        path: 'report-search',
        component: PagesComponent, children: [
            { path: 'search', component: ReportsSearchComponent, data: { breadcrumb: 'Reports Search' } },
        ], canActivate: [AuthGuard]
    },
    { path: 'landing', loadChildren: 'app/pages/landing/landing.module#LandingModule' },
    { path: 'time-out',  component:TimeoutcomponentComponent,data: { breadcrumb: '' },pathMatch: 'full' },

    { path: 'maindeclaration', component:MaindeclarationComponent,data: { breadcrumb: 'Declaration' },pathMatch: 'full'},
    { path: 'privacypolicy', component:PrivacypolicyComponent,data: { breadcrumb: '' },pathMatch: 'full'},
    { path: 'login', loadChildren: 'app/pages/login/login.module#LoginModule' },
    { path: '', loadChildren: 'app/pages/login/login.module#LoginModule' },
    { path: 'register', loadChildren: 'app/pages/register/register.module#RegisterModule' },
    { path: 'error', component: ErrorComponent, data: { breadcrumb: 'Error' } },
    { path: '**', component: NotFoundComponent,pathMatch:'full' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    //preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    useHash: true,
    // onSameUrlNavigation: 'reload',
    onSameUrlNavigation: 'reload',

});
