import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MoratoriumService } from '../../../services/LMS/moratorium.service';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-moratorium-request',
  templateUrl: './moratorium-request.component.html',
  styleUrls: ['./moratorium-request.component.scss']
})
export class MoratoriumRequestComponent implements OnInit {

  commonDataList: any;
  loanDataSource: any;
  isLoanDataAvailable: any = false;
  liveLoanSearchType: any
  loanId: any;
  customerName: any;
  loanAmount: any;
  loanClassification: any;
  loanDate: any;
  loanbalance: any;
  DebtorsBalance: any;
  ChargesPending: any;
  AdvanceAmt: any;
  DueNo: any;
  netDue: any;
  moroReason: any;
  LastPayDate: any;
  moroFrom: any;
  moroTo: any;
  moroDays: any;
  searchText: any;
  public userData: object;
  public minDate: any = new Date();

  displayedColumns: string[] = ["LoanId", "BranchID", "CustomerName", "PrimaryPhone", "LoanAmount", "LoanDate", "Classification", "BranchName"];
  constructor(public dialog: MatDialog, private datePipe: DatePipe,
    private morotoriumService: MoratoriumService) { }
  ngOnInit() {
    this.userData = this.morotoriumService.getCredentials();
    this.displayLoanSearchPopup();
  }

  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
      }
    });

  }

  private displayMessage(params): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: params
    });
  }
  getSelectedLoanDetails(e) {
    if (!!e) {
      this.loanId = e.LoanId;
      this.customerName = e.CustomerName;
      this.loanAmount = e.LoanAmount;
      this.loanClassification = e.Classification;
      this.loanDate = this.datePipe.transform(new Date(e.LoanDate), 'dd/MM/yyyy');

      const loadDetailsParameters = {
        "Product_ID": this.userData['productID'],
        "Loan_ID": this.loanId,
        "FIRM_ID": this.userData['firmID'],
      };
      this.morotoriumService.getLoanDetails(loadDetailsParameters)
        .subscribe(res => {
          if (res['status'].code == 1) {
            if (res['outstandingData'] !== null) {
              this.loanbalance = res['outstandingData'][0]['LoanBalance'];
              this.DebtorsBalance = res['outstandingData'][0]['DebtorsBalance'];
              this.ChargesPending = res['outstandingData'][0]['ChargesPending'];
              this.AdvanceAmt = res['outstandingData'][0]['AdvanceAmt'];
              this.DueNo = res['outstandingData'][0]['DueNo'];
              this.netDue = res['outstandingData'][0]['AmountPendingClearance'];
            }
          }
        }, error =>
            console.log(error));
      this.isLoanDataAvailable = false;
    }
  }

  calDate(type) {
    if (this.moroFrom != null && this.moroFrom != "" && type == "moroFrom") {
      this.moroTo = null
      const date = this.moroFrom;
      this.minDate = date.setDate(date.getDate() + 1);
      this.minDate = new Date(this.minDate);
    }
    if (this.moroFrom != null && this.moroTo != null) {
      var diff = Math.abs(this.moroFrom.getTime() - this.moroTo.getTime());
      var diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      this.moroDays = diffDays;
    }
  }
  private formatDate(date) {
    const month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];
    const day = (new Date(date)).getDate();
    const month_index = (new Date(date)).getMonth();
    const year = (new Date(date)).getFullYear();
    return day + "/" + month_names[month_index] + "/" + year;
  };
  postMorotoriumReq(morotoriumReq): void {
    let postdata = {
      "FirmID": this.userData['firmID'],
      "BranchID": this.userData['branchID'],
      "ModuleID": 0,
      "UserID": this.userData['empCode'],
      "InputData": this.loanId + '^' + this.formatDate(new Date(this.moroFrom)) + '^' + this.formatDate(new Date(this.moroTo)) + '^' + this.moroReason,
      "ProcedureID": 15
    }
    this.morotoriumService.saveMorotorium(postdata).subscribe(result => {
      if (result['status'].code == 1) {
        // this.displayMessage({ type: "Success", message: result['status']['message'] });
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: result['status'].message, type: "Success" }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.clear(morotoriumReq);
        });

      } else {
        this.displayMessage({ type: "Alert", message: result['status']['message'] })
      }
      // this.dataReset();
    }, error =>
        console.log('There was an error: '),
    );
  }
  public clear(morotoriumReq): void {
    morotoriumReq.resetForm();
    this.displayLoanSearchPopup();
  }

}
