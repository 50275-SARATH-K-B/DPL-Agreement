import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../services/report/report.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { CommonService } from '../../../services/report/common.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-account-statement-installment-schedule',
  templateUrl: './account-statement-installment-schedule.component.html',
  styleUrls: ['./account-statement-installment-schedule.component.scss']
})
export class AccountStatementInstallmentScheduleComponent implements OnInit {
  public field: object;
  public customerDetails: object;
  public accountStatementList: Array<object> = [];
  public installmentScheduleList: Array<object> = [];
  public minDate: any = new Date();
  private userData: object;
  public custAddress1 : any ;
  public custAddress2 : any ;
  public custAddress3 : any ;
  public custAddress4 : any ;
  public myDate : any ; 
  public time : any ; 
  format_FromDt : any ;
  formatToDt : any ;
  public monthsArray = [
    { id: 1, name: 'Jan' },
    { id: 2, name: 'Feb' },
    { id: 3, name: 'Mar' },
    { id: 4, name: 'Apr' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' }, 
    { id: 7, name: 'Jul' },
    { id: 8, name: 'Aug' },
    { id: 9, name: 'Sep' },
    { id: 10, name: 'Oct' },
    { id: 11, name: 'Nov' },
    { id: 12, name: 'Dec' },
  ];
  npa_category: any;
  accounting_classification: any;
  npa_date: any;
  npa_release_date: any;
  loantenure: any;
  custname: any;
  totalinstallments: any;
  installmentpaid: any;
  unpaid: any;
  constructor(private _reportsService: ReportService,
    private commonService: CommonService,private datepipe : DatePipe,
    private _dialog: MatDialog) { }
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    console.log(this.userData)
    this._init();
    this.myDate = new Date();
    setInterval(() => {
      this.time = new Date();
    }, 1);
  }

  /**
   * @author Niphy Anto
   * 
   * @summary function to initialize variables
   */
  private _init(): void {
    this.field = {
      loanNo: "",
      accountNo: "",
      type: "",
      from_date: "",
      to_date: ""
    }
  }

  public onTypeSelect(): void {
    this.field['loanNo'] = null;
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

  private getAccountStatement(): void {
    
    this.accountStatementList = [];
    this.installmentScheduleList = [];
    this.customerDetails = undefined;  
    this.format_FromDt=this.datePipe(this.field['from_date']);
    this.formatToDt= this.datePipe(this.field['to_date']);
    const params2 = {
      loan_id:this.field['loanNo']
    }
    
    this._reportsService.getsoadetails(params2).subscribe(res=>{
    this.npa_category =res['dataList'][0]['npa_category']
    this.accounting_classification = res['dataList'][0]['accounting_classification']
    this.npa_date = res['dataList'][0]['npa_date']
    if(res['dataList'][0]['npa_release_date'] == null){
      this.npa_release_date = undefined

    }else{
      this.npa_release_date = res['dataList'][0]['npa_release_date']

    }
    console.log(true)
    })

    const params = {
      FirmID: 1,
      LoanNo: this.field['loanNo'],
      AccountNo: +this.field['accountNo'],
      FromDt: this._rptdatePipe(this.field['from_date']),
      ToDt: this._rptdatePipe(this.field['to_date']),
    }

    this._reportsService.getAccountStatement(params)
      .subscribe((res) => {
        if (!!res && res['status'].code == 1) {
          res['accountStmtList'].forEach(element => {
            let date = element['Tradt'].split('-');
            let dateObj = this.monthsArray.find(s => s.name == date[1]);
            let monthId = dateObj.id;
            let dateString = date[0]+'/'+ monthId + '/'  + date[2];
            element['Tradt']= dateString;
           // element['Tradt'] = this._datePipe(new Date(element['Tradt']));
          });
          this.accountStatementList = res['accountStmtList'];
        } else {
          this._displayMesage({ type: "Alert", message: res['status'].message })
        }
      })
      let param ={
        FirmID : this.userData['firmID'],
        LoanNo : this.field['loanNo'],
      }

  this._reportsService.getCustDetails(param).subscribe(res=>{
    if(!!res &&  res['status'].code == 1){
      this.customerDetails = res['customerDtlsList'][0];
      console.log(this.customerDetails)
       let dateObject = this.customerDetails['LoanDate'].split('T')
        let date =   dateObject[0].split('-');
        let dateString = date[0]+'/'+date['1'] + '/' + '/' + date[2];
        this.customerDetails['LoanDate']= dateString;
        this.loantenure = this.customerDetails['Tenure']
       //element['Tradt'] = this._datePipe(new Date(element['Tradt']));
      //  this.custAddress1 = this.customerDetails['HouseName'] + ","+this.customerDetails['AddressLine2']+ "," +(this.customerDetails['AddressLine3']!=null)?this.customerDetails['AddressLine3']:""+"-"+ this.customerDetails['Pincode'];
        this.custAddress1 = this.customerDetails['HouseName'];
        this.custAddress2 = this.customerDetails['AddressLine2'];
        this.custAddress3= this.customerDetails['Pincode'];
        this.accountstatment()

      
    
    }

  },err=>{

  })
  }

  private _getAccountStatements(params): void {
    this.accountStatementList = [];
    this.installmentScheduleList = [];
    this._reportsService.getAccountStatement(params).subscribe((res) => {
      if (!!res && res['status'].code == 1) {
        if (res['accountStmtList'] !== null) {
          res['accountStmtList'].forEach(element => {
            element['Tradt'] = this._datePipe(new Date(element['Tradt']));
          });
          this.accountStatementList = res['accountStmtList'];
        }
      } else {
        this._displayMesage({ type: "Alert", message: res['status'].message })
      }
    })
  }
  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }


