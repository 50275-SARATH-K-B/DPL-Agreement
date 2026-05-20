import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { RepaymentService } from '../../services/report/repayment.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-payu-updation',
  templateUrl: './payu-updation.component.html',
  styleUrls: ['./payu-updation.component.scss']
})
export class PayuUpdationComponent implements OnInit {
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
  
  constructor(private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    const tn_readonly = false;
    const ta_readonly = false;
  }
  getPayuDetails(payUSearchForm,payUForm){
    let params = {
      TranAmt :+this.searchAmount,
      PayuTraID: this.transactionNumber
    }
    this.settings.loadingSpinner = true;
    this.repaymentService.getPayuDetails(params).subscribe(res => {
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        if (res['payuUpdateList'] != null) {
          let details = res['payuUpdateList'][0];
          this.customerName = details.CustomerName;
          this.loanId = details.LoanID;
          this.transAmount = details.Amount;
          this.dateOfTxn = details.LoanDate;
          this.customerID = details.CustomerID;
          this.tn_readonly = true;
          this.ta_readonly = true;
        }

      }else{
        this.DisplayMessage(res['status'].message, "Alert");
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
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
  public confirm(payUForm,payUSearchForm): void {
    let params = {
      CustID : this.customerID,
      LoanID: +this.loanId,
      CollectionAmt: +this.transAmount,
      PaymentDtls: "99^"+this.transAmount+"^"+this.transactionNumber+"^5",
      Valuedt: this._rptdatePipe(this.dateOfTxn)
    }
    this.settings.loadingSpinner = true;
    this.repaymentService.updatePayUDetails(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].flag == 1 && res['status'].code == 1) {
        this.DisplayMessage("Successfully Updated", "Success");
        this.clear(payUForm,payUSearchForm);
      } else {
        this.DisplayMessage("Updation Failed", "Alert");
      }
    }, err => {
      this.settings.loadingSpinner = false;
      this.DisplayMessage("Updation Failed", "Alert");
    })


  }

  public clear(payUForm,payUSearchForm): void {
     payUForm.resetForm();
     payUSearchForm.resetForm();
     this.tn_readonly = false;
          this.ta_readonly = false;
    }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }


}
