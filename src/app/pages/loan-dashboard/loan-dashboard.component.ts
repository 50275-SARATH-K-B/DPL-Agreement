import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../services/common/common.service';
import { FormControl } from '@angular/forms';
import { DashBoardService } from '../../services/dashboard/dash-board.service';

export interface loanElement {
  LoanID: string;
  CustomerName: string;
  ProductName: string;
  BranchName: string;
  LoanStatus: string;
}
var loanElement: loanElement[] = [];

@Component({
  selector: 'app-loan-dashboard',
  templateUrl: './loan-dashboard.component.html',
  styleUrls: ['./loan-dashboard.component.scss']
})
export class LoanDashboardComponent implements OnInit {
  applicationDatas: any;
  userData: any;

  constructor(private dashBoardService:DashBoardService, private _dialog: MatDialog, private commonService: CommonService) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = ['LoanID', 'CustomerName', 'ProductName', 'BranchName', 'LoanStatus'];
  dataSource = new MatTableDataSource<loanElement>(loanElement);
  loanFilter = new FormControl();
  nameFilter = new FormControl();
  public filter: string = "";

  ngOnInit() {
    loanElement = [];
    this.userData = this.commonService.getCredentials();
    this.getApplications();
    // this.loanFilter.valueChanges.subscribe((positionFilterValue)        => {
    //   this.dataSource.filter = positionFilterValue.trim().toLowerCase();
    //   });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  public getApplications(): void {
    this.dashBoardService.getLoanList({ FIRM_ID: this.userData['firmID'] }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loandashboardList'] !== null) {
          this.applicationDatas = res['loandashboardList'];
          this.dataSource = new MatTableDataSource(this.applicationDatas);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data, filter) =>
            (data.CustomerName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.LoanID.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.ProductName.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.BranchName.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.LoanStatus.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
        } else {
          const dialogRef = this._dialog.open(AlertMessageComponenent, {
            data: { message: res['status'].message, type: "Alert" }
          });
        }
      }
    })
  }

  public filterSource(): void {
    // if (this.filter !== "") {
    this.dataSource.filterPredicate = (data, filter) =>
      (data.CustomerName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.LoanID.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.ProductName.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.BranchName.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.LoanStatus.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    // this.dataSource.filter = this.filter.trim().toLowerCase();
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }



}
