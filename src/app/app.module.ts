import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { HttpClientModule, HTTP_INTERCEPTORS,HttpClient} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { registerLocaleData } from '@angular/common'; 
// import localeFr from '@angular/common/locales/fr';  
// registerLocaleData(localeFr, 'fr');
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true,
  suppressScrollX: true
};
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from './shared/shared.module';
import { PipesModule } from './theme/pipes/pipes.module';
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { PagesComponent } from './pages/pages.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ErrorComponent } from './pages/errors/error/error.component';
import { AppSettings } from './app.settings';
import { AlertService } from './theme/services/alert.service';
import { AuthGuard } from './theme/guards/auth.guard';
import { ErrorInterceptor } from './theme/helpers/error.interceptor';
import { JwtInterceptor } from './theme/helpers/jwt.interceptor';
import { AuthenticationService } from './pages/login/authentication.service';
import { SidenavComponent } from './theme/components/sidenav/sidenav.component';
import { VerticalMenuComponent } from './theme/components/menu/vertical-menu/vertical-menu.component';
import { HorizontalMenuComponent } from './theme/components/menu/horizontal-menu/horizontal-menu.component';
import { BreadcrumbComponent } from './theme/components/breadcrumb/breadcrumb.component';
import { FlagsMenuComponent } from './theme/components/flags-menu/flags-menu.component';
import { FullScreenComponent } from './theme/components/fullscreen/fullscreen.component';
import { ApplicationsComponent } from './theme/components/applications/applications.component';
import { MessagesComponent } from './theme/components/messages/messages.component';
import { UserMenuComponent } from './theme/components/user-menu/user-menu.component';
import { NumberOnlyDirective } from '../app/utils/validation-utils/number.directives';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AlertMessageComponenent } from './commoncomponents/alertpopup/alertpopup.component';
import { SuccessMessageComponenent } from './commoncomponents/successpopup/successpopup.component';
import { DirectivesModule } from './directives/directive.module';
import { ApplicationDashboardComponent } from './pages/application-dashboard/application-dashboard.component';
import { LeadsDashboardComponent } from './pages/leads-dashboard/leads-dashboard.component';
import { CashrecieptComponent } from './autoprint/cashreciept/cashreciept.component';
import { NumberToWordsPipe } from './custome-pipes/numbertoword.pipe';
import { AccountStatementInstallmentScheduleComponent } from './pages/reports/account-statement-installment-schedule/account-statement-installment-schedule.component';
import { CollectionReportComponent } from './pages/reports/collection-report/collection-report.component';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { InstructionMessageComponenent } from './commoncomponents/instructionpopup/instructionpopup.component';
import { LoanSearchComponent } from './common/loan-search/loan-search.component';
import { EmiCalculatorComponent } from './common/emi-calculator/emi-calculator.component';
import { CustomerSearchComponent } from './common/customer-search/customer-search.component';
import { UserSearchComponent } from './common/user-search/user-search.component';
import { UserLinkSearchComponent } from './common/user-link-search/user-link-search.component';
import { LoanDashboardComponent } from './pages/loan-dashboard/loan-dashboard.component';
import { ApplicationStatusDashboardComponent } from './pages/application-status-dashboard/application-status-dashboard.component';
import { ApplicantDetailsModalComponent } from './common/applicant-details-modal/applicant-details-modal.component';
import { SMSVerificationComponent } from './common/sms-verification/sms-verification.component';
import { SharedComponentModule } from './shared-component/shared-component.module';
import { MannualEntryComponent } from './pages/mannual-entry/mannual-entry.component';
import { ReportTestComponent } from './personal-loan/report-test/report-test.component';
import { jqxDataTableModule }   from 'jqwidgets-ng/jqxdatatable';
import { ReportsSearchComponent } from './pages/report-search/reports-search/reports-search.component';
import { MISreportCheckComponent } from './personal-loan/report-details/misreport-check.component';
import { DataChildComponent } from './personal-loan/report-details/data-child/data-child.component';
import { DetailAccountStatementComponent } from './personal-loan/detail-account-statement/detail-account-statement.component';
import { InstallmentReceiptComponent } from './personal-loan/installment-receipt/installment-receipt.component';
import { SettlementComponent } from './personal-loan/settlement/settlement.component';
import { DetailedStatementAccountComponent } from './personal-loan/detailed-statement-account/detailed-statement-account.component';
import { ChartComponent } from './personal-loan/report-details/chart/chart.component';
import { ManualEntryComponent } from './LMS/repayment/manual-entry/manual-entry.component';
import { DisbursementCancelComponent } from './personal-loan/disbursement-cancel/disbursement-cancel.component';
import { DisbursementCancelApprovalComponent } from './personal-loan/disbursement-cancel-approval/disbursement-cancel-approval.component';
import { PayuUpdationComponent } from './personal-loan/payu-updation/payu-updation.component';
import { AgreementComponent } from './personal-loan/agreement/agreement.component';
import { DownloadAgreementComponent } from './personal-loan/download-agreement/download-agreement.component';
import { NoticeComponent } from './personal-loan/notice/notice.component';
import { EnachRealisationComponent } from './Report/report/enach-realisation/enach-realisation.component';
import { EnachPresentationComponent } from './Report/report/enach-presentation/enach-presentation.component';
import {  EnachApprovalComponent} from './Report/report/enach-approval/enach-approval.component';
import { ManualEntryApprovalComponent } from './LMS/repayment/manual-entry-approval/manual-entry-approval.component';
import { DeclarationComponent } from './personal-loan/declaration/declaration.component';
import { EligibilityUpdateComponent } from './Report/report/eligibility-update/eligibility-update.component';
import { EligibilityApprovalComponent } from './Report/report/eligibility-approval/eligibility-approval.component';
import { EnachresendComponent } from './Report/report/enachresend/enachresend.component';
import { ChargeBulkUploadComponent, UploadStatusReportCharge } from './Report/report/charge-bulk-upload/charge-bulk-upload.component';
import { CollectionPresentationComponent } from './Report/report/collection-presentation/collection-presentation.component';
import { CollectionUploadComponent, UploadStatusReport } from './pages/collection-upload/collection-upload.component';
import { WaiverEntryComponent } from './Report/report/waiver-entry/waiver-entry.component';
import { WaiverApprovalComponent } from './Report/report/waiver-approval/waiver-approval.component';
import { NOCComponent } from './Report/report/noc/noc.component';
import { OutstandingComponent } from './Report/report/outstanding/outstanding.component';
import { MaindeclarationComponent } from './pages/maindeclaration/maindeclaration.component';
import { InsuranceComponent } from './Report/report/insurance/insurance.component';
import { RouterModule } from '@angular/router';
// import { DueListComponent } from './Report/report/due-list/due-list.component';
import { CustomerWiseComponent } from './Report/report/customer-wise/customer-wise.component';
import { DisbursementReportComponent } from './Report/report/disbursement-report/disbursement-report.component';
import { RbiReportComponent } from './Report/report/rbi-report/rbi-report.component';
import { DueListComponent } from './Report/report/due-list/due-list.component';
import { EnachpresComponent } from './Report/report/enachpres/enachpres.component';
import { DashboardsecondComponent } from './Report/report/branchdashboard/dashboardsecond/dashboardsecond.component';
import { DashboardfirstComponent } from './Report/report/dashboardfirst/dashboardfirst.component';
import { EnachtestComponent } from './Report/report/enachtest/enachtest.component';
import { EnachlinkComponent } from './Report/report/enachlink/enachlink.component';
import { BranchusermenuComponent } from './theme/components/branchusermenu/branchusermenu.component';
import { Pages2Component } from './Report/report/branchdashboard/pages2/pages2.component';
import { CommonusermenuComponent } from './theme/components/commonusermenu/commonusermenu.component';
import { PagescommonComponent } from './Report/report/branchdashboard/pagescommon/pagescommon.component';
import { DisbursexcelComponent } from './Report/report/disbursexcel/disbursexcel.component';
import { FileviewerComponent } from './Report/report/fileviewer/fileviewer.component';
import { ImageViewerModule } from "ngx-image-viewer";
import { CommonalertComponent } from './commoncomponents/commonalert/commonalert.component';
import { PayuuploadComponent } from './Report/payuupload/payuupload.component';
import { LoginModule } from '../app/pages/login/login.module';
import { EncrDecrServiceService } from './services/encr-decr-service.service';
import { ReportModule } from './Report/report/report.module';

