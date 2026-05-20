import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { MatTableDataSource, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';

export interface disbursementElement {
  CustomerID: string;
  CustomerName: string;
  LoanID: string;
  Tenure: string;
  LoanAmount: string;
  PreApprovedAmt: string;
  LoanDate: string;
  BranchID: string;
  CustID: string;
}
const disbursementDatas: disbursementElement[] = [];
@Component({
  selector: 'app-disbursement-details',
  templateUrl: './disbursement-details.component.html',
  styleUrls: ['./disbursement-details.component.scss']
})
export class DisbursementDetailsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private route: ActivatedRoute, private dashboardService: DashBoardService,@Inject(MAT_DIALOG_DATA) private data: any,) {
    this.route.params.subscribe((params: Params) => {
      if (!!params && !!params['branchID'] && !!params['from_date'] && !!params['to_date']) {
        this.searchByBranchID({ BRANCH_ID: +params['branchID'], FROM_DATE: params['from_date'], TO_DATE: params['to_date'] });

      } else {

      }
    });
  }
  dataSource = new MatTableDataSource<disbursementElement>(disbursementDatas);
  displayedColumns: string[] = ['branchID', 'CustID', 'custName', 'approvedAmount', "tenure", "loanID", "loanDate", "LoanAmount"];
  ngOnInit() {
    if(!!this.data&&!!this.data['branchID']){
      this.searchByBranchID({ BRANCH_ID: +this.data['branchID'], FROM_DATE: this.data['fromDate'], TO_DATE: this.data['toDate'] });

   }

  }

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  totalLoanAmount: any = 0.00;
  totalPreApprovedAmount: any = 0.00;
  searchByBranchID(params) {
    this.dashboardService.getDisbursementByBranchID(params)
      .subscribe(result => {
        if (result['status'].code == 1 && result['disbursementList']) {
          result['disbursementList'].forEach(element => {
            element['LoanDate'] = this._datePipe(new Date(element['LoanDate']));
          });
          this.dataSource = new MatTableDataSource<disbursementElement>(result['disbursementList']);
          this.totalLoanAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanAmount), 0);
          this.totalPreApprovedAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.PreApprovedAmt), 0);
          this.dataSource.paginator = this.paginator;
        }
      })
  }
  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }
}
