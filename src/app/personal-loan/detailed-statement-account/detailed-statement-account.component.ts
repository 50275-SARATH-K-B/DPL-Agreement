import { Component, OnInit } from '@angular/core';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/report/common.service';
import { ReportService } from '../../services/report/report.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detailed-statement-account',
  templateUrl: './detailed-statement-account.component.html',
  styleUrls: ['./detailed-statement-account.component.scss']
})
export class DetailedStatementAccountComponent implements OnInit {
  public settings: Settings;
  loanID: any;
  AddressList: any;
  MainHeader: any;
  ReportData: Object;
  ReportId: any;
  alignStatus: any;
  TablLoaneHeader: any;
  TLoandata: any[];
  TablCoAppListLeft: any;
  CoLoandata: any[];
  TableCoAppListLeftData: any;
  TablCoAppListRight: any;
  TableCoAppListRightData: any;
  TableInstaHeader: any;
  TInstadata: any[];
  TableCollateralHeader: any;
  TCollateraldata: any[];
  displayFlag: any;
  collateralHeading: any;
  TableDisburseHeader: any;
  DisburseHeading: any;
  TDisbursedata: any[];
  TablePartPrePaymentHeader: any;
  PartPrePaymentHeading: any;
  TPartPrePaymentdata: any[];
  TableTransactionHeader: any;
  TransactionHeading: any;
  TTransactiondata: any[];
  TableTransHeader: any;
  TransHeading: any;
  TTransdata: any[];
  TableUnRealisedHeader: any;
  UnRealisedHeading: any;
  TUnRealiseddata: any[];
  T112data: any[];
  T112Heading: any;
  Table112Header: any;
  Table113Header: any;
  T113Heading: any;
  T113data: any[];
  Table114Header: any;
  T114Heading: any;
  T114data: any[];
  loanidd: any;
  loanid3: any;
  constructor(public router: Router
,    public appSettings: AppSettings,
    public dialog: MatDialog,
    private commonService: CommonService,
    private report: ReportService) {
    this.settings = this.appSettings.settings;
  }
  userData:any;
  ngOnInit() {
    this.userData=this.commonService.getCredentials();
    this.commonService.session2()

    // let params = {
    //   "user_Id":this.userData['empCode']
    // }
    // this.commonService.sessionactive(params).subscribe(res=>{
    //  if(res['message'] == 'Session is already active'){

    //  }else{
    //   this.displayMessage(res['message'], "Alert")

    //   this.router.navigate(['/login']);

    //  }
    // })
  }
  public loanSearch(): void {
    
    if(!!this.loanID){
      this.loanidd = this.loanID
      this.loanid3 =undefined
      this.getSelectedLoanDetails(this.loanid3)
    }else{
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%', 
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          this.getSelectedLoanDetails(result.loanItem);
        }
      }, error => { });
    }
    
  }
  getSelectedLoanDetails(loanItem: any) {
    
if(!this.loanid3){
  this.loanID = this.loanidd;
  for (var i = 0; i < 5; i++) {
    this.getReport(101 + i);
    if (i + 1 == 5) {
      this.displayFlag = 1
    }
  }
}
    this.loanID = loanItem.LoanId;
    for (var i = 0; i < 5; i++) {
      this.getReport(101 + i);
      if (i + 1 == 5) {
        this.displayFlag = 1
      }
    }
  }
  onDisplay(DF) {
    this.displayFlag = DF;
    if (this.displayFlag == 1) {
      for (var i = 0; i < 5; i++) {
        this.getReport(101 + i);//Loan Details
      }
    } else if (this.displayFlag == 2) {
      this.getReport(112);//Loan Installment
    } else if (this.displayFlag == 3) {
      this.getReport(106);//collateral
      // } else if (this.displayFlag == 4) {
      //   this.getReport(107);//disburse
    } else if (this.displayFlag == 5) {
      this.getReport(108);//PartPrePayment
    } else if (this.displayFlag == 6) {
      this.getReport(109);//Transaction summary
    } else if (this.displayFlag == 7) {
      this.getReport(110);//Loan Transaction
    } else if (this.displayFlag == 8) {
      this.getReport(111);//UnRealised data
    } else if (this.displayFlag == 9) {
      this.getReport(113);//UnRealised data
    } else if (this.displayFlag == 10) {
      this.getReport(114);//UnRealised data
    } else if (this.displayFlag == 0) {
      for (var i = 101; i <= 114; i++) {
        this.getReport(i);//all
      }

    }

  }


  buttonList: any;
  getReport(ReportId) {
    if (!!this.loanID) {
      // let loanID = 6;
      const params = {
        reportId: 20,
        dtlreportId: ReportId,
        loan_id: this.loanID,
        type: 'L',
        FirmID :this.userData['firmID'],
        ProductId  :this.userData['productID']

      }
      this.settings.loadingSpinner = true;
      this.report.getAccountStatementData(params).subscribe(res => {
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          console.log(res)
          if (res['view_model'] == 'L') {
            if (ReportId == 101) {
              let buttonList = res['buttonHeader'].split('||');
              let buttonListArray = [];
              for (let k = 0; k < buttonList.length; k++) {
                let item = buttonList[k].split(':');
                buttonListArray.push({ id: item[1], name: item[0] });
                if (k + 1 == buttonList.length) {
                  this.buttonList = buttonListArray;
                }
              }
              let Addr = res['resulset'][0];
              this.AddressList = Addr['resultset'].split('||');
              this.MainHeader = res['main_header'];
              this.alignStatus = res['align_status'];
              if (res['sub_rpt_id'] != null && res['sub_rpt_id'] != 0) {
                this.getReport(res['sub_rpt_id']);
              }
            } else if (ReportId == 103) {
              let TablCoAppData = res['resulset'][0];
              this.TablCoAppListLeft = res['header'].split('||');
              this.TableCoAppListLeftData = TablCoAppData['resultset'].split('||');
              if (res['sub_rpt_id'] != null && res['sub_rpt_id'] != 0) {
                this.getReport(res['sub_rpt_id']);
              }
            } else if (ReportId == 104) {
              let TablCoAppDataRight = res['resulset'][0];
              this.TablCoAppListRight = res['header'].split('||');
              this.TableCoAppListRightData = TablCoAppDataRight['resultset'].split('||');
            }
          } else if (res['view_model'] == 'T') {

            if (ReportId == 102) {
              let TableLoanData = res['resulset'];
              this.TablLoaneHeader = res['header'].split('||');
              this.TLoandata = [];
              for (var i = 0; i < TableLoanData.length; i++) {
                this.TLoandata.push(TableLoanData[i]['resultset'].split('||'));
              }
              this.getReport(103);
            } else if (ReportId == 105) {
              let TableInstallData = res['resulset'];
              this.TableInstaHeader = res['header'].split('||');
              this.TInstadata = [];
              for (var i = 0; i < TableInstallData.length; i++) {
                this.TInstadata.push(TableInstallData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 106) {
              let TableCollateralData = res['resulset'];
              this.TableCollateralHeader = res['header'].split('||');
              this.collateralHeading = res['main_header'];
              this.TCollateraldata = [];
              for (var i = 0; i < TableCollateralData.length; i++) {
                this.TCollateraldata.push(TableCollateralData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 107) {
              let TableDisburseData = res['resulset'];
              this.TableDisburseHeader = res['header'].split('||');
              this.DisburseHeading = res['main_header'];
              this.TDisbursedata = [];
              for (var i = 0; i < TableDisburseData.length; i++) {
                this.TDisbursedata.push(TableDisburseData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 108) {
              let TablePartPrePaymentData = res['resulset'];
              this.TablePartPrePaymentHeader = res['header'].split('||');
              this.PartPrePaymentHeading = res['main_header'];
              this.TPartPrePaymentdata = [];
              for (var i = 0; i < TablePartPrePaymentData.length; i++) {
                this.TPartPrePaymentdata.push(TablePartPrePaymentData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 109) {
              let TableTransactionData = res['resulset'];
              this.TableTransactionHeader = res['header'].split('||');
              this.TransactionHeading = res['main_header'];
              this.TTransactiondata = [];
              for (var i = 0; i < TableTransactionData.length; i++) {
                this.TTransactiondata.push(TableTransactionData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 110) {
              let TableTransData = res['resulset'];
              this.TableTransHeader = res['header'].split('||');
              this.TransHeading = res['main_header'];
              this.TTransdata = [];
              for (var i = 0; i < TableTransData.length; i++) {
                this.TTransdata.push(TableTransData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 111) {
              let TableUnRealisedData = res['resulset'];
              this.TableUnRealisedHeader = res['header'].split('||');
              this.UnRealisedHeading = res['main_header'];
              this.TUnRealiseddata = [];
              for (var i = 0; i < TableUnRealisedData.length; i++) {
                this.TUnRealiseddata.push(TableUnRealisedData[i]['resultset'].split('||'));
              }
            } else if (ReportId == 112) {
              let Table112Data = res['resulset'];
              this.Table112Header = res['header'].split('||');
              this.T112Heading = res['main_header'];
              this.T112data = [];
              for (var i = 0; i < Table112Data.length; i++) {
                this.T112data.push(Table112Data[i]['resultset'].split('||'));
              }
            } else if (ReportId == 113) {
              let Table113Data = res['resulset'];
              this.Table113Header = res['header'].split('||');
              this.T113Heading = res['main_header'];
              this.T113data = [];
              for (var i = 0; i < Table113Data.length; i++) {
                this.T113data.push(Table113Data[i]['resultset'].split('||'));
              }
            } else if (ReportId == 114) {
              let Table114Data = res['resulset'];
              this.Table114Header = res['header'].split('||');
              this.T114Heading = res['main_header'];
              this.T114data = [];
              for (var i = 0; i < Table114Data.length; i++) {
                this.T114data.push(Table114Data[i]['resultset'].split('||'));
              }
            }
          }
          this.settings.loadingSpinner = false;
        } else {
          this.settings.loadingSpinner = false;
          this.displayMessage(res['status'].message, 'Alert')
        }
      }, error => { this.settings.loadingSpinner = false; })
    }
  }
  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });
  }


}
