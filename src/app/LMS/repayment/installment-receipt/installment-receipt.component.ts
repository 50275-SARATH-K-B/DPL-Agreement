import { Component, OnInit } from '@angular/core';
import { RepaymentService } from '../../../services/report/repayment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AutoprintService } from '../../../services/auto-print/autoprint.service';
@Component({
  selector: 'app-installment-receipt',
  templateUrl: './installment-receipt.component.html',
  styleUrls: ['./installment-receipt.component.scss']
})
export class InstallmentReceiptComponent implements OnInit {
  custData: object;
  accountData: object;
  public settings: Settings;
  constructor(public appSettings: AppSettings, private repaymentService:
    RepaymentService, private autoprintService: AutoprintService,
    public dialog: MatDialog, public router: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.onload();
    this.loanSearch();
    this.accountData = {
      accountName: undefined,
      Amount: undefined, type: undefined, paymenMode: '33000'
    };


  }

  onload() {

    this.custData = {
      customerID: undefined, customerName: undefined,
      loanID: undefined, loanAmount: undefined,
      loanDate: undefined, nextDueDate: undefined,
      settlement: undefined, lateFee: undefined,
      otherCharges: undefined, debtorsBalance: undefined
    }

  }
  oncustIDClick() {
    if (!this.custData['customerID']) { this.loanSearch(); }
  }


  loanSearch() {
    this.onload()
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        


        this.custData['customerID'] = result['loanItem'].CustID;
        this.custData['customerName'] = result['loanItem'].CustName;
        this.custData['loanID'] = result['loanItem'].LoanId;
        this.getLoanDetails();

        this.custData['loanAmount'] = result['loanItem'].LoanAmount;
        this.custData['loanDate'] = new Date(result['loanItem'].LoanDate);
      }
    });
  }

  getLoanDetails() {
    if (!!this.custData['loanID']) {
      let params = {
        LOAN_ID: this.custData['loanID'],
        TYPE_ID: 1
      }
      this.repaymentService.getLoanData(params)
        .subscribe(res => {
          if (res['status'].code == 1) {
            this.custData['loanBalance'] = res['loanDetailsList'][0].SettlementValue;
            this.custData['lateFee'] = res['loanDetailsList'][0].LateFee;
            this.custData['otherCharges'] = res['loanDetailsList'][0].OtherCharges;
            this.custData['debtorsBalance'] = res['loanDetailsList'][0].OutstandingBalance;
            this.custData['nextDueDate'] = new Date(res['loanDetailsList'][0].DueDate);
            console.log(res);
          }
        })
    }
  }



  confirm(installmentForm) {
    if (installmentForm.valid) {
      this.settings.loadingSpinner = true;
      let postData = {
        CustID: this.custData['customerID'],
        LoanID: +this.custData['loanID'],
        CollectionAmt: +this.accountData['Amount'],
        PaymentDtls: this.accountData['paymenMode']
      }
      this.autoprintService.amount = +this.accountData['Amount'];
      this.autoprintService.customerName = this.custData['customerName'];
      this.autoprintService.loanNo = +this.custData['loanID'];
      this.repaymentService.saveInstallmentCollection(postData)
        .subscribe(promise => {
          this.settings.loadingSpinner = false;
          if (promise['status'].code == 1 && promise['status'].flag == 1) {
            this.autoprintService.DateTime = promise['status']['timeStamp'];
            this.displayMessage(promise['status'].message, "Success");
            this.onload();
            installmentForm.resetForm();
            setTimeout(() => {
              this.accountData['paymenMode'] = "33000";
            }, .01);
          } else {
            this.displayMessage(promise['status'].message, "Alert");
          }
        }, err => {
          this.settings.loadingSpinner = false;
        })
    }
  }

  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });

    if (type == "Success") {
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate(['/autoprint/cash-reciept']);
      })
    }
  }
}
