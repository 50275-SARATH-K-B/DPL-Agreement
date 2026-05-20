import { Component, OnInit,DoCheck, SimpleChanges,OnChanges } from '@angular/core';
import { Settings } from '../../app.settings.model';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { RepaymentService } from '../../services/report/repayment.service';
import { CommonService } from '../../services/report/common.service';
import { AppSettings } from '../../app.settings';
import { DashboardfirstComponent } from '../../Report/report/dashboardfirst/dashboardfirst.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-installment-receipt',
  templateUrl: './installment-receipt.component.html',
  styleUrls: ['./installment-receipt.component.scss']
})
export class InstallmentReceiptComponent implements OnInit {
  public settings: Settings;
  LoanDate: any;
  LoanAmount: any;
  loanID: any; 
  userData: any;
  paymentModeList: any;
  customerName: any;
  customerID: any;
  PaymentModeID: any;
  ledgerId: any;
  InstallmentPaid: any;
  TotalInstallment: any;
  UnpaidInstallment: any;
  TotalInterest: any;
  paymentModeSearchType: any;
  paymentMode: any;
  instrumentReference: any;
  instrumentDate: any;
  accountListType: any;
  accountList: any;
  showPaymentMethodExtras: boolean;
  NextInstallment: any;
  LateFee: any;
  OtherCharge: any;
  CurrentDue: any;
  AmountToBePaid: any;
  DueDte: any;
  subledger: any;
  ChequeBounce: any;
  futurePrinciple: any;
  AmountRcvd: any;
  loandtlsList: any;
  settlementAmount: any;
  collectionDate:any = new Date();
  today:any = new Date();
  mindate:any = new Date();
  mindate2:any 
  collectionvalueDate: any;
  minfindate: any;
  constructor(public router: Router,public appSettings: AppSettings,
    public dialog: MatDialog,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe
  ) { this.settings = this.appSettings.settings; }

 
  ngOnInit() {
    
      this.commonService.session2()
    let now: any = new Date();
    console.log(this._rptdatePipe(now))
    const d = new Date();
     let k = this.subtractYears(d, 1)
     let finyr
     let nowyr = new Date().getFullYear()
     let c:any = new Date("01/"+"APR/"+k)

     let r:any = new Date("01/"+"APR/"+nowyr)
     if(now> r){
      let Difference_In_Time = now.getTime() - r.getTime();
      this.minfindate = r


      finyr =Math.round(Difference_In_Time / (1000 * 3600 * 24));
     }else if(r>now){
      let Difference_In_Time = now.getTime() - c.getTime();
      this.minfindate = c

      finyr =Math.round(Difference_In_Time / (1000 * 3600 * 24));
     }

    this.userData = this.commonService.getCredentials();
    this.repaymentService.GetPaymentModeDetails({ flag: 1, product_id: this.userData['productID'] }).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {     

        let dd = []
        
           if(!!sessionStorage['branchuser']){
            dd.push(res['paymentModeList'].find(s=>s.LedgerID == "33000"))  

           }else if(!!sessionStorage['currentUser']){
 
            dd.push(res['paymentModeList'].find(s=>s.LedgerID == "10728"))
            dd.push(res['paymentModeList'].find(s=>s.LedgerID == "31035"))

           }
        this.paymentModeList =dd

      }
    })

   
    this.loanSearch();
    console.log(this.userData)
  }
   subtractYears(date, years) {
    return date = date.getFullYear() - years;
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log(true);
  }
  public loanSearch(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.settings.loadingSpinner = false;
        if(!!sessionStorage['branchuser']){
          let paramss = {
            loan_id:result.loanItem.LoanId
          }
          this.commonService.checksettle(paramss).subscribe(res=>{
          if(res['status']['message'] == 'use settlement option'){
  
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
           width: '30%',
           data: { message: 'Please Use Settlement Option !', type: 'Alert' }
           });
           dialogRef.afterClosed().subscribe(result => {
  
            this.router.navigateByUrl('/repayment/settlement')
           });
          
      
          }else{
            this.getSelectedLoanDetails(result.loanItem);

          }
        })
        }else{
          this.getSelectedLoanDetails(result.loanItem);

        }
     
      }
    }, error => { this.settings.loadingSpinner = false; });
  }
  
  Clear() {
    this.AmountToBePaid = this.CurrentDue = this.DueDte = this.NextInstallment = this.LateFee = this.OtherCharge = undefined;
  }
  ClearLoan() {
    this.loanID = undefined;
    this.LoanDate = undefined;
    this.LoanAmount = undefined;
    this.customerName = undefined;
    this.customerID = undefined;
  }
  getSelectedLoanDetails(loanItem: any) {
    this.ClearLoan();
    this.loanID = loanItem.LoanId;
    this.LoanDate = loanItem.LoanDate;
    console.log(this.LoanDate)
    console.log(this._rptdatePipe(this.LoanDate))
    this.LoanAmount = loanItem.LoanAmount;
    this.customerName = loanItem.CustName;
    this.customerID = loanItem.CustID;
    if (!!this.loanID) {
      const params = {
        LoanID: this.loanID,
        TypeID: 1
      }
      this.settings.loadingSpinner = true;
      this.repaymentService.getLoanDetailsCollection(params).subscribe(res => {
        if (!!res && res['status'].code == 1) {
          this.Clear();
          this.loandtlsList = res['loanDetailsList'];
          if (!!this.loandtlsList[0].DueDate) {
            this.DueDte = this.loandtlsList[0].DueDate;
          }
          this.NextInstallment = this.loandtlsList[0].NextInstallment;
          this.LateFee = this.loandtlsList[0].LateFee;
          this.OtherCharge = this.loandtlsList[0].OtherCharges;
          this.CurrentDue = this.loandtlsList[0].CurrentDue;
          this.AmountToBePaid = this.loandtlsList[0].AmtToBePaid;
          this.TotalInterest = this.loandtlsList[0].AccInterest;
          this.settlementAmount = this.loandtlsList[0].SettlementValue;
          if (!!this.customerID) {
            const params = {
              LoginID: this.customerID
            }
            this.repaymentService.getCollectionDtls(params).subscribe(res => {
              if (!!res && res['status'].code == 1) {
                let custDtls = res['customerDetailsList'][0];
                let custDtlsStr = custDtls['CustName'];
                let custDtlsStrVal = custDtlsStr.split('^');
                this.InstallmentPaid = custDtlsStrVal[4];
                this.TotalInstallment = custDtlsStrVal[5];
                this.UnpaidInstallment = custDtlsStrVal[6];
              }
              else { this.settings.loadingSpinner = false; }
            }, error => { this.settings.loadingSpinner = false; })
          }
          let AmtToBePaid;
          if (!!this.CurrentDue) {
            if (+this.CurrentDue >= 0) {
              AmtToBePaid = (+this.CurrentDue) + (+this.LateFee);
            } else if (+this.CurrentDue < 0) {
              AmtToBePaid = (+this.CurrentDue) + (+this.NextInstallment);
            }
            if(AmtToBePaid<0){
              this.AmountToBePaid=0;
            }else{
              this.AmountToBePaid=AmtToBePaid.toFixed(2);
            }
          }
          this.settings.loadingSpinner = false;
        } else { this.settings.loadingSpinner = false; }
      }, error => {
        this.settings.loadingSpinner = false;
      })

    }
  }

  cashlimit(){
    let date = new Date(this.collectionDate);
    let month = date.getMonth();
    switch(month){
      case 0:
        return 59999;
      case 1:
        return 39999;
      case 2:
        return 19999;
      default:
        return 19999;
    }
  }

  check(AmountRcvd){
    
    let monthlimit = this.cashlimit();

    if(!!sessionStorage['branchuser']){

      if(+AmountRcvd > +this.settlementAmount ){
        this.DisplayMessage('Maximum amount should be less than or equal to :'+this.settlementAmount, "Alert");
        this.AmountRcvd = undefined ;
      }
      if(+AmountRcvd > monthlimit){
        this.DisplayMessage("Maximum cash limit  up to Rs. "+ monthlimit +"/-only. Please pay online.", "Alert");
        this.AmountRcvd = undefined ;
      }
     }else if(!!sessionStorage['currentUser']){
      if(+AmountRcvd > +this.settlementAmount ){
        this.DisplayMessage('Maximum amount should be less than or equal to :'+this.settlementAmount, "Alert");
        this.AmountRcvd = undefined ;
      }

     }
  }
  onChange(paymentModeSearchText) {
    
    if (!!paymentModeSearchText && paymentModeSearchText != null) {
      this.settings.loadingSpinner = true;
      let splitted = paymentModeSearchText.split("^", 3);
      this.ledgerId = splitted[0];
      if(this.ledgerId !== 31035){
        this.collectionvalueDate = undefined
      }
      this.PaymentModeID = splitted[1];
      this.paymentMode = splitted[2];
      if (this.PaymentModeID == 1) {// cash
        this.instrumentReference = ''
        this.instrumentDate = ''
        this.accountListType = ''
      }
      if(!!sessionStorage['branchuser']){
        this.mindate = new Date()
      }else{
        this.mindate = ""
      }
      if (this.userData['branchID'] != 0) {
        const subAccountParms = {
          "AccountNo": this.ledgerId,

        };
        this.repaymentService.getSubAccountDetails(subAccountParms)
          .subscribe(result => {
            this.settings.loadingSpinner = false;
            this.accountList = result['accountList'];
            this.showPaymentMethodExtras = (this.accountList == "" || this.accountList == null) ? false : true;
          }, error => { console.log('There was an error: '); this.settings.loadingSpinner = false; });
      } else {
        let ledgerItem = this.paymentModeList.find(s => s.PaymentModeID == +this.PaymentModeID);
        this.showPaymentMethodExtras = false;
        if (ledgerItem['LedgerID'] != 33000)
          this.DisplayMessage("Account can't find. Please select other payment mode", "Alert");
        this.settings.loadingSpinner = false;
      }
    }

  }
  onChangeAction(subLederVal) {
    this.subledger = subLederVal;
  }
  private _rptdatePipe(DateValue) {
    let date = new Date(DateValue);
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
 
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }

  public SaveCollection(InstallmentForm) {
 
      let component =  this;
      if (this.showPaymentMethodExtras == false) {
        this.instrumentReference = "0";
        this.subledger = 0;
        let now = new Date();
        this.instrumentDate = this._rptdatePipe(now);
      }
      else {
        this.instrumentDate = this._rptdatePipe(this.LoanDate);
      }
      let payDtls: string = "";
      if (!!this.PaymentModeID) { payDtls = payDtls + this.PaymentModeID + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.ledgerId) { payDtls = payDtls + this.ledgerId + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.subledger) { payDtls = payDtls + this.subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.instrumentReference) { payDtls = payDtls + this.instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.instrumentDate) { payDtls = payDtls+ this.instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.collectionDate) { payDtls = payDtls + this._rptdatePipe(this.collectionDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.collectionvalueDate) { payDtls = payDtls + this._rptdatePipe(this.collectionvalueDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
  
       const params = {
        CustID: this.customerID,
        LoanID: this.loanID,
        CollectionAmt: this.AmountRcvd,
        PaymentDtls: payDtls,
        "Valuedt": this._rptdatePipe(this.collectionDate)
      }
      this.settings.loadingSpinner = true
      console.log(this.userData)
      console.log(params)
      this.repaymentService.Collection(params).subscribe(res => {
        if (!!res && res['status'].code == 1) {
          this.settings.loadingSpinner = false;
          this.DisplayMessage('Saved Successfully', 'Success');
          InstallmentForm.resetForm();
          this.loanID = undefined;
  
          setTimeout(() => {
            component.collectionDate = new Date();
          }, 2);
        }
        else {
          this.settings.loadingSpinner = false;
          this.DisplayMessage(res['status'].message, 'Alert');
        }
      }, error => { this.settings.loadingSpinner = false; })
   
    
  }
  DisplayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
    if (type == 'Success') {
      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }
  clear(InstallmentForm) {
    let component =  this;
    if (!!InstallmentForm) {
      InstallmentForm.resetForm();
      this.loanID = undefined;

      
      setTimeout(() => {
        component.collectionDate = new Date();
      }, 2);
    } else {
      this.Clear();
      this.ClearLoan();
    }
  }
}
