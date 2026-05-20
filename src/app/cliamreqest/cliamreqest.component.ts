import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../services/report/common.service';
import * as XLSX from 'xlsx';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';

@Component({
  selector: 'app-cliamreqest',
  templateUrl: './cliamreqest.component.html',
  styleUrls: ['./cliamreqest.component.scss']
})
export class CliamreqestComponent implements OnInit {
  loanID: any;
  LoanDate: any;
  LoanAmount: any;
  customerName: any;
  customerID: any;
  date: Date;
  userData: any;
  utramount:any
  claimamount:any
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  public settings: Settings;
  constructor( private commonService: CommonService,public dialog: MatDialog,private datePipe: DatePipe, public appSettings: AppSettings) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

  }
  public loanSearch(): void {
   {
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          
        }
      });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.loanItem.LoanStatus == 0) {
          this.displayMessage("Loan Already Closed", "Success");
        } else {
        this.getSelectedLoanDetails();
        this.loanID = result.loanItem.LoanId;
        this.date = new Date();
        }
      }
    });
  }
}
getSelectedLoanDetails() {
  debugger
  let params = {
    "loan_id": this.loanID
  }
  this.settings.loadingSpinner = true;
  this.commonService.getLoanDetailsclaim(params).subscribe(res=>{
    this.settings.loadingSpinner = false;
    if (res['status'].code == 1 && res['status'].flag == 1) {
    this.loanID = this.loanID;
    this.LoanDate = this.datePipe.transform(res['insuranceupdationList'][0]['loan_date'], 'dd/MM/yyyy');
    this.LoanAmount = res['insuranceupdationList'][0]['loan_amount'];
    this.customerName = res['insuranceupdationList'][0]['customer_name'];
    this.customerID = res['insuranceupdationList'][0]['customer_id']
    }else{
      this.displayMessage(res['status']['message'], 'Alert');

    }
  })

}
data: any;

  OpenFile(): any {
    if (!!this.FileData) {
      var data = {
        "isView": true,
        "exte": this.FileExte,
        'file': this.FileData,
        'Filetype': this.FileDataType,
        "execl": this.data
      };
      let mobilewidth = "50%";
      let mobileheight = "auto";
      if (window.innerWidth < 599) {
        mobilewidth = "95%";
        mobileheight = "75%";
      }
      const dialogRef = this.dialog.open(FileviewComponent, {
        data: data,
        width: mobilewidth,
        height: mobileheight,
      });
    }
  }
  onChangeFile(event) {
    

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.FileName = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if( extension =="pdf" ){
       if (extension == "pdf") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.FileDataType = pdf_url.split(',')[0]
          this.FileData = pdf_url.split(',')[1];
          this.ext = "pdf"
          var pdf_name = temp.name;
          console.log('event', temp);
        }
      } 
    }else{
      this.displayMessage("Invalid File", "Alert");
      this.FileData = ""
      this.FileName = ""
      this.FileDataType = ""
      this.FileExte = ""
    }
      
    }
  }
  
  displayMessage(message, type) {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%',
        data: { message: message, type: type },
      });
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
  rejects(form){
    let params = {
      "loan_id": this.loanID,
      "customer_id": this.customerID,
      "customer_name": this.customerName,
      "loan_date": this.LoanDate,
      "loan_amonut": this.LoanAmount,
      "cliam_amount": this.claimamount,
      "utr_number": this.utramount,
      "status": 0,
      "requested_date": this.datePipe.transform(new Date, 'dd/MM/yyyy'),
      "document": this.FileData,
      "requesteD_USER_ID": this.userData['empCode']
    }
    this.settings.loadingSpinner = true;
    this.commonService.claimupdationconfirm(params).subscribe(res=>{
      this.settings.loadingSpinner = false;
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.displayMessage(res['status']['message'], 'Success');
        this.clear(form);
      }else{
        this.displayMessage(res['status']['message'], 'Alert');
  
      }
    })
  }
  confirm(form){
  let params = {
    "loan_id": this.loanID,
    "customer_id": this.customerID,
    "customer_name": this.customerName,
    "loan_date": this.LoanDate,
    "loan_amonut": this.LoanAmount,
    "cliam_amount": this.claimamount,
    "utr_number": this.utramount,
    "status": 1,
    "requested_date": this.datePipe.transform(new Date, 'dd/MM/yyyy'),
    "document": this.FileData,
    "requesteD_USER_ID": this.userData['empCode'],
    "DOCUMENT_NAME": this.FileName,
    "DOCUMENT_EXT": this.FileExte,
    "DOCUMENT_TYPE": this.FileDataType
  }
  this.settings.loadingSpinner = true;
  this.commonService.claimupdationconfirm(params).subscribe(res=>{
    this.settings.loadingSpinner = false;
    if (res['status'].code == 1 && res['status'].flag == 1) {
      this.displayMessage(res['status']['message'], 'Success');
      this.clear(form);
    }else{
      this.displayMessage(res['status']['message'], 'Alert');

    }
  })
  }
  clear(form){
    this.LoanDate = ""
    this.LoanAmount = ""
    this.customerName = ""
    this.customerID = ""
    this.utramount = ""
    this.claimamount = ""
    this.LoanDate = ""
    this.FileData = ""
    this.FileName = ""
    this.FileDataType = ""
    this.FileExte = ""
  }
}
