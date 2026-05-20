import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { CommonService } from '../../../services/report/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-charge-entry',
  templateUrl: './charge-entry.component.html',
  styleUrls: ['./charge-entry.component.scss']
})
export class ChargeEntryComponent implements OnInit {
  public userData: object;
  public loanId: string = '';
  public customerName: string = '';
  public loanAmount: string = '';
  public loanbalance: string = '';
  public ChargesPending: string = '';
  public loanDate: string = '';
  public Amount: string = '';
  public chargeList: Array<object> = [];
  constructor(private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
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
  private getSelectedLoanDetails(e): void {
    if (!!e) {
      this.loanId = e.LoanId;
      this.customerName = e.CustomerName;
      this.loanAmount = e.LoanAmount;
      this.loanDate = this.datePipe.transform(new Date(e.LoanDate), 'dd/MM/yyyy');
      const params = {
        Product_ID: this.userData['productID'],
        Loan_ID: this.loanId,
        FIRM_ID: this.userData['firmID'],
      };
      this.commonService.getLoanDetails(params)
        .subscribe(res => {
          if (res['status'].code == 1) {
            if (res['outstandingData'] !== null) {
              this.loanbalance = res['outstandingData'][0]['LoanBalance'];
              this.ChargesPending = res['outstandingData'][0]['ChargesPending'];
            }
          }
        }, error =>
            console.log(error));
    }
  }
  public confirm(chargeForm):void{

  }
  public clear(chargeForm):void{
    chargeForm.resetForm();
    this.displayLoanSearchPopup();
  }
}
