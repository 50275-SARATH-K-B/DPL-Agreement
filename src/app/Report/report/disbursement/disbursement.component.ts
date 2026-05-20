import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { DisbursementDetailsComponent } from '../disbursement-details/disbursement-details.component';
import { CommonService } from '../../../services/common/common.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';

export interface applicationElement {
  BranchID: string;
  BranchName: string;
  LoanAmount: string;
  PreApprovedAmt: string;
  LoanCount: string;
}
const customerDatas: applicationElement[] = [];
@Component({
  selector: 'app-disbursement',
  templateUrl: './disbursement.component.html',
  styleUrls: ['./disbursement.component.scss']
})
export class DisbursementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public settings: Settings;
  constructor(public appSettings: AppSettings, public commonService: CommonService, private dashBoardService: DashBoardService, private _dialog: MatDialog) {
    this.settings = this.appSettings.settings;
  }
  customerDatas: any;
  userData: any;
  displayedColumns: string[] = ['branchID', 'branchName', 'count', 'approvedAmount', "loanAmount"];
  dataSource = new MatTableDataSource<applicationElement>(customerDatas);
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.to_date = new Date();
    this.from_date = new Date(this.to_date.getFullYear(), this.to_date.getMonth(), 1);
    this.getDisbursementDetails();
    this.onFromDateChange();
    this.to_date = new Date();
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

  dateFrom: any;
  totalLoanAmount: any = 0.00;
  totalPreApprovedAmount: any = 0.00;
  dateTo: any;
  totalLoanCount: any = 0.00;
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
  public getDisbursementDetails(): void {
    if (!!this.from_date && !!this.to_date) {
      this.dateFrom = this._rptdatePipe(this.from_date)
      this.dateTo = this._rptdatePipe(this.to_date)
      let params = {
        FROM_DATE: this.dateFrom,
        TO_DATE: this.dateTo
      }
      this.settings.loadingSpinner = true;

      this.dashBoardService.getDisbursementList(params)
        .subscribe(res => {
          this.settings.loadingSpinner = false;
          if (!!res && res['status'].code == 1) {
            if (res['disbursementDtls'] !== null) {
              let disbursementList = res['disbursementDtls'];
              this.customerDatas = this.userData['branchID'] == 0 ? disbursementList : disbursementList.filter(s => s.BranchID == this.userData['branchID']);
              this.dataSource = new MatTableDataSource(this.customerDatas);
              setTimeout(() => this.dataSource.paginator = this.paginator);
              this.totalLoanCount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanCount), 0);
              this.totalLoanAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanAmount), 0);
              this.totalPreApprovedAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.PreApprovedAmt), 0);
              setTimeout(() => { this.dataSource.paginator = this.paginator; }, .01);
            } else {
              const dialogRef = this._dialog.open(AlertMessageComponenent, {
                width: "30%",
                data: { message: res['status'].message, type: "Alert" }
              });
            }
          } else {
            const dialogRef = this._dialog.open(AlertMessageComponenent, {
              width: "30%",
              data: { message: res['status'].message, type: "Alert" }
            });
          }
        }, error => {
          this.settings.loadingSpinner = false;
        })
    }
  }
  print() {
    let date = new Date();
    let issueDate = (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + '/' + ((date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '/' + date.getFullYear()
    var doc = new jspdf();
    doc.setFontSize(22);
    doc.text('Disbursement Report', 70, 20);
    doc.autoTable({
      html: '#disbursement-details',
      tableWidth: '80%',
      styles: { cellPadding: 0.4, fontSize: 8, border: 1, margin: 130, halign: 'left', headStyles: { fillColor: 20 } },
      margin: { top: 90 },
      bodyStyles: {
        lineColor: '#000000'
      },
      startY: 25,
      theme: 'grid'
    });
    doc.setFontSize(9);
    doc.text(`Issue Date: ${issueDate}`, 155, 12);
    doc.autoTable({
      html: '#total-details',
      tableWidth: '80%',
      styles: { cellPadding: 0.4, fontSize: 8, border: 0, margin: 130, halign: 'left', headStyles: { fillColor: 20 } },
      margin: { top: 90 },
      bodyStyles: {
        lineColor: [0, 0, 0, 0]
      },
      startY: doc.autoTable.previous.finalY + 5,
      theme: 'grid'
    });
    doc.save(`disbursement-report-${issueDate}.pdf`);
  }

  getDisbursementDataList(branchID) {
    const dialogRef = this._dialog.open(DisbursementDetailsComponent, {
      width: '80%',
      height: '70%',
      data: { fromDate: this.dateFrom, toDate: this.dateTo, branchID: +branchID }
    });
  }

}
