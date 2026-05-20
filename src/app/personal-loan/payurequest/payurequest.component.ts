import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { RepaymentService } from '../../services/report/repayment.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
@Component({
  selector: 'app-payurequest',
  templateUrl: './payurequest.component.html',
  styleUrls: ['./payurequest.component.scss']
})
export class PayurequestComponent implements OnInit {
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

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    const tn_readonly = false;
    const ta_readonly = false;
  }
  getPayuDetails(payUSearchForm,payUForm){
    let params = {
      TranAmt :+this.searchAmount,
      PayuTraID: this.transactionNumber
    }
    this.settings.loadingSpinner = true;
    this.repaymentService.getPayuDetailsreq(params).subscribe(res => {
      console.log(res)
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        if (res['payuUpdateList'] != null) {
          let details = res['payuUpdateList'][0];
          this.customerName = details.CustomerName;
          this.loanId = details.LoanID;
          debugger
          if(this.searchAmount !== details.Amount.toString() ){
            this.DisplayMessage("Please check the Entered Amount !", "Alert");
            payUForm.resetForm();
            payUSearchForm.resetForm();
            this.tn_readonly = false;
                 this.ta_readonly = false;  
                 this.transAmount = ""
                 this.dateOfTxn = ""
                 this.customerID = "" 
                 this.customerName = ""
             }

          this.transAmount = details.Amount;
          this.dateOfTxn = details.LoanDate;
          this.customerID = details.CustomerID;
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
      // CustID : this.customerID,
      // LoanID: +this.loanId,
      // CollectionAmt: +this.transAmount,
      // PaymentDtls: "99^"+this.transAmount+"^"+this.transactionNumber+"^5",
      // Valuedt: this._rptdatePipe(this.dateOfTxn)

      "transaction_id": this.transactionNumber,
      "amount": this.transAmount,
      "loan_id": +this.loanId,
      "amount_cus_paid": +this.transAmount,
      "customer_name": this.customerName,
      "customer_id":this.customerID,
      "emp_code": this.userData['empCode'],
      "emp_name": this.userData['employeeName']
    }
    this.settings.loadingSpinner = true;
    this.commonService.updatePayUDetails(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        this.DisplayMessage(res['status'].message, "Success");
        this.clear(payUForm,payUSearchForm);
        //this.clear(payUSearchForm);

      } else {
        this.DisplayMessage(res['status'].message, "Alert");
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

    }
 // public clear(payUSearchForm): void { payUSearchForm.resetForm(); }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }



}
