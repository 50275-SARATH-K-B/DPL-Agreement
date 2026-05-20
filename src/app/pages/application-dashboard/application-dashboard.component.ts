import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-application-dashboard',
  templateUrl: './application-dashboard.component.html',
  styleUrls: ['./application-dashboard.component.scss']
})

export class ApplicationDashboardComponent implements OnInit {

  constructor(public commonService: CommonService,
    private _dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router) { }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public applicationDatas: any;
  public filter: string = "";
  public userData: object;
  displayedColumns: string[] = ['applicationId', 'name', 'productName', 'branchName', 'statusDescr'];
  dataSource = new MatTableDataSource<applicationElement>(applicationDatas);
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getApplications();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  
  // public gotoApplication(applicationId):void{
  //   this.router.navigate(['/los/applicationdetails', {applicationId:applicationId}]);
  // }

  public getApplications(): void {
    const params = {
      FirmID: +this.userData['firmID'],
      BranchID: +this.userData['branchID'],
      ProductID: +this.userData['productID'],
      EnterBy: this.userData['empCode'].toString(),
      functioID: 65
    }
    this.commonService.getApplicationList(params).subscribe(res => {
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
    // if (this.filter !== "") {
    this.dataSource.filterPredicate = (data, filter) =>
      (data.name.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.applicationId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.productName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.statusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.branchName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();
    // }
  }
}
