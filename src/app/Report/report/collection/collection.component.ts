import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../services/common/common.service';
export interface collectionElement {
  BranchID: string;
  BranchName: string;
  LoanCount: string;
  CollectionAmount: string;
}
const collectionDatas: collectionElement[] = [];
@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss']
})
export class CollectionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['branchID', 'branchName', 'count', 'CollectionAmount'];
  dataSource = new MatTableDataSource<collectionElement>(collectionDatas);
  public settings: Settings;
  constructor(public appSettings: AppSettings, public commonService: CommonService, private dashBoardService: DashBoardService, private _dialog: MatDialog) {
    this.settings = this.appSettings.settings;
  }
  collectionDatas: any;
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.to_date = new Date();
    this.from_date = new Date(this.to_date.getFullYear(), this.to_date.getMonth(), 1)
    this.getDisbursementDetails();
    this.onFromDateChange();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;


  }


  filter: any;
  to_date: any;
  from_date: any;
  filterDate(date) {
    const month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];
    const day = (new Date(date)).getDate();
    const month_index = (new Date(date)).getMonth();
    const year = (new Date(date)).getFullYear();
    return day + "-" + month_names[month_index] + "-" + year;
  }
  public minDate: any = new Date();
  public onFromDateChange(): void {
    if (this.from_date != null && this.from_date != "" && !!this.from_date) {
      this.to_date = null
      this.minDate = new Date(this.from_date);
    }
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
  dateFrom: any;
  dateTo: any;
  total: any = 0.00;
  totalCount: any = 0.00;
  public getDisbursementDetails(): void {
    if (!!this.from_date && !!this.to_date) {
      this.dateFrom = this._rptdatePipe(this.from_date)
      this.dateTo = this._rptdatePipe(this.to_date)

      let params = {
        FROM_DATE: this.dateFrom,
        TO_DATE: this.dateTo,
        flag: 1
      }
      this.settings.loadingSpinner = true;
      this.dashBoardService.getCollectionList(params)
        .subscribe(res => {
          this.settings.loadingSpinner = false;
          if (!!res && res['status'].code == 1) {
            if (res['collectionDtls'] !== null) {
              let collectionDataList = res['collectionDtls'];
              this.collectionDatas = this.userData['branchID'] == 0 ? collectionDataList : collectionDataList.filter(s => s.BranchID == +this.userData['branchID']);
              this.dataSource = new MatTableDataSource(this.collectionDatas);
              this.totalCount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanCount), 0);
              this.total = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.CollectionAmount), 0);
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
  }


  displayMessage(message: string, type: string) {
    const dialogRef = this._dialog.open(AlertMessageComponenent, {
      width: "30%",
      data: { message: message, type: type }
    });
  }
}