import { ExceluploadComponent } from './Report/report/excelupload/excelupload.component';
import { EnachUploadComponent,EnachdialogReport, duplicationcheck} from './Report/report/enach-upload/enach-upload.component';
import { KycupdationComponent } from './pages/kycupdation/kycupdation.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import { TermsconditionsComponent } from './termsconditions/termsconditions.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import {NgxImageCompressService} from "ngx-image-compress";
import { PopupremarkComponent } from './popupremark/popupremark.component';
import { AadharmaskingComponent } from './Report/report/aadharmasking/aadharmasking.component';
import { EligibilityforloopupComponent } from './eligibilityforloopup/eligibilityforloopup.component';
import { SoaComponent } from './soa/soa.component';
import { SchemeCreationViewComponent } from './Report/report/scheme-creation-view/scheme-creation-view.component';
import { NewangComponent } from './newang/newang.component';
import { CollRevComponent } from './coll-rev/coll-rev.component';
import { RemarksReaderComponent } from './remarks-reader/remarks-reader.component';
import { ConfirmationPageComponent } from './confirmation-page/confirmation-page.component';
import { DueDateChangeComponent } from './due-date-change/due-date-change.component';
import { DueDateChangeApprovalComponent } from './due-date-change-approval/due-date-change-approval.component';
import { ReasonsearchComponent } from './reasonsearch/reasonsearch.component';
import { SettlementNewComponent } from './settlement-new/settlement-new.component';
import { DigioesignComponent } from './due-date-change/digioesign/digioesign.component';
import { CollapprComponent } from './collappr/collappr.component';
import { RejectapprComponent } from './rejectappr/rejectappr.component';
import { SettlementapprComponent } from './settlementappr/settlementappr.component';
import { SettlemntamtComponent } from './settlemntamt/settlemntamt.component';
import { ApprrejereasonComponent } from './apprrejereason/apprrejereason.component';
import { FileviewviewComponent } from './fileviewview/fileviewview.component';
import { FileviewComponent } from './commoncomponents/fileview/fileview.component';
import { NocreportComponent } from './nocreport/nocreport.component';
import { SalesempUploadComponent } from './salesemp-upload/salesemp-upload.component';
import { DeathstatusreqComponent } from './deathstatusreq/deathstatusreq.component';
import { DeathstatusapprComponent } from './deathstatusappr/deathstatusappr.component';
import { DeathpopupComponent } from './deathpopup/deathpopup.component';
import { SettlementBlockComponent } from './settlement-block/settlement-block.component';
import { SettlementBlockApprComponent } from './settlement-block-appr/settlement-block-appr.component';
import { InsuranceUploadComponent } from './insurance-upload/insurance-upload.component';
import { DeathreportComponent } from './deathreport/deathreport.component';
import { WelcomeLetterComponent } from './welcome-letter/welcome-letter.component';
import { WelcomeLetterReportComponent } from './welcome-letter-report/welcome-letter-report.component';
import { WelcomedownloadComponent } from './welcomedownload/welcomedownload.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { MomentModule } from 'angular2-moment';
import { TimeoutcomponentComponent } from './timeoutcomponent/timeoutcomponent.component';
import { AlmdataComponent } from './almdata/almdata.component'; // optional, provides moment-style pipes for date formatting
import { BillingCheckerComponent } from './billing-checker/billing-checker.component';
import { BillingCheckerDashboardComponent } from './billing-checker-dashboard/billing-checker-dashboard.component';
import { BillingCheckerReportComponent, DescriptionComponent } from './billing-checker-report/billing-checker-report.component';
import { PayuVerifyComponent } from './personal-loan/payu-verify/payu-verify.component';
import { PayurequestComponent } from './personal-loan/payurequest/payurequest.component';
import { CliamreqestComponent } from './cliamreqest/cliamreqest.component';
import { CliamapprovalComponent } from './cliamapproval/cliamapproval.component';
import { LoansettletclaimreqComponent } from './loansettletclaimreq/loansettletclaimreq.component';
import { LoansettletclaimapprComponent } from './loansettletclaimappr/loansettletclaimappr.component';
import { RefundsettlementComponent } from './refundsettlement/refundsettlement.component';
import { NewsettlementrequestComponent } from './newsettlementrequest/newsettlementrequest.component';
import { NewsettlementapprovalComponent } from './newsettlementapproval/newsettlementapproval.component';
import { environment } from '../environments/environment';
import { LoanAgreementComponent } from './loan-agreement/loan-agreement.component';
import { DownloadloanAgreementComponent } from './downloadloan-agreement/downloadloan-agreement.component';


