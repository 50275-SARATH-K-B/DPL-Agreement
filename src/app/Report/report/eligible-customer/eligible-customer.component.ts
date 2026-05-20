import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CustomerLoanComponent } from '../customer-loan/customer-loan.component';
import { CommonService } from '../../../services/common/common.service';
export interface applicationElement {
  BranchID: string;
  BranchName: string;
  CustCount: string;
  ApprovedAmount: string;
}
const customerDatas: applicationElement[] = [];
@Component({
  selector: 'app-eligible-customer',
  templateUrl: './eligible-customer.component.html',
  styleUrls: ['./eligible-customer.component.scss']
})

export class EligibleCustomerComponent implements OnInit {
  public settings: Settings;
  constructor(public appSettings: AppSettings, public commonService: CommonService, public dashBoardService: DashBoardService, private _dialog: MatDialog) {
    this.settings = this.appSettings.settings;
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public userData: any;
  public customerDatas: any;
  displayedColumns: string[] = ['branchID', 'branchName', 'count', 'amount'];
  dataSource = new MatTableDataSource<applicationElement>(customerDatas);
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getEligibleCust();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

  }

  filter: any;
  total: any = 0.00;
  public getEligibleCust(): void {
    this.customerDatas = [];
    this.dataSource = new MatTableDataSource(this.customerDatas);
    this.settings.loadingSpinner = true;
    this.dashBoardService.getEligibleCust()
      .subscribe(res => {
        this.settings.loadingSpinner = false;
        if (!!res && res['status'].code == 1) {
          if (res['eligibleCustList'] !== null) {
            let eligibleList = res['eligibleCustList'];
            this.customerDatas = this.userData['branchID'] == 0 ? eligibleList : eligibleList.filter(s => s.BranchID == +this.userData['branchID']);

            this.dataSource = new MatTableDataSource(this.customerDatas);
            this.total = this.dataSource.data.reduce((accum, curr) => +(accum + curr.ApprovedAmount), 0);
            setTimeout(() => { this.dataSource.paginator = this.paginator; }, .01);
          } else {
            this.displayMessage(res['status'].message, "Alert");
          }
        } else {
          this.displayMessage(res['status'].message, "Alert");
        }
      }, error => {
        this.settings.loadingSpinner = false;
      })
  }

  displayMessage(message: string, type: string) {
    const dialogRef = this._dialog.open(AlertMessageComponenent, {
      width: "30%",
      data: { message: message, type: type }
    });
  }

  getCustomerLoanDetails(branchID) {
    const dialogRef = this._dialog.open(CustomerLoanComponent, {
      width: '80%',
      height: '80%',
      data: { branchID: branchID }
    });
  }

  public filterSource(): void {
    // if (this.filter !== "") {
    this.dataSource.filterPredicate = (data, filter) =>
      (data.BranchName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.BranchID.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.CustCount.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.ApprovedAmount.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
      );
    this.dataSource.filter = this.filter.trim().toLowerCase();

    this.total = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.ApprovedAmount), 0);
    // }

  }
}
