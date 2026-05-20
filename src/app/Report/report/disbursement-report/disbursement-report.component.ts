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
  selector: 'app-disbursement-report',
  templateUrl: './disbursement-report.component.html',
  styleUrls: ['./disbursement-report.component.scss']
})
export class DisbursementReportComponent implements OnInit {
  typeId:string = '1';
  dataList: any = [];
  userData: any;
  displayedColumns: string[] = ["CustomerID","CustomerName","LoanID","Tenure","LoanAmount","LoanDate","OutStanding"];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild('paginator') paginator: MatPaginator;

  constructor(private dashboardService: DashBoardService,private datePipe: DatePipe,private dialog: MatDialog,) { }

  ngOnInit() {
    //this.getDisbursementList();
    this.dataSource.paginator = this.paginator;
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
  getDisbursementList(){
     var component = this;
    var params = {
      "FromDate": this._rptdatePipe(this.from_date),
      "ToDate":  this._rptdatePipe(this.to_date),
      "Typeid": +this.typeId
    };
    this.dashboardService.getDisbursementReportList(params).subscribe(res=>{
      if (!!res && res['status'].code == 1 && res['status'].flag == 1){
        var dataList = res['disbursementreportList'];
        // try{
        //   var sortedDataList = dataList.sort(function(a, b){return (+a.LoanID) - (+b.LoanID);});
        // }catch{
        //   var sortedDataList = dataList;
        // }

        // this.dataList = sortedDataList;

        this.dataList = dataList;

        this.dataSource = new MatTableDataSource(this.dataList);

        setTimeout(()=>{
          component.dataSource.paginator = component.paginator;
        },2);
        //this.dataSource.paginator = this.paginator;

      }else{
        this.displayMessage(res['status']['message'], "Alert");
      }
    })
  }
  size:number = 36;
  splitDataList(){
    var size = this.size;
    var arrays = [];

    var datalist = this.dataList;
    var d = [];
    var i;

    for (i = 0; i < datalist.length; i++) {
      d[i] = datalist[i];
    }

    if(d.length == 0){
      return [];
    }
    else{
      while (d.length > 0){
        arrays.push(d.splice(0, size));
      }
      return arrays;
    }
  }

  numberOfLists(){
    var datalist = this.dataList;
    var size = this.size;

    var number_of_lists = datalist.length / size; 
    return number_of_lists;

  }


  clearTable(){
    this.dataList = [];
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.paginator = this.paginator;

  }

  public minDate: any = new Date();
  to_date: any;
  from_date: any;

  public onFromDateChange(): void {
    if (this.from_date != null && this.from_date != "" && !!this.from_date) {
      this.to_date = null
      this.minDate = new Date(this.from_date);
    }
    this.clearTable();
  }
  onToDateChange(){
    this.clearTable();
  }
  onTypeIdChange(){
    this.clearTable();
  }

  // printPdf(){
  //   let date = new Date();
  //   let issueDate = this.datePipe.transform(date, 'dd/MM/yyyy');
  //   var doc = new jspdf();

  //   doc.setFontSize(11);
  //   //doc.text('Disbursement Report', 70, 20);

  //   var from_date_text = 'Report from ' + this.datePipe.transform(this.from_date, 'dd/MM/yyyy');
  //   var to_date_text = 'To ' + this.datePipe.transform(this.to_date, 'dd/MM/yyyy');

  //   var heading_text = 'Disbursement Report from ' + this.datePipe.transform(this.from_date, 'dd/MM/yyyy') + ' to ' + this.datePipe.transform(this.to_date, 'dd/MM/yyyy')
  //   doc.text(heading_text, 70, 20);

  //   // doc.setFontSize(7);
  //   // doc.text(from_date_text, 100, 20);
  //   // doc.text(to_date_text, 110, 20);

  //   doc.autoTable({
  //     html: '#disbursement-details',
  //     tableWidth: '80%',
  //     styles: { cellPadding: 0.2, fontSize: 6, halign: 'left'},
  //     headerStyles: {
  //       lineWidth: 0.06,
  //       lineColor: [217, 216, 216]
  //     },
  //     headStyles: {
  //       fillColor: 133,
  //       fontSize: 15
  //     },
  //     margin: { top: 120 },
  //     bodyStyles: {
  //       lineColor: '#ffffff'
  //     },
  //     startY: 25,
  //     showHead: 'firstPage',
  //     theme: 'grid',
  //   });


  //   var number_of_lists = this.numberOfLists();

  //   for(var l = 1;l < number_of_lists;++l){
  //     doc.addPage();
  //     var table_id = '#disbursement-details-' + String(l);
  //     doc.autoTable({
  //       html: table_id,
  //       tableWidth: '80%',
  //       styles: { cellPadding: 0.2, fontSize: 6, halign: 'left' },
  //       margin: { top: 90 },
  //       bodyStyles: {
  //         lineColor: '#ffffff'
  //       },
  //       startY: 25,
  //       showHead: 'firstPage',
  //       theme: 'grid'
  //     });
  //   }

  //   doc.save(`disbursement-report-${issueDate}.pdf`);

  // }

  print(){
    var component = this;
    let date = new Date();
    let issueDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    var doc = new jspdf();

    doc.setFontSize(11);
    //doc.text('Disbursement Report', 70, 20);

    var from_date_text = 'Report from ' + this.datePipe.transform(this.from_date, 'dd/MM/yyyy');
    var to_date_text = 'To ' + this.datePipe.transform(this.to_date, 'dd/MM/yyyy');

    var heading_text = 'Disbursement Report from ' + this.datePipe.transform(this.from_date, 'dd/MM/yyyy') + ' to ' + this.datePipe.transform(this.to_date, 'dd/MM/yyyy')
    doc.text(heading_text, 70, 20);

    var split_data_list = this.splitDataList();
    
    var body1 = split_data_list[0];
    
    var bodyList1 = body1.map((m)=>{
      return [m['CustomerID'],m['CustomerName'],m['LoanID'],m['Tenure'],m['LoanAmount'],component.datePipe.transform(m['LoanDate'], 'dd/MM/yyyy'),m['OutStanding']];

    })


    doc.autoTable({
      head: [['Customer ID','Customer Name','Loan ID','Tenure','Loan Amount','Loan Date','OutStanding']],
      body: bodyList1,
      styles:{
        fontSize:8,
        halign: 'center'
      },
      headStyles:{
        fontStyle:'bold',
        fontSize:8,
        halign:'center'
      },
      startY: 25
    });


    if(split_data_list.length > 1){
      
      for(var s=1;s< split_data_list.length; ++s){
        var split_data = split_data_list[s];
        

        var body_list =  split_data.map((m)=>{
          return [m['CustomerID'],m['CustomerName'],m['LoanID'],m['Tenure'],m['LoanAmount'],component.datePipe.transform(m['LoanDate'], 'dd/MM/yyyy'),m['OutStanding']];
        })
        

        doc.addPage();

        doc.autoTable({
          
          body: body_list,
          styles:{
            fontSize:8,
            halign: 'center'
          },
          headStyles:{
            fontStyle:'bold',
            fontSize:8,
            halign:'center'
          },
          startY: 25
        });

      }
    }

    doc.save(`disbursement-report-${issueDate}.pdf`);
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
