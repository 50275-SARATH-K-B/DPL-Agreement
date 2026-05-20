import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ReportsService } from '../services/reports/reports.service';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { DatePipe } from '@angular/common';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { CommonService } from '../services/common/common.service';
import { ReportService } from '../services/report/report.service';
import { RepaymentService } from '../services/report/repayment.service';
@Component({
  selector: 'app-soa',
  templateUrl: './soa.component.html',
  styleUrls: ['./soa.component.scss']
})
export class SoaComponent implements OnInit {

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
  today = new Date()
  TablCustomerInfoListLeft: any;
  TableCustomerInfoListLeftData: any;
  TablCustomerInfoListRight: any;
  TableCustomerInfoListRightData: any;
  Table121Header: any;
  T121Heading: any;
  T121data: any[];
  Table122Header: any;
  T122Heading: any;
  T122data: any[];
  Table124Header: any;
  T124Heading: any;
  T124data: any[];
  L119mainHeader: any;
  Table123Header: any;
  T123Heading: any;
  T123data: any[];
  Table125Header: any;
  T125Heading: any;
  T125data: any[];
  TableInstallData: any = [];
  TableLoanData: any = [];
  TableDisburseData: any = [];
  Table122Data: any = [];
  Table123Data: any = [];
  Table113Data: any = [];
  Table114Data: any = [];
  Table125Data: any = [];
  funID: any;
  Table126Data: any;
  Table126Header: any;
  T126Heading: any;
  T126data: any[];
  employeeName: any;
  employeecode: any;
  custname: any;
  custinfoflag: any=0;
  public settings: Settings;
  npa_category: any;
  accounting_classification: any;
  npa_date: any;
  npa_release_date: any;
  loan_id: any;
  accountStatus: any;
  constructor( private _reportsService: ReportService,   public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private route: ActivatedRoute,
    private report: ReportsService,
    private datepipe: DatePipe,public commonService:CommonService,public commonservice:CommonService,private repaymentService:RepaymentService,
    public dialogRef: MatDialogRef<SoaComponent>,public appSettings: AppSettings,) {
      this.settings = this.appSettings.settings;

     }
    userData: any;

  ngOnInit() {

    this.userData =this.commonservice.getCredentials() 
    this.commonservice.session2()

    this.employeeName = this.userData['employeeName']
    this.employeecode = this.userData['empCode']

  //  this.route.queryParams.subscribe(res => {
  //     console.log(res)
  //     this.loan_id = res['loanId']
  //   })
  // console.log(this.data)
   
    if(!!this.data['LoanId']){
      // this.loanID = this.loan_id 
      this.getSelectedLoanDetails(this.data['LoanId']);
    }else{
      if (!!this.data['loanId']) {
        this.loanID = this.data['loanId'];
        for (var i = 0; i < 5; i++) {
          this.getReport(101 + i);
          if (i + 1 == 5) {
            this.displayFlag = 1
          }
        }
      }
      if (this.data['value']) {
        this.getSelectedLoanDetails(this.data['value']);
      }
     
      this.loanSearch();
    }
   
  }
  public loanSearch(): void {
    this.TLoandata = [];
    this.TInstadata = [];
    this.TCollateraldata = [];
    this.TDisbursedata = [];
    this.TPartPrePaymentdata = [];
    this.TTransactiondata = [];
    this.TTransdata = [];
    this.TUnRealiseddata = [];
    this.T112data = [];
    this.T113data = [];
    this.T114data = [];
    this.T121data = [];
    this.T122data = [];
    this.T123data = [];
    this.T124data = [];
    this.T125data = [];
// if(this.custinfoflag!=1){
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
      data: { funid: 12 }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
      }
    }, error => { });
  }
  getSelectedLoanDetails(loanItem: any) {
    this.custname=loanItem.CustName
    this.loanID = loanItem.LoanId ? loanItem.LoanId : loanItem;
    // if(this.custinfoflag!=1){

    for (var i = 0; i < 5; i++) {
      this.getReport(101 + i);
      if (i + 1 == 5) {
        this.displayFlag = 1
      }
    }
    const params2 = {
      loan_id:this.loanID
    }
    
    this._reportsService.getsoadetails(params2).subscribe(res=>{
    this.npa_category =res['dataList'][0]['npa_category']
    this.accounting_classification = res['dataList'][0]['accounting_classification']
    this.npa_date = res['dataList'][0]['npa_date']
    if(res['dataList'][0]['npa_release_date'] == null){
      this.npa_release_date = undefined

    }else{
      this.npa_release_date = res['dataList'][0]['npa_release_date']

    }
    })
  // }else{
  //   this.onDisplay(0) 
  // }
  }

  createDateObject(value) {
    try {
        return new Date(value.split('/').reverse().join('/'));
    }
    catch(e) {
        return null;
    }
}

  getBackgroundColor(i): String {
    let g=i.split("Y")
    if(g.length!=1){
      return 'lightgreen'
    }else{
      return ''
    } 
    }
    starbold:any="90px";
    starbolds:any="auto";
    bla:string="Loan Sanction Date"
    bla1:string="Date"
    bla2:string="Effective Date"
  onDisplay(DF) {
    this.displayFlag = DF;
    if (this.displayFlag == 1) {
      for (var i = 0; i < 5; i++) {
        this.getReport(101 + i);//Loan Details
      }
    } else if (this.displayFlag == 2) {
      this.getReport(112);//Loan Installment
    } else if (this.displayFlag == 3) {
      this.getReport(121);//collateral
    } else if (this.displayFlag == 4) {
      this.getReport(107);//disburse
    } else if (this.displayFlag == 5) {
      this.getReport(108);//PartPrePayment
      // } else if (this.displayFlag == 6) {
      //   this.getReport(109);//Transaction summary
      // } else if (this.displayFlag == 7) {
      //   this.getReport(110);//Loan Transaction
    } else if (this.displayFlag == 8) {
      this.getReport(111);//UnRealised data
    } else if (this.displayFlag == 9) {
      this.getReport(113);//UnRealised data
    } else if (this.displayFlag == 10) {
      this.getReport(114);//UnRealised data
    } else if (this.displayFlag == 12) {
      this.getReport(124);//Bounced
    } else if (this.displayFlag == 11) {
      this.getReport(123);//cleared
    } else if (this.displayFlag == 0) {
      for (var i = 101; i <= 126; i++) {
        if (i != 109 && i != 110) {
          this.getReport(i);//all
        }

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
        ProductId  :69
      }
      this.settings.loadingSpinner = true;
      this.report.getAccountStatementData2(params).subscribe(res => {
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          // if (res['view_model'] == 'L') {
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
              
              let Addr = !!res['resulset'][0] ? res['resulset'][0] : null;
              this.AddressList = !!Addr['resultset'] ? Addr['resultset'].split('||') : null;
              this.MainHeader = res['main_header'];
              this.alignStatus = res['align_status'];
              if (res['sub_rpt_id'] != null && res['sub_rpt_id'] != 0) {
                this.getReport(res['sub_rpt_id']);
              }
            } else if (ReportId == 103) {
              let TablCoAppData = !!res['resulset'][0] ? res['resulset'][0] : null;
              this.TablCoAppListLeft = !!res['header'] ? res['header'].split('||') : null;
              if (TablCoAppData['resultset'] !== null) {
                this.TableCoAppListLeftData = !!TablCoAppData['resultset'] ? TablCoAppData['resultset'].split('||') : null;
                if (res['sub_rpt_id'] != null && res['sub_rpt_id'] != 0) {
                  this.getReport(res['sub_rpt_id']);
                }
              }

            } else if (ReportId == 104) {
              let TablCoAppDataRight = !!res['resulset'][0] ? res['resulset'][0] : null;
              this.TablCoAppListRight = !!res['header'] ? res['header'].split('||') : null;
              this.TableCoAppListRightData = !!TablCoAppDataRight['resultset'] ? TablCoAppDataRight['resultset'].split('||') : null;
              this.accountStatus=this.TableCoAppListRightData[0]
              this.repaymentService.loanAccntStatus = this.accountStatus
            } else if (ReportId == 119) {
              this.L119mainHeader = res['main_header']
              let TablCustomerInfoDataLeft = !!res['resulset'][0] ? res['resulset'][0] : null;
              this.TablCustomerInfoListLeft = !!res['header'] ? res['header'].split('||') : null;
              this.TableCustomerInfoListLeftData = !!TablCustomerInfoDataLeft['resultset'] ? TablCustomerInfoDataLeft['resultset'].split('||') : null;
            } else if (ReportId == 120) {
              let TablCustomerInfoDataRight = !!res['resulset'][0] ? res['resulset'][0] : null;
              this.TablCustomerInfoListRight = !!res['header'] ? res['header'].split('||') : null;
              this.TableCustomerInfoListRightData = !!TablCustomerInfoDataRight['resultset'] ? TablCustomerInfoDataRight['resultset'].split('||') : null;
            }
          } 
          // else if (res['view_model'] == 'T') {
            if (ReportId == 102) {
              this.TableLoanData = res['resulset'];
              this.TablLoaneHeader = res['header'].split('||');
              this.TLoandata = [];
              for (var i = 0; i < this.TableLoanData.length; i++) {
                let signleItem = this.TableLoanData[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.TLoandata.push(rowData)
              }
              this.getReport(103);
            } else if (ReportId == 105) {
              this.TableInstallData = res['resulset'];
              this.TableInstaHeader = res['header'].split('||');
              this.TInstadata = [];
              if (!!this.TableInstallData) {
                for (var i = 0; i < this.TableInstallData.length; i++) {
                  let signleItem = this.TableInstallData[i]['resultset'].split('||');
                  // console.log(signleItem)
                  let rowData: any = [];
                  signleItem.forEach(element => {
                    let alignment: string;
                    let item = element.split('~')
                    if (item[1] == 'C') {
                      alignment = 'center'
                    }
                    else if (item[1] == 'R') {
                      alignment = 'right'
                    } else {
                      alignment = 'left'
                    }
                    rowData.push({ allignment: alignment, value: item[0] });
                  });
                  this.TInstadata.push(rowData);
                }
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
              this.TableDisburseData = res['resulset'];
              this.TableDisburseHeader = res['header'].split('||');
              this.DisburseHeading = res['main_header'];
              this.TDisbursedata = [];
              for (var i = 0; i < this.TableDisburseData.length; i++) {
                let signleItem = this.TableDisburseData[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.TDisbursedata.push(rowData);
              }
              // console.log(this.TDisbursedata)
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
              this.Table113Data = res['resulset'];
              this.Table113Header = res['header'].split('||');
              this.T113Heading = res['main_header'];
              this.T113data = [];
              for (var i = 0; i < this.Table113Data.length; i++) {
                let signleItem = this.Table113Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] })
                });
                this.T113data.push(rowData);
              }
            }
            // else if (ReportId == 114) {
            //   let Table114Data = res['resulset'];
            //   this.Table114Header = res['header'].split('||');
            //   this.T114Heading = res['main_header'];
            //   this.T114data = [];
            //   for (var i = 0; i < Table114Data.length; i++) {
            //     this.T114data.push(Table114Data[i]['resultset'].split('||'));
            //   }
            // } 
            else if (ReportId == 114) {
              this.Table114Data = res['resulset'];
              this.Table114Header = res['header'].split('||');
              this.T114Heading = res['main_header'];
              this.T114data = [];
              for (var i = 0; i < this.Table114Data.length; i++) {
                let signleItem = this.Table114Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.T114data.push(rowData);
              }
            } else if (ReportId == 121) {
              let Table121Data = res['resulset'];
              this.Table121Header = res['header'].split('||');
              this.T121Heading = res['main_header'];
              this.T121data = [];
              for (var i = 0; i < Table121Data.length; i++) {
                this.T121data.push(Table121Data[i]['resultset'].split('||'));
              }
              // console.log(this.T121data);
            } else if (ReportId == 122) {
              this.Table122Data = res['resulset'];
              this.Table122Header = res['header'].split('||');
              this.T122Heading = res['main_header'];
              this.T122data = [];
              for (var i = 0; i < this.Table122Data.length; i++) {
                let signleItem = this.Table122Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.T122data.push(rowData);
              }
            } else if (ReportId == 123) {
              this.Table123Data = res['resulset'];
              this.Table123Header = res['header'].split('||');
              this.T123Heading = res['main_header'];
              this.T123data = [];
              for (var i = 0; i < this.Table123Data.length; i++) {
                let signleItem = this.Table123Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.T123data.push(rowData);
              }
            } else if (ReportId == 124) {
              let Table124Data = res['resulset'];
              this.Table124Header = res['header'].split('||');
              this.T124Heading = res['main_header'];
              this.T124data = [];
              for (var i = 0; i < Table124Data.length; i++) {
                this.T124data.push(Table124Data[i]['resultset'].split('||'));
              }
            } else if (ReportId == 125) {
              this.Table125Data = res['resulset'];
              this.Table125Header = res['header'].split('||');
              this.T125Heading = res['main_header'];
              this.T125data = [];
              for (var i = 0; i < this.Table125Data.length; i++) {
                let signleItem = this.Table125Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.T125data.push(rowData);
              }
              // console.log(this.T125data); 
            } else if (ReportId == 126) {
              this.Table126Data = res['resulset'];
              this.Table126Header = res['header'].split('||');
              this.T126Heading = res['main_header'];
              this.T126data = [];
              for (var i = 0; i < this.Table126Data.length; i++) {
                let signleItem = this.Table126Data[i]['resultset'].split('||');
                let rowData: any = [];
                signleItem.forEach(element => {
                  let alignment: string;
                  let item = element.split('~')
                  if (item[1] == 'C') {
                    alignment = 'center'
                  }
                  else if (item[1] == 'R') {
                    alignment = 'right'
                  } else {
                    alignment = 'left'
                  }
                  rowData.push({ allignment: alignment, value: item[0] });
                });
                this.T126data.push(rowData);
              }
              // console.log(this.T125data); 
            }
          // }
          this.settings.loadingSpinner = false;
        // } 
        // else {
        //   this.settings.loadingSpinner = false;
        //   // this.displayMessage(res['status'].message, 'Alert')
        // }
      }, error => {     this.settings.loadingSpinner = false;
        ; })
    }
  }
  // to print and download as pdf
  printLetter(printSectionId): void {
    let printContents, popupWin;
    printContents = document.getElementById(printSectionId).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(printContents);
    popupWin.print();
    popupWin.document.close();
  }

  onClose(): void {
    this.dialogRef.close({status: this.accountStatus});
  }



  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });
  }

  

}
