import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { RepaymentService } from '../../services/report/repayment.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
@Component({
  selector: 'app-payu-verify',
  templateUrl: './payu-verify.component.html',
  styleUrls: ['./payu-verify.component.scss']
})
export class PayuVerifyComponent implements OnInit {
public userData: object;
  public transactionNumber: string = '';
  public searchAmount: any;
  public customerID: string = '';
  public loanId: string = '';
  public transAmount: string = '';
  public customerName: string = '';
  public dateOfTxn: string = '';
  public status: string = '';
  public settings: Settings;
  tn_readonly: boolean;
  ta_readonly: boolean;
  requesteD_BY:any
  requesteD_NAME:any
  accountList: any[]=[];
  accountListType:any
  transid: any;
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  constructor(private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }
  onChangeAction(event){

  }
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    const tn_readonly = false;
    const ta_readonly = false;

    this.commonService.getpayuloan().subscribe(res=>{
      this.accountList = res['loanIdList']
    })
  }
  rejects(payUForm,payUSearchForm){
  let params = {
    loanIdRequest:this.loanId
  }
  this.settings.loadingSpinner = true;

  this.commonService.rejectpayu(params).subscribe(res=>{
    if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
      this.settings.loadingSpinner = false;

      this.DisplayMessage("Successfully Rejected !", "Success");
      this.clear(payUForm,payUSearchForm);
    }else{
      this.settings.loadingSpinner = false;

      this.DisplayMessage("Rejection Failed", "Alert");

    }
  })
  }
  getPayuDetails(payUSearchForm,payUForm){
    this.customerName = ""
    this.loanId =""
    this.transAmount = ""
    this.dateOfTxn = ""
    this.customerID = ""
    this.transid = ""
    this.requesteD_BY = ""
    this.requesteD_NAME = ""
    let params = {
  
      'loanIdRequest':this.accountListType
    }
    this.settings.loadingSpinner = true;
    this.commonService.getPayuDetailsappr(params).subscribe(res => {
      console.log(res)
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        if (!!res['transaction_id']) {
          this.customerName = res['customer_name'];
          this.loanId = res['loan_id'];
          this.transAmount = res['amount'];
          this.dateOfTxn = this._rptdatePipe(res['request_date']);
          this.customerID = res['customer_id'];
          this.transid = res['transaction_id']
          this.requesteD_BY = res['emp_code']
          this.requesteD_NAME = res['emp_name']

          this.tn_readonly = true;
          this.ta_readonly = true;
        }

      }else{
        this.DisplayMessage(res['status'].message, "Alert");
        //this.clear(payUSearchForm);
        this.clear(payUForm,payUSearchForm);
      }
      this.settings.loadingSpinner = false;
    }, err => {
      this.settings.loadingSpinner = false;
    })

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
  public confirm(payUForm,payUSearchForm): void {
    let params = {
      CustID : this.customerID,
      LoanID: +this.loanId,
      CollectionAmt: +this.transAmount,
      PaymentDtls: "99^"+this.transAmount+"^"+this.transid+"^5",
      Valuedt: this._rptdatePipe(this.dateOfTxn)
    }
    this.settings.loadingSpinner = true;
    this.repaymentService.verifyPayUDetails(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        this.DisplayMessage("Successfully Updated", "Success");
        this.clear(payUForm,payUSearchForm);

   
        //this.clear(payUSearchForm);

      } else {
        this.DisplayMessage("Updation Failed", "Alert");
      }
    }, err => {
      this.settings.loadingSpinner = false;
      this.DisplayMessage("Updation Failed", "Alert");
      console.log(err)

    })


  }

  public clear(payUForm,payUSearchForm): void {
     payUForm.resetForm();
     payUSearchForm.resetForm();
     this.tn_readonly = false;
          this.ta_readonly = false;
          this.accountList = []
          this.commonService.getpayuloan().subscribe(res=>{
            this.accountList = res['loanIdList']
          })
    }
 // public clear(payUSearchForm): void { payUSearchForm.resetForm(); }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }


}
