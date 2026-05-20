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
  selector: 'app-rbi-report',
  templateUrl: './rbi-report.component.html',
  styleUrls: ['./rbi-report.component.scss']
})
export class RbiReportComponent implements OnInit {
  from_date:any;
  max = new Date()
  userData: any;
  rbiData:any = {};
  showTable:boolean =  false;
  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private dashboardService: DashBoardService,private datePipe: DatePipe,private dialog: MatDialog,) { }

  ngOnInit() {
  }

  onFromDateChange(){

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
  getRbiReportList(){
    this.rbiData = {};
    this.showTable = false;
    var component = this;
    var params = {
      "FromDate":this._rptdatePipe(this.from_date)  
    };
    this.dashboardService.getWeeklyReturnRBIReport(params).subscribe(res=>{
      if(res['status']['flag'] == 1 && res['status']['code'] == 1){
        var data = res['weeklyreturnreportList'][0];
        this.rbiData = data;
        this.showTable = true;

      }else{
        this.displayMessage(res['status']['message'], "Alert");
      }
      
    });
  }

  print(){
    let date = new Date();
    let issueDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    var doc = new jspdf();

    var heading_text = 'RBI Report';
    doc.text(heading_text, 92, 20);

    doc.autoTable({
      head: [['Data Items', 'Balance at the beginning of the week (Rs in lakh)', 'During the week(Rs in lakh)','Expected next week(Rs in lakh)']],
      body: [
        ['Collections from Loans & Advances', this.rbiData['OutStanding'], this.rbiData['COLLECTION_AMOUNT'],this.rbiData['billingamount']],
        ['Interest Received on Loans & Advances', '', this.rbiData['InterestRecvd'],this.rbiData['InterestAmount']],
        ['Loan Disbursements', '', this.rbiData['DisbursedAmount'],'']
      ],
      styles:{
        fontSize:8,
        halign:'center'
      },
      headStyles:{
        fontStyle:'bold',
        fontSize:8,
        halign:'center'
      },
      startY: 25
    });

    doc.save(`rbi-report-${issueDate}.pdf`);




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
