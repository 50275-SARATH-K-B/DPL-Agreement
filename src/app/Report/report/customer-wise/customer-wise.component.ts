import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';

import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../services/report/common.service';

import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-customer-wise',
  templateUrl: './customer-wise.component.html',
  styleUrls: ['./customer-wise.component.scss']
})
export class CustomerWiseComponent implements OnInit {
  userData: any;

  fromDate: any;

  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['CustomerId', 'CustomerName', 'LoanNo', 'LoanDate', 'LoanAmount', 'LoanBalance', 'DebtorsBalance'];

  showGeneratePdf: boolean = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  totalLoanAmount: any = 0;
  totalLoanBalance: any = 0;
  totalDebtorsBalance: any = 0;
  today: Date = new Date()

  constructor(private dialog: MatDialog, private datePipe: DatePipe,
    private dashboardService: DashBoardService, private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.dataSource.paginator = this.paginator;
  }

  onFromDateChange() {
    this.clearGrid();
  }

  clearGrid() {
    var dataList = [];
    this.dataSource = new MatTableDataSource<any>(dataList);
    this.dataSource.paginator = this.paginator;
    this.showGeneratePdf = false;

    this.calculateTotal();

  }

  getReport() {
    this.getCustomerOutstandingList();
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
  getCustomerOutstandingList() {
    var params = {
      BRANCH_ID: 0,
      FromDATE: this._rptdatePipe(this.fromDate),
      productId: this.userData['productID']
    }


    this.showGeneratePdf = false;

    this.dashboardService.getCustomerOutstandingList(params).subscribe(res => {
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        var dataList = res["custoutstandingDataList"];
        this.dataSource = new MatTableDataSource<any>(dataList);
        this.dataSource.paginator = this.paginator;
        this.showGeneratePdf = true;

        this.calculateTotal();

      } else {
        this.clearGrid();
        this.displayMessage(res['status']['message'], "Alert");
      }

    })

  }

  calculateTotal() {
    var totalLoanAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanAmount), 0);
    this.totalLoanAmount = totalLoanAmount.toFixed(2);


    var totalLoanBalance = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanBalance), 0);
    this.totalLoanBalance = totalLoanBalance.toFixed(2);


    var totalDebtorsBalance = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.DebtBalance), 0);
    this.totalDebtorsBalance = totalDebtorsBalance.toFixed(2);

  }

  public convert(): void {
    if (this.dataSource.data.length > 0) {
      var doc = new jspdf();
      const date = this._datePipe(new Date());
      let reportName = "report" + date + ".pdf";
      jspdf.autoTableSetDefaults({
        columnStyles: { id: { fontStyle: 'bold' } },
        headStyles: { fillColor: 0 },
      });
      doc.setFontSize(12);
      doc.setFontStyle('bold');
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      doc.text('MACOM ADMINISTRATIVE OFFICE', pageWidth / 2, 16, 'center');
      doc.setFontSize(10);
      doc.text('Customer Outstanding Report', pageWidth / 2, 30, 'center');

      doc.autoTable({
        html: '#accountStatement',
        tableWidth: '100%',
        styles: { cellPadding: 0.2, fontSize: 6, halign: 'left', },
        startY: 40,
        showHead: 'firstPage',
        theme: 'grid'
      })
      doc.text(`Total loan amount: ${this.totalLoanAmount}`, 100, doc.autoTable.previous.finalY + 5);
      doc.text(`Total loan balance: ${this.totalLoanBalance}`, 100, doc.autoTable.previous.finalY + 10);
      doc.text(`Total debtors balance: ${this.totalDebtorsBalance}`, 100, doc.autoTable.previous.finalY + 15);

      reportName = "customer_wise_report" + date + ".pdf";

      // doc.output("dataurlnewwindow");
      doc.save(reportName);
    }
  }

  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  displayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
