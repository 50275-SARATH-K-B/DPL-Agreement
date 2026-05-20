import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../services/common/common.service';
import { DashBoardService } from '../../services/dashboard/dash-board.service';
let that: any;
export interface leadElement {
  leadId: string;
  customerName: string;
  contactPhoneNo: string;
  leadByName: string;
  leadStatusDescr: string;
}
const leads: leadElement[] = [];
@Component({
  selector: 'app-leads-dashboard',
  templateUrl: './leads-dashboard.component.html',
  styleUrls: ['./leads-dashboard.component.scss']
})
export class LeadsDashboardComponent implements OnInit {
  public leadList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<leadElement>(leads);
  public displayedColumns = ['leadId', 'customerName', 'contactPhoneNo', 'leadByName', 'leadStatusDescr']
  userData: any;
  constructor(    private commonService: CommonService,
    private dashBoardService: DashBoardService,
    private _dialog: MatDialog) { that = this; }
  public filter: string = "";
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getLeads();
  }
  public getLeads(): void {
    const param = {
      FirmId: this.userData['firmID'],
      BranchId: this.userData['branchID'],
      ProductType: this.userData['productID'],
      EnterBy: this.userData['empCode']
    }
    this.dashBoardService.getAllLeads(param)
    .subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['leadDataList'] !== null) {
          that.leadList = [];
          // res['leadDataList'].forEach(element => {
          //   if (+element['leadStatus'] < 10) {
          //     that.leadList.push(element);
          //   }
          // });
          that.leadList = res['leadDataList'].filter(x => +x['leadStatus'] < 10);
          this.dataSource = new MatTableDataSource(that.leadList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.dataSource.filterPredicate = (data, filter) =>
            (data.customerName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.contactPhoneNo.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              // || data.leadByName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.leadStatusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
              || data.leadId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
        } else {
          const dialogRef = this._dialog.open(AlertMessageComponenent, {
            data: { message: res['status'].message, type: "Alert" }
          });
        }
      }
    })
  };
  public filterSource(): void {
    this.dataSource.filterPredicate = (data, filter) =>
      (data.customerName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.contactPhoneNo.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.leadByName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.leadStatusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.leadId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }
}
