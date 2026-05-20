import { Component, OnInit, ViewChild } from '@angular/core';
import { Settings } from '../../app.settings.model';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AppSettings } from '../../app.settings';

import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { RepaymentService } from '../../services/report/repayment.service';
import { CommonService } from '../../services/report/common.service';
import { Form, NgForm } from '@angular/forms';

@Component({
  selector: 'app-disbursement-cancel',
  templateUrl: './disbursement-cancel.component.html',
  styleUrls: ['./disbursement-cancel.component.scss']
})
export class DisbursementCancelComponent implements OnInit {
  public settings: Settings;
  userData: any;
  @ViewChild('disbursementForm') disbursementForm: NgForm;
  @ViewChild('reasonForm') reasonForm: NgForm;

  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.settings = this.appSettings.settings;
    this.userData = this.commonService.getCredentials();
    this.loanSearch();
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


  public loanSearch(): void {
    this.clear();
    
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.settings.loadingSpinner = false;
        
        this.getSelectedLoanDetails(result.loanItem);
        
      }
    }, error => { this.settings.loadingSpinner = false; });
  }

  loanID:any;
  LoanDate:any;
  LoanAmount:any;
  customerName:any;
  customerID:any;

  loandtlsList:any;

  DueDte:any;

  NextInstallment:any;
  LateFee:any;
  OtherCharge:any;
  CurrentDue:any;
  AmountToBePaid:any;
  TotalInterest:any;
  settlementAmount:any;

  InstallmentPaid:any;
  TotalInstallment:any;
  UnpaidInstallment:any;
  reason:any;

  getSelectedLoanDetails(loanItem: any) {
    

    this.loanID = loanItem.LoanId;
    this.LoanDate = loanItem.LoanDate;
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
          
          var loandtlsList = res['loanDetailsList'];
          if (!!loandtlsList[0].DueDate) {
            this.DueDte = loandtlsList[0].DueDate;
          }
          this.NextInstallment = loandtlsList[0].NextInstallment;
          this.LateFee = loandtlsList[0].LateFee;
          this.OtherCharge = loandtlsList[0].OtherCharges;
          this.CurrentDue = loandtlsList[0].CurrentDue;
          this.AmountToBePaid = loandtlsList[0].AmtToBePaid;
          this.TotalInterest = loandtlsList[0].AccInterest;
          this.settlementAmount = loandtlsList[0].SettlementValue;

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

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }



  clear(){
    this.disbursementForm.resetForm();
    this.reasonForm.resetForm();
  }



  request(){
    var params = {
      "CustID": this.customerID,
      "LoanID": this.loanID,
      "FirmID": this.userData['firmID'],
      "UserID":this.userData['empCode'],
      "Reason": this.reason?this.reason:''
    };
    

    this.repaymentService.disbursementCancel(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.DisplayMessage(res['status']['message'],"Success");
        this.disbursementForm.resetForm();
        this.reasonForm.resetForm();
        this.loanID = undefined;
      }else{
        this.disbursementForm.resetForm();
        this.reasonForm.resetForm();
        this.DisplayMessage(res['status']['message'],"Alert");
      }


    })

  }

}
