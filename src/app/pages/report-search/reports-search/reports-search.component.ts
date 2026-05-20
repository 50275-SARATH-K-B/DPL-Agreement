import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatDialog, MatTableDataSource, MatSort } from '@angular/material';

import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { ReportsService } from '../../../services/reports/reports.service';

@Component({
  selector: 'app-reports-search',
  templateUrl: './reports-search.component.html',
  styleUrls: ['./reports-search.component.scss']
})
export class ReportsSearchComponent implements OnInit {
  reportsList: any[] = [];
  report: any;
  reportDetails: any = {};

  optionList1: any[] = [];
  optionList2: any[] = [];

  option1: string;
  option2: string;
  fromDate: string;
  toDate: string;


  dataList: any[] = [];

  public filter: string = "";

  displayedColumns: string[] = ["loaN_ID", "applicatioN_ID", "loaN_DATE", "customeR_ID", "customeR_NAME", "disburseD_AMOUNT"];

  dataSource = new MatTableDataSource<any>(this.dataList);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public dialog: MatDialog, private reportService: ReportsService) { }

  ngOnInit() {

    this.getReportList();
  }
  userData: any;
  getReportList() {
    let params = {
      productId: this.userData['productID'],
      firmId: this.userData['firmID']
    }
    this.reportService.getReportDetails(params).subscribe(res => {
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        this.reportsList = res['reportDetailsList'];
      }
    }, err => { })
  }

  reportChanged(event) {
    this.reportDetails = this.reportsList.find((f) => { return f['REPORTID'] == this.report });
    if (this.reportDetails['REPORTPARM3']) {
      this.getOptionList(2);
    }
    if (this.reportDetails['REPORTPARM5']) {
      this.getOptionList(3);
    }
  }
  getOptionList(optionid) {
    let params = { id: optionid };
    this.reportService.getReportSearchOptions(params).subscribe(res => {
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        if (optionid == 2) {
          this.optionList1 = res['resultset'];
        }
        if (optionid == 3) {
          this.optionList2 = res['resultset'];
        }
      }

    })
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

  loanId: string;
  customerName: string;
  loanAmount: string;
  loanClassification: string;
  loanDate: string;
  getSelectedLoanDetails(e) {
    this.loanId = e.LoanId;
    this.customerName = e.CustomerName;
    this.loanAmount = e.LoanAmount;
    this.loanClassification = e.Classification;
    this.loanDate = e.LoanDate;
    // this.isLoanDataAvailable = false;
    // this.loanDetailGridOne = true;
    // this.loanDetailGridTwo = true;
    // this.installmentPendingVisibilityEvent.emit(true);
    // this.repaymentService.changeMessage(this.loanId)
    // this.loanIdEmitter.emit(this.loanId);
    // this.loanClassificationEmitter.emit(this.loanClassification);
    // this.AutoprintService.customerName = this.customerName;
    // this.AutoprintService.loanNo = this.loanId;
  }

  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
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
  submit() {
    let params = {
      reportId: +this.report,
      param1: this.loanId,
      param2: this._rptdatePipe(this.fromDate),
      param3: this._rptdatePipe(this.toDate),
      param4: this.option1,
      param5: this.option2
    }
    this.reportService.generateReport(params).subscribe(res => {
      if (res['status']['code'] == 1 && res['status']['flag'] == 1) {
        this.dataList = res['resulset'];

        this.dataSource = new MatTableDataSource<any>(this.dataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    })

  }

}
