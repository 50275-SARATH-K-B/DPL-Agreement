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
  selector: 'app-due-list',
  templateUrl: './due-list.component.html',
  styleUrls: ['./due-list.component.scss']
})
export class DueListComponent implements OnInit {
  userData: any;
  fromDate:any;
  toDate:any;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['LoanNo','Customerid','CustomerName','PhoneNo','LoanDate','LoanAmount','DueDate','DueAmount','LoanBalance','DebtorsBalance'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  showGeneratePdf:boolean = false;

  today:any = new Date();

  totalLoanAmount:any = 0;
  totalDueAmount:any = 0;
  totalDebtorsBalance:any = 0;

  constructor(private dialog: MatDialog,private datePipe: DatePipe,
    private dashboardService: DashBoardService,private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.dataSource.paginator = this.paginator;
  }

  onFromDateChange(){

  }

  onToDateChange(){
    var component =  this;
    if(!this.fromDate){      
      this.displayMessage("Please set report from date first ", "Alert");
      setTimeout(()=>{
        component.fromDate = undefined;
        component.toDate = undefined;

      },4);
      
      return;
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
  getDueList(){
    var params = {
      BRANCH_ID:0,
      "FromDate": this._rptdatePipe(this.fromDate),
      "ToDate": this._rptdatePipe(this.toDate),
      productId:this.userData['productID']
    }


    this.showGeneratePdf = false;

    this.dashboardService.getDueListReport(params).subscribe(res=>{
      if(res['status']['flag'] == 1 && res['status']['code'] == 1){
        var dueDataList = res['dueDataList'];
        try{
          var sortedDueDataList = dueDataList.sort(function(a, b){return (+a.LoanID) - (+b.LoanID);});
        }catch{
          var sortedDueDataList = dueDataList;
        }
        
        this.dataSource = new MatTableDataSource<any>(sortedDueDataList);
        this.dataSource.paginator = this.paginator;
        this.showGeneratePdf =  true;

        
        var totalLoanAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.LoanAmt), 0);
        this.totalLoanAmount = totalLoanAmount.toFixed(2);

        var totalDueAmount = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.DueAmt), 0);
        this.totalDueAmount = totalDueAmount.toFixed(2);

        var totalDebtorsBalance = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.DebtorsBal), 0);
        this.totalDebtorsBalance = totalDebtorsBalance.toFixed(2);

        
      }else{
        this.displayMessage(res['status']['message'], "Alert");
      }
      
    })
  }

  getReport(){
    this.getDueList();
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
      doc.text('Due List Report', pageWidth / 2, 30, 'center');

      doc.autoTable({
        html: '#accountStatement',
        tableWidth: '100%',
        styles: { cellPadding: 0.2, fontSize: 6, halign: 'left', },
        startY: 40,
        showHead: 'firstPage',
        theme: 'grid'
      })
      doc.text(`Total loan amount: ${this.totalLoanAmount}`, 100, doc.autoTable.previous.finalY + 5);
      doc.text(`Total due amount: ${this.totalDueAmount}`, 100, doc.autoTable.previous.finalY + 10);
      doc.text(`Total debtors balance: ${this.totalDebtorsBalance}`, 100, doc.autoTable.previous.finalY + 15);

      reportName = "due_list_report" + date + ".pdf";

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
