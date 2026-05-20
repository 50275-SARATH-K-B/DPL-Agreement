import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material/dialog';
import { FileviewviewComponent } from '../fileviewview/fileviewview.component';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { Settings } from '../app.settings.model';
import { AppSettings } from '../app.settings';
@Component({
  selector: 'app-cliamapproval',
  templateUrl: './cliamapproval.component.html',
  styleUrls: ['./cliamapproval.component.scss']
})
export class CliamapprovalComponent implements OnInit {
  accountListType:any
  accountList:any[]
  loanID: any;
  LoanDate: any;
  LoanAmount: any;
  customerName: any;
  customerID: any;
  date: Date;
  userData: any;
  utramount:any
  claimamount:any
  accountListType2:any
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  public settings: Settings;
  constructor(public dialog: MatDialog,private datePipe: DatePipe,private commonService: CommonService, public appSettings: AppSettings) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.loanSearch()
  }
  onChangeAction2(event){
  
  }
    OpenFile(): any {
      if (!!this.FileData) {
        let dataI = {
          file: this.FileData,
          exte: '.pdf',
          isView: true
        };
        let mobilewidth = "50%";
        let mobileheight = "63%";
        if (window.innerWidth < 599) {
          mobilewidth = "95%";
          mobileheight = "75%";
        }
        const dialogRef = this.dialog.open(FileviewviewComponent, {
          data: dataI,
          width: mobilewidth,
          height: mobileheight,
        });
      }
  
     
    }
    loanSearchloan(){
      
      this.LoanDate = ""
      this.LoanAmount = ""
      this.customerName = ""
      this.customerID = 
      this.claimamount = ""
      this.utramount = ""
      this.FileData = ""
      this.loanID = ""
      let p = this.accountList.find(s=>s.loan_id == this.accountListType2 )
      this.loanID = p['loan_id']
      this.LoanDate = this.datePipe.transform(p['loan_date'], 'dd/MM/yyyy');
      this.LoanAmount = p['loan_amonut'];
      this.customerName = p['customer_name'];
      this.customerID = p['customer_id']
      this.claimamount = p['cliam_amount']
      this.utramount = p['utr_number']
      this.FileData = p['documents']
      this.FileName = "File_PDF"
    }
  loanSearch(){
    this.accountList = []
    this.commonService.getLoanDetailsclaimappr().subscribe(res=>{
      this.accountList = res['insuranceupdationList']

  })
  }
    displayMessage(message, type) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: message, type: type },
        });
    }
  confirm(form){
    let params = {
      "loan_id": this.loanID,
      "amount": this.claimamount,
      "user_id": this.userData['empCode'],
      "flag": 1
    }
    this.settings.loadingSpinner = true;
    this.commonService.claimapprove(params).subscribe(res=>{
      this.settings.loadingSpinner = false;
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.displayMessage(res['status']['message'], 'Success');
        this.clear(form);
        this.loanSearch()
      }else{
        this.displayMessage(res['status']['message'], 'Alert');
  
      }
    })
  }
  rejects(form){
    let params = {
      "loan_id": this.loanID,
      "amount": this.claimamount,
      "user_id": this.userData['empCode'],
    }
    this.settings.loadingSpinner = true;
    this.commonService.claimapprove(params).subscribe(res=>{
      this.settings.loadingSpinner = false;
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.displayMessage(res['status']['message'], 'Success');
        this.clear(form);
        this.loanSearch()

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
  }
}
