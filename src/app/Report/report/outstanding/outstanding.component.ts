import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
export interface outstandingElement {
  LoanID: any;
  CustomerID: any;
  CustomerName: any;
  LoanDate: any;
  MaxPreApprovedAmt: any;
  LoanAmount: any;
  Phone1: any;
  InterestRate: any;
  Period: any;
}
const outstandingDatas: outstandingElement[] = [];
@Component({
  selector: 'app-outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.scss']
})
export class OutstandingComponent implements OnInit {
  dataSource = new MatTableDataSource<outstandingElement>(outstandingDatas);
  displayedColumns: string[] = ["LoanID", "CustID", "custName", "approvedAmount", "Phone", "loanDate", "LoanAmount", "InterestRate", "Period"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // 
  constructor(private dashboardService: DashBoardService) { }

  ngOnInit() {
    this.getOutstandingList()
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

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  totalLoanAmount: any = 0.00;
  totalPreApprovedAmount: any = 0.00;
  getOutstandingList() {

    this.dashboardService.getOutstandingList({flag:1})
      .subscribe(result => {
        if (result['status'].code == 1 && result['outstandingDataList']) {
          result['outstandingDataList'].forEach(element => {
            element['LoanDate'] = this._datePipe(new Date(element['LoanDate']));
          });

          var outstandingDataList = result['outstandingDataList']
          try{
            var sortedOutstandingDataList = outstandingDataList.sort(function(a, b){return (+a.LoanID) - (+b.LoanID);});
          }catch{
            var sortedOutstandingDataList = outstandingDataList;
          }
          this.dataSource = new MatTableDataSource<outstandingElement>(sortedOutstandingDataList);
          this.totalLoanAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanAmount), 0);
          this.totalPreApprovedAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.MaxPreApprovedAmt), 0);
          setTimeout(() => { this.dataSource.paginator = this.paginator; }, .01);
        }
      })
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
      doc.setFontSize(10);
      doc.setFontStyle('bold');
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      doc.text('MACOM ADMINISTRATIVE OFFICE', pageWidth / 2, 16, 'center');
      doc.setFontSize(10);
      doc.text('Outstanding Report', pageWidth / 2, 30, 'center');

      doc.autoTable({
        html: '#accountStatement',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8, halign: 'right', },
        startY: 40,
        showHead: 'firstPage',
        theme: 'grid'
      })
      doc.text(`Total loan amount: ${this.totalLoanAmount}`, 100, doc.autoTable.previous.finalY + 5);
      doc.text(`Total max. pre-approved amount: ${this.totalPreApprovedAmount}`, 100, doc.autoTable.previous.finalY + 10);
      reportName = "outstanding_report" + date + ".pdf";

      // doc.output("dataurlnewwindow");
      doc.save(reportName);
    }
  }

  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }
}