  private datePipe(date): string {
    const month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"]; 
    const day = (new Date(date)).getDate();
    const month_index = (new Date(date)).getMonth();
    const year = (new Date(date)).getFullYear();
    return day + "-" + month_names[month_index] + "-" + year;
  };

  private _getInstallmentSchedules(params): void {
    
    this.accountStatementList = [];
    this.installmentScheduleList = [];
    this._reportsService.getInstallmentSchedule(params).subscribe((res) => {
        if (!!res && res['status'].code == 1) {
          if (res['instScheduleList'] !== null) {
            res['instScheduleList'].forEach(element => {
              let date = element['DueDate'].split('-')
              element['DueDate'] = this._datePipe(new Date(date[1] + '-' + date[0] + '-' + date[2]));
            });
            this.installmentScheduleList = res['instScheduleList'];
            console.log(this.installmentScheduleList)
          }
        } else {
          this._displayMesage({ type: "Alert", message: res['status'].message })
        }
      })
      const params2 = {
        loan_id:this.field['loanNo']
      }
      
      this._reportsService.getsoadetails(params2).subscribe(res=>{
        
      this.npa_category =res['dataList'][0]['npa_category']
      this.accounting_classification = res['dataList'][0]['accounting_classification']
      // this.npa_date = res['dataList'][0]['npa_date']
      // this.npa_release_date = res['dataList'][0]['npa_release_date']
      this.npa_date = res['dataList'][0]['npa_date']
      console.log(this.npa_date)
      // console.log(this.datepipe.transform(this.npa_date,'dd-MM-yyyy'))
    if(res['dataList'][0]['npa_release_date'] == null){
      this.npa_release_date = undefined

    }else{
      this.npa_release_date = res['dataList'][0]['npa_release_date']

    }
      console.log(true)
      })
      let param ={
        FirmID : this.userData['firmID'],
        LoanNo : this.field['loanNo'],
      }

  this._reportsService.getCustDetails(param).subscribe(res=>{
    if(!!res &&  res['status'].code == 1){
      this.customerDetails = res['customerDtlsList'][0];
      console.log(this.customerDetails)
       let dateObject = this.customerDetails['LoanDate'].split('T')
        let date =   dateObject[0].split('-');
        let dateString = date[0]+'/'+date['1'] + '/' + '/' + date[2];
        this.customerDetails['LoanDate']= dateString;
        this.loantenure = this.customerDetails['Tenure']

       //element['Tradt'] = this._datePipe(new Date(element['Tradt']));
      //  this.custAddress1 = this.customerDetails['HouseName'] + ","+this.customerDetails['AddressLine2']+ "," +(this.customerDetails['AddressLine3']!=null)?this.customerDetails['AddressLine3']:""+"-"+ this.customerDetails['Pincode'];
        this.custAddress1 = this.customerDetails['HouseName'];
        this.custAddress2 = this.customerDetails['AddressLine2'];
        this.custAddress3= this.customerDetails['Pincode'];
        this.accountstatment()


      
    
    }

  },err=>{

  })
  }

