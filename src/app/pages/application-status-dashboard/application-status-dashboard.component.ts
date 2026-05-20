import { Component, OnInit, ViewChild } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { DashBoardService } from '../../services/dashboard/dash-board.service';
import { CommonService } from '../../services/common/common.service';
export interface applicationElement {
  applicationId: string;
  name: string;
  productName: string;
  branchName: string;
  statusDescr: string;
}
const applicationDatas: applicationElement[] = [];
@Component({
  selector: 'app-application-status-dashboard',
  templateUrl: './application-status-dashboard.component.html',
  styleUrls: ['./application-status-dashboard.component.scss']
})
export class ApplicationStatusDashboardComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public applicationDatas: any;
  public filter: string = "";
  displayedColumns: string[] = ['applicationId', 'name', 'productName', 'branchName', 'statusDescr'];
  dataSource = new MatTableDataSource<applicationElement>(applicationDatas);
  status: any;
  constructor(private route: ActivatedRoute,
    private _dialog: MatDialog,
    private dashboardService: DashBoardService,
    private commonService: CommonService,
    private router: Router) {
    this.route.params.subscribe((params: Params) => {
      if (!!params) {
        this.status = params['id'];
        // this.searchAppId(this.ApplicationID);
      } else {

      }
    });
  }
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials()
    this.getApplicationDetails()
  }

  getApplicationDetails() {
    this.dashboardService.getApplicationsByStatus({ status: +this.status, productID: +this.userData['productID'], userID: this.userData['empCode'], functionID: 6 })
      .subscribe(res => {
        if (!!res && res['status'].code == 1) {
          if (res['applicationDatas'] !== null) {
            this.applicationDatas = res['applicationDatas'];
            this.dataSource = new MatTableDataSource(this.applicationDatas);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource.filterPredicate = (data, filter) =>
              (data.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
                || data.applicationId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
                || data.productName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
                || data.statusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
                || data.branchName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
          } else {
            const dialogRef = this._dialog.open(AlertMessageComponenent, {
              data: { message: res['status'].message, type: "Alert" }
            });
          }
        }
      })
  }



  public filterSource(): void {
    this.dataSource.filterPredicate = (data, filter) =>
      (data.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.applicationId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.productName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.statusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.branchName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }
}
