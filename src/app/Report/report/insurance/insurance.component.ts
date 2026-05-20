import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../../services/common/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { EnachService } from '../../../services/report/enach.service';
import { RepaymentService } from '../../../services/report/repayment.service';
import { from } from 'rxjs';
import * as jspdf from 'jspdf';
import { ExportService } from '../../../services/reports/export.service';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';

// export interface Installment {
//   LOAN_ID: string;
//   DUE_DATE: string;
//   INTEREST_AMOUNT: number;
//   LATE_FEE: number;
//   INSTALLMENT_AMOUNT: number;
//   position: number;
//   CUSTOMER_ID: string;
//   CUSTOMER_NAME: number;
//   MandateCode: string;
// }
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.scss']
})
export class InsuranceComponent implements OnInit {

  @ViewChild('ref') checkboxRef: ElementRef;
  public field: any = null;
  private userData: any;
  public paymentModeList: Array<object> = [];
  public selectedDatas: Array<object> = [];
  // public selection = new SelectionModel<Installment>(true, []);
  public displayedColumns: string[] = ['loaN_NO', 'customeR_NAME', 'amount', 'type', 'customeR_ID', 'loaN_AMOUNT', 'valuE_DT','interesT_RATE','customeR_ADDRESS','customeR_DOB','customeR_GENDER','customeR_PIN','customeR_SALUTATION','customeR_STATE','nomineE_ADREE','nomineE_DOB','nomineE_GENDER','nomineE_NAME','nomineE_RELATION','nomineE_SALUTATION','period','pincode','statecode'];
  // public displayedColumns: string[] = ['LoanNo', 'CustomerName', 'amount', 'type', 'customeR_ID', 'loaN_AMOUNT', 'valuE_DT','interesT_RATE'];

  installmentList:any[]=[];
  public disabled: boolean = false;
  presentationDate: any;  
  public filter: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // dataSource = new MatTableDataSource<[]>(this.installmentList);
  public dataSource = new MatTableDataSource([]);
  public settings: Settings;

  //repaymentService: any;
  constructor(private enachService: EnachService,
    private commomService: CommonService, private repaymentService: RepaymentService,
    private dialog: MatDialog,public appSettings: AppSettings,
    private datePipe: DatePipe,private exportService: ExportService) {     this.settings = this.appSettings.settings;
    }

  ngOnInit() {
   
    this.userData = this.commomService.getCredentials();
    this.commomService.session()

    this.field = {
      dueDate: '',
    }

    this.getInstallmentdetailsByDate()
      // paymentModeID: '',
      // paymentMode: ''
    // }
    // this.getPaymentModes();
    // this.field['paymentModeID'] = '92';

  }

  exportPDF(){
    var doc = new jspdf();
    jspdf.autoTableSetDefaults({
      columnStyles: { id: { fontStyle: 'bold' } },
      headStyles: { fillColor: 0 },
    });
    doc.setFontSize(14);
    doc.setFontStyle('bold');
    var report_name = "InsuranceData"
    doc.text(report_name, 55, 16);
    doc.autoTable({
      html: '#reportTable',
      tableWidth: '80%',
      styles: { cellPadding: 0.4, fontSize: 8, border: 2, margin: 130 },
      margin: { top: 90 },
      bodyStyles: { lineColor: '#4CAF50' },
      startY: 20,
      showHead: 'firstPage',
      theme: 'grid'
    });
    doc.save(`${"InsuranceData"}.pdf`);
  }
  ExportExcel(){
    let item = {};
    let dataArray = [];
    for (let i = 0; this.displayedColumns['length'] > i; i++) {
      item[this.displayedColumns[i]] = this.displayedColumns[i];
      if (this.displayedColumns['length'] == i + 1) {
        dataArray.push(item);
        dataArray = dataArray.concat(this.installmentList)
        var report_name = "InsuranceData"
        // if(report_name.length >30){

        //   var report_name1 = this.levelZeroData['params'].reportName;
        //    report_name = report_name1.replace("-", ""); 
        //   console.log(report_name)
        // }

        this.exportService.exportAsExcelFile(dataArray, report_name);
      }
    }
  }
  public getInstallmentdetailsByDate(): void {
    this.installmentList = [];
    this.dataSource = new MatTableDataSource(this.installmentList);
    this.settings.loadingSpinner = true;

    this.enachService.insruanceData().subscribe(res => {
      if (!!res && res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;

        if (!!res && res['insurancelist'].length > 0) {
          this.installmentList = res['insurancelist'];
console.log(this.installmentList)

          console.log(this.installmentList);
          this.dataSource = new MatTableDataSource(this.installmentList);
          setTimeout(() => { this.dataSource.paginator = this.paginator; }, .3);
        }
      } else {
        this.settings.loadingSpinner = false;

        this.displayMessage({ message: res['status'].message, type: "Alert" });
        // presentationForm.resetForm();
      }
    })
  }
 
  private displayMessage(params): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: params['message'], type: params['type'] }
    });
  }

  public clear(presentationForm): void {
    presentationForm.resetForm();
    // this.selection.clear();
    this.installmentList = [];
    this.dataSource = new MatTableDataSource(this.installmentList);
    // this.getPaymentModes();
    // setTimeout(() => {
    //   this.field['paymentModeID'] = '92';
    // }, .01);
    this.disabled = false;
    this.selectedDatas = [];
    this.checkboxRef['checked'] = false;

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
  mailsend(){
    
  }
confirm(){
// console.log(this._rptdatePipe(fromdate))
// console.log(this._rptdatePipe(todate))
let params = {
  "FromDt": "",
  "ToDt": ""
}
console.log(params)
this.enachService.insruanceDate(params).subscribe(res => {
  if (res['status'].flag == 1 && res['status'].code == 1) {
    this.displayMessage({ message: res['status'].message, type: "Success" });

  }else{
    this.displayMessage({ message: res['status'].message, type: "Alert" });

  }
})
}
hello(userdata){
  console.log(userdata)
}

 
  search() {
    var component = this;
    this.filterSource();
    setTimeout(function () { component.filterSource(); }, 5);
   
  }

  public filterSource(): void {

    this.dataSource.filterPredicate = (data, filter) =>
      (data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.applicationId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.productName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.statusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();

  }

}