@NgModule({
  imports: [
    NgIdleKeepaliveModule.forRoot(),
    MomentModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    PdfViewerModule,
    jqxDataTableModule,
    DirectivesModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule.forRoot(),
    AgmCoreModule.forRoot({ apiKey: environment.abdapiKey }),
    PerfectScrollbarModule,
    CalendarModule.forRoot(),
    SharedComponentModule,
    SharedModule,
    PipesModule,
    routing,
    HttpClientModule,
    RouterModule,
    LoginModule,
    ReportModule,
    AngularCropperjsModule,
    ImageViewerModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  declarations: [
    AppComponent,
    PagesComponent,
    BlankComponent,
    NotFoundComponent,
    ErrorComponent,
    SidenavComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    BreadcrumbComponent,
    FlagsMenuComponent,
    FullScreenComponent,
    ApplicationsComponent,
    MessagesComponent,
    UserMenuComponent,
    LeadsDashboardComponent,
    ApplicationDashboardComponent,
    NumberOnlyDirective,
    EmiCalculatorComponent,
    AlertMessageComponenent,
    InstructionMessageComponenent,
    SuccessMessageComponenent,
    CashrecieptComponent,
    NumberToWordsPipe,
    AccountStatementInstallmentScheduleComponent,
    CollectionReportComponent,
    CashrecieptComponent,
    NumberToWordsPipe,
    AccountStatementInstallmentScheduleComponent,
    CollectionReportComponent,
    FileviewComponent,
    LoanSearchComponent,
    CustomerSearchComponent,
    UserSearchComponent,
    UserLinkSearchComponent,
    LoanDashboardComponent,
    ApplicationStatusDashboardComponent,
    ApplicantDetailsModalComponent,
    SMSVerificationComponent,
    MannualEntryComponent,
    ReportTestComponent,
    ReportsSearchComponent,
    MISreportCheckComponent,
    DataChildComponent,
    DetailAccountStatementComponent,
    InstallmentReceiptComponent,
    SettlementComponent,
    DetailedStatementAccountComponent,
    ChartComponent,
    ManualEntryComponent,
    ManualEntryApprovalComponent,
    PayuUpdationComponent,
    DisbursementCancelComponent,
    DisbursementCancelApprovalComponent,
    AgreementComponent,
    DownloadAgreementComponent,
    NoticeComponent,
    EnachRealisationComponent,
    EnachPresentationComponent,
    EnachApprovalComponent,
    DeclarationComponent,
    EligibilityUpdateComponent,
    EligibilityApprovalComponent,
    EnachresendComponent,
    ChargeBulkUploadComponent ,
    UploadStatusReportCharge,
    CollectionPresentationComponent,
    CollectionUploadComponent,
    UploadStatusReport,
    WaiverEntryComponent,
    WaiverApprovalComponent,
    NOCComponent,
    OutstandingComponent,
    MaindeclarationComponent,
    InsuranceComponent,
    DueListComponent,
    CustomerWiseComponent,
    DisbursementReportComponent,
    RbiReportComponent,
    EnachpresComponent,
    EnachdialogReport,
    DashboardsecondComponent,
    DashboardfirstComponent,
    EnachtestComponent,
    EnachlinkComponent,
    BranchusermenuComponent,
    Pages2Component,
    CommonusermenuComponent,
    PagescommonComponent,
    DisbursexcelComponent,
    FileviewerComponent,
    CommonalertComponent,
    PayuuploadComponent,
    EnachUploadComponent,
    ExceluploadComponent,
    KycupdationComponent,
    PrivacypolicyComponent,
    TermsconditionsComponent,
    PopupremarkComponent,
    EligibilityforloopupComponent,
    SoaComponent,
    duplicationcheck,
    NewangComponent,
    CollRevComponent,
    RemarksReaderComponent,
    DueDateChangeComponent,
    DueDateChangeApprovalComponent,
    RemarksReaderComponent,
    ConfirmationPageComponent,
    ReasonsearchComponent,
    SettlementNewComponent,
    DigioesignComponent,
    CollapprComponent,
    RejectapprComponent,
    SettlementapprComponent,
    SettlemntamtComponent,
    ApprrejereasonComponent,
    FileviewviewComponent,
    NocreportComponent,
    SalesempUploadComponent,
    DeathstatusreqComponent,
    DeathstatusapprComponent,
    DeathpopupComponent,
    SettlementBlockComponent,
    SettlementBlockApprComponent,
    InsuranceUploadComponent,
    DeathreportComponent,
    WelcomeLetterComponent,
    WelcomeLetterReportComponent,
    WelcomedownloadComponent,
    TimeoutcomponentComponent,
    AlmdataComponent,
    BillingCheckerComponent,
    BillingCheckerDashboardComponent,
    BillingCheckerReportComponent,
    PayuVerifyComponent,
    DescriptionComponent,
    PayurequestComponent,
    CliamreqestComponent,
    CliamapprovalComponent,
    LoansettletclaimreqComponent,
    LoansettletclaimapprComponent,
    RefundsettlementComponent,
    NewsettlementrequestComponent,
    NewsettlementapprovalComponent,
    LoanAgreementComponent,
    DownloadloanAgreementComponent
    
    
  
  ],
  entryComponents: [
    DeathpopupComponent,
    FileviewviewComponent,
    DigioesignComponent,
    PopupremarkComponent,
    VerticalMenuComponent,
    AlertMessageComponenent,
    SuccessMessageComponenent,
    FileviewComponent,
    UserSearchComponent,
    UserLinkSearchComponent,
    LoanSearchComponent,
    EmiCalculatorComponent,
    CustomerSearchComponent,
    ApplicantDetailsModalComponent,
    UploadStatusReport,
    EnachdialogReport,
    CommonalertComponent,
    MaindeclarationComponent,
    AadharmaskingComponent,
    SchemeCreationViewComponent,
    duplicationcheck,
    RemarksReaderComponent,
    ConfirmationPageComponent,
    ReasonsearchComponent,
    WelcomeLetterComponent,
    WelcomedownloadComponent
    

  ],
  exports:[
    SMSVerificationComponent,
    MaindeclarationComponent
  ],
  providers: [
    AppSettings,
    NgxImageCompressService,
    EncrDecrServiceService,
    DatePipe, 
    AlertService,
    AuthenticationService,
    AuthGuard,
    AlertMessageComponenent,
    ApplicantDetailsModalComponent,
    LoanSearchComponent,
    EmiCalculatorComponent,
    CustomerSearchComponent,
    SMSVerificationComponent,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide:MatDialogRef , useValue:{} },

    { provide: MAT_DIALOG_DATA, useValue: {} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }