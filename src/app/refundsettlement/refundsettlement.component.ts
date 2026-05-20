import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from './../common/loan-search/loan-search.component';
import { CommonService } from './../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from './../app.settings';
import { Settings } from './../app.settings.model';
import { RepaymentService } from './../services/report/repayment.service';
import { AlertMessageComponenent } from './../commoncomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-refundsettlement',
  templateUrl: './refundsettlement.component.html',
  styleUrls: ['./refundsettlement.component.scss']
})
export class RefundsettlementComponent implements OnInit {
 public userData: object;
  public customerID: string = '';
  public loanId: string = '';
  public customerName: string = '';
  public loanDate: string = '';
  public loanAmount: string = '';
  public principalOutstanding: string = '';
  public interestOnAbove: string = '';
  public totalInstallment: string = '';
  public balanceOnAccount: string = '';
  public installmentPaid: string = '';
  public overdueInterest: string = '';
  public unpaidInstallment: string = '';
  public bounceCharges: string = '';
  public settlementAmount: string = '';
  public totalAmount: string = '';
  public otherCharges: string = '';
  public tot: string = '';
  public amountFinanced: string = '';
  public overdueAmount:string = ''
  settlementAmount2:any
  paymentModeList: any;
  accountList: any;
  ledgerId: any;
  PaymentModeID: any;
  paymentMode: any;
  instrumentReference: any; // not necessary
  instrumentDate: any;
  accountListType: any;
  resultStringMaster: any;
  resultObjectMaster: any;
  showPaymentMethodExtras: any;
  subledger: any;
  visible: boolean = false;
  paymentModeSearchType: any;
  collectionDate:any = new Date();
  today:any = new Date();
  accountListType2:any
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  public settings: Settings;
  collectionvalueDate: any;
  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    // let params = {
    //   "user_Id":this.userData['empCode']
    // }
    // this.commonService.sessionactive(params).subscribe(res=>{
    //  if(res['message'] == 'Session is already active'){

    //  }else{
    //   this.DisplayMessage(res['message'], "Alert")

    //   this.router.navigate(['/login']);

    //  }
    // })
    this.displayLoanSearchPopup();
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] })
      .subscribe(res => {
        
        if (!!res && res['paymentModeList'] !== null) {
          let dd = []
           
          dd.push(res['paymentModeList'].find(s=>s.PaymentMode == "CASH"))
          this.paymentModeList =dd ;
        }
      }, err => {
        this.settings.loadingSpinner = false;
      })

      this.commonService.schedulejob().subscribe(res=>{
        if (res['status'].code == 1 && res['status'].flag == 1) {
    
      
        
    
        }else{
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: 'Sorry, your EMI generation is in progress. Settlement is not possible right now. !', type: 'Alert' }
            });
            dialogRef.afterClosed().subscribe(result => {
             if(!!sessionStorage['branchuser']){
               this.router.navigateByUrl('/branchboard/dashboard2')
       
             }else if(!!sessionStorage['currentUser']){
               this.router.navigateByUrl('/personal-report/dashboard1')
       
             }
       
            });
        }
      })
  }
  onChangeAction2(event){

  }
  loanSearch(){
    
  }
  private _rptdatePipe(DateValue) {
    var date = new Date(DateValue);
    const months = {
      1: 'JAN',
      2: 'FEB',
      3: 'MAR',
      4: 'APR',
      5: 'MAY',
      6: 'JUN',
      7: 'JUL',
      8: 'AUG',
      9: 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC'
    }
  //  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
        this.visible = true;
      }
    });
  }
  private getSelectedLoanDetails(e): void {
    if (!!e) {
      // console.log(e);
      this.loanId = e.LoanId;
      this.customerName = e.CustName;
      this.loanAmount = e.LoanAmount;
      this.customerID = e.CustID;
      this.loanDate = e.LoanDate;
      const params = {
        Product_ID: this.userData['productID'],
        LoanID: this.loanId,
        FIRM_ID: this.userData['firmID'],
        TypeID: 1
      };
      this.settings.loadingSpinner = true;
      this.repaymentService.getSettlementDetails(params)
        .subscribe(res => {
          //   console.log(res);
          this.getCustDetails();
          if (res['status'].code == 1) {
            if (res['loanDataList']) {
              this.settings.loadingSpinner = false;
              let loanDetailsList = res['loanDataList'];
              this.settlementAmount = loanDetailsList[0]['SettlementValue'];
              this.interestOnAbove = loanDetailsList[0]['TotalInterest'];
              this.principalOutstanding = loanDetailsList[0]['TotalPrinciple'];
              this.otherCharges = loanDetailsList[0]['TotalOtherCharges'];
              this.overdueInterest = loanDetailsList[0]['TotalOverDue'];
              this.balanceOnAccount = loanDetailsList[0]['TotalPayable'];
              this.installmentPaid = loanDetailsList[0]['NextInstallment'];


            } else {
              alert('list null');
              this.DisplayMessage(res['status'].message, "Alert");
              this.settings.loadingSpinner = false;
            }

          }
        }, error => {
          this.settings.loadingSpinner = false;
        });
    }
  }
  private getCustDetails() {
    this.settings.loadingSpinner = true;
    let param=   {
      "LoginID": this.customerID
    }
    this.repaymentService.getCustomerDetails(param).subscribe(res => {
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;
        let custDtls = res['customerDetailsList'][0];
        let custDtlsStr = custDtls['CustName'];
        let custDtlsStrVal = custDtlsStr.split('^');
        this.installmentPaid = custDtlsStrVal[4];
        this.totalInstallment = custDtlsStrVal[5];
        this.unpaidInstallment = custDtlsStrVal[6];
      }
      else { this.settings.loadingSpinner = false; }
    },
      err => {
        this.settings.loadingSpinner = false;
        console.log('error')
      })
  }




  onChange(paymentModeSearchText) {
    if (!!paymentModeSearchText && paymentModeSearchText != null) {
      var splitted = paymentModeSearchText.split("^", 3);
      this.ledgerId = splitted[0];
      this.PaymentModeID = splitted[1];
      this.paymentMode = splitted[2];
      if (this.PaymentModeID == 1) {
        this.instrumentReference = ''
        this.instrumentDate = ''
        this.accountListType = ''
      }
      if (this.userData['branchID'] != 0) {
        const subAccountParms = {
          AccountNo: this.ledgerId,
          Branch_ID: this.userData['branchID'],
          Firm_ID: this.userData['firmID'],
        };
        this.repaymentService.getSubAccountDetails(subAccountParms)
          .subscribe(result => {
            this.resultStringMaster = JSON.stringify(result);
            this.resultObjectMaster = JSON.parse(this.resultStringMaster);
            this.accountList = this.resultObjectMaster.accountList;
            if (this.accountList == "" || this.accountList == null) {
              this.showPaymentMethodExtras = false;
            } else {
              this.showPaymentMethodExtras = true;
            }
          }, error => {
            console.log('There was an error: ')
          });
      } else {
        let ledgerItem = this.paymentModeList.find(s => s.PaymentModeID == +this.PaymentModeID);
        this.showPaymentMethodExtras = false;
        // if (ledgerItem['LedgerID'] != 33000)
        // this.DisplayMessage("Account can't find. Please select other payment mode", "Alert")
      }
    }
  }

  selectchange(){
    if(this.settlementAmount == this.settlementAmount2){
      if(+this.settlementAmount2 > 175000){
        this.DisplayMessage('Maximum cash limit  up to Rs. 175000/-only. Please pay online.', "Alert");
        this.settlementAmount2 = undefined ;
      }
    }else{
      this.settlementAmount2 = undefined
      this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

    }
  }
  public confirm(settlementForm): void {
    var component =  this;
    if (this.showPaymentMethodExtras == false) {
      this.instrumentReference = "0";
      this.subledger = 0;
      var now = new Date();
      this.instrumentDate = this._rptdatePipe(now);
    }
    else {
      this.instrumentDate = this._rptdatePipe(this.loanDate);
    }
    let payDtls: string = "";
    if (!!this.PaymentModeID) { payDtls = payDtls + this.PaymentModeID + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.ledgerId) { payDtls = payDtls + this.ledgerId + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.subledger) { payDtls = payDtls + this.subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentReference) { payDtls = payDtls + this.instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentDate) { payDtls = payDtls + this.instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionDate) { payDtls = payDtls + this._rptdatePipe(this.collectionDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionvalueDate) { payDtls = payDtls + this._rptdatePipe(this.collectionvalueDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    let params = {
      CustID: this.customerID,
      LoanID: this.loanId,
      CollectionAmt: this.settlementAmount2,
      PaymentDtls: payDtls,
      "Valuedt": this._rptdatePipe(this.collectionDate)
    }
    this.settings.loadingSpinner = true;
    console.log(params)
    this.repaymentService.Collection(params).subscribe(res => {
      this.settings.loadingSpinner = false;    
      if (!!res && res['status'].code == 1) {
        this.DisplayMessage('Saved Successfully', 'Success');
        this.clear(settlementForm);

        setTimeout(() => {
          component.collectionDate = new Date();
        }, 2);
      }
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })
  }
  
  public clear(settlementForm): void {
    var component =  this;
    settlementForm.resetForm();
    setTimeout(() => {
      component.collectionDate = new Date();
    }, 2);
   }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

  onChangeAction(subLederVal) { this.subledger = subLederVal; }


}