  public search(reportForm): void {
    this.customerDetails = undefined ;
    // this.loantenure = undefined
   
    if (this.field['type'] == 'accountStatement') {
      this.getAccountStatement();
    } else {
      // let params = {
      //   ROI: 0,
      //   LOAN_AMT: 0,
      //   SCHEME_ID: 99,
      //   TENURE_DTLS: this.field['loanNo'],
      //   TENURE: 0,
      // }
      let params = {
        "ROI": 0,
        "LoanAmt": 0,
        "SchemeID": 99,
        "TenureDtls":this.field['loanNo'],
        "Tenure": 0
      }
      this._getInstallmentSchedules(params);

    }
    

  }
  private _displayMesage(params): void {
    const dialogRef = this._dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: params['message'], type: params['type'] }
    });
  }
  accountstatment(){
    this.custname = ""
    this.totalinstallments =""
    this.installmentpaid = ""
    this.unpaid = ""
    let params = {
      "LoginID":this.customerDetails['CustID']
    }
    
    this.commonService.accountdetail(params).subscribe(res=>{
    
      this.custname = res['customerDetailsList'][0]['CustName']
      let list = this.custname.split('^')
      this.totalinstallments = list['5']
      this.installmentpaid = list['4']
      this.unpaid = list['6']

    })
  }
  public convert(): void {
    
    if (this.accountStatementList.length >= 0 || this.installmentScheduleList.length >= 0) {
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

      doc.text("Manappuram Finance Limited", pageWidth / 2, 16, 'center');

      if (!!this.customerDetails) {
      //  var custableId = document.getElementById('customerDetails1');
        doc.autoTable({
          html: '#customerDetails1',
          tableWidth: '100%',
          tableLineColor: "black",
          tableLineWidth: 0.5, 
          styles: { cellPadding:.8, fontSize: 5},
          bodyStyles : {fontStyle :"bold"},
          startY: 23,
          showHead: 'firstPage',
          theme: 'plain'
        });
      }
      if(this.field['accountNo'] == "37221"){
        doc.text("DEBTORS ACCOUNT FROM "+this.format_FromDt+ " TO "+ this.formatToDt , pageWidth / 2, 22, 'center');

      }else if(this.field['accountNo'] == "37220"){
        doc.text("Loan Account FROM "+this.format_FromDt+ " TO "+ this.formatToDt , pageWidth / 2, 22, 'center');

      }else if(this.field['type'] == "installmentSchedule"){
        doc.text("INSTALLMENT SCHEDULE", pageWidth / 2, 22, 'center');
 
      }

      if (this.accountStatementList.length > 0) {
        doc.setFontSize(10);
        //doc.text('Installment Schedule', 40, 40, 'center')
        // doc.text('Statement of Account', 14, doc.autoTable.previous.finalY + 10);
        doc.autoTable({
          html: '#accountStatement',
          tableWidth: '100%',
          styles: { cellPadding: 1, fontSize: 8},
          startY: 56,
          showHead: 'firstPage',
          headStyles :  {fontStyle :"bold" , fontSize: 6},
          theme: 'grid',
          tableLineColor: "black",
          tableLineWidth: 0.5, 
          bodyStyles : { textColor : "black"},
          columnStyles :  { 3: { halign: 'right' },4: { halign: 'right' },5: { halign: 'right' } }
        })
        reportName = "account_statement" + date + ".pdf";
      } else if (this.installmentScheduleList.length > 0) {
        doc.setFontSize(10);
        //  doc.text('Installment Schedule', 40, 40, 'center')
          //  20, 50,'Installmeynt Schedule');
        doc.autoTable({
          html: '#installmentSchedule',
          tableWidth: '100%',
          styles: { cellPadding: 1, fontSize: 8 },
          startY: 56,
          showHead: 'firstPage',
          theme: 'grid',
          tableLineColor: "black",
          bodyStyles : { textColor : "black"},
          tableLineWidth: 0.5, 
          columnStyles :  { 3: { halign: 'right' },4: { halign: 'right' },5: { halign: 'right' } },

          headStyles :  {fontStyle :"bold" , fontSize: 6},

        })
        reportName = "installment_schedule" + date + ".pdf";
      }
      // doc.output("dataurlnewwindow");
      doc.save(reportName);
    }
  }

  public onTypeChange(type): void {
    console.log(type)
    this.installmentScheduleList = [];
    this.accountStatementList = [];
    this.customerDetails = undefined;
    this.field['accountNo'] = "";
    this.totalinstallments = ""
    this.installmentpaid = ""
    this.unpaid = ""


  }


  public onFromDateChange(): void {
    if (this.field['from_date'] != null && this.field['from_date'] != "" && !!this.field['from_date']) {
      this.field['to_date'] = null
      this.minDate = new Date(this.field['from_date']);
    }
  }
}
