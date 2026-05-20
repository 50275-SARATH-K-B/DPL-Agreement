import { Component, OnInit, ViewChild } from '@angular/core';
import { Settings } from '../../app.settings.model';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AppSettings } from '../../app.settings';

import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { RepaymentService } from '../../services/report/repayment.service';
import { CommonService } from '../../services/report/common.service';
import { Form, NgForm } from '@angular/forms';


@Component({
  selector: 'app-download-agreement',
  templateUrl: './download-agreement.component.html',
  styleUrls: ['./download-agreement.component.scss']
})
export class DownloadAgreementComponent implements OnInit {
  public settings: Settings;
  userData: any;
  resultSet:any;
  loanId:any;
  downloadReady:boolean = false;
  applicationid: any;
  LoanId: any;
  agreementlist: any[];

  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.settings = this.appSettings.settings;
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    // this.loanSearch();
    // this.getEsignDoc2()
  }

  public loanSearch(): void {

    this.loanId = undefined;
    this.downloadReady = false;
    this.clearPdf();
    
      
      const params1 = {
        "SearchValue":1,// this.searchText,
        "SearchType": "LOAN_ID",
        "SearchData":  this.LoanId,
        "flag": 1
        }
  
  this.commonService.agreementpl(params1).subscribe(res =>{
    if(!!res['loanDataList']){
      
      this.agreementlist = res['loanDataList']
      let agreementid = this.agreementlist.find(s=>s.LoanId == this.LoanId)
      this.applicationid = agreementid['ApplId']
      this.getEsignDoc();

    }else if(res['loanDataList']==null){

      this.DisplayMessage("Please Enter a Valid LoanID", "Alert");
      this.LoanId = undefined
      this.clearPdf()
    }

  })
     
        
  
  }
  applicationnum(loanid){

  }
  search(){
    this.loanSearch();
  }

  docImage:any;
  getEsignDoc(){

    var params = {
      optionID:2,
      Id:this.applicationid//4712 //1137
    };
    this.repaymentService.esignDocSave(params).subscribe(res=>{
      if(res['status']['code']== 1 && res['status']['flag']== 1){
        var resultSet = res['resultset'];
        this.resultSet = resultSet;
        this.downloadReady = true;
        var obj = document.createElement('object');
        obj.style.width = '100%';
        obj.style.height = '842pt';
        obj.type = 'application/pdf';
        obj.data = 'data:application/pdf;base64,' + resultSet;
        var d = document.getElementById("pdfContainer");
        d.appendChild(obj);
      }else{
        // let param = {
        //   "Loanid":this.LoanId,
        // }
        // this.commonService.getesign2(param).subscribe(res=>{
        //   if(res['status']['code']== 1 && res['status']['flag']== 1){
        //   let d = res['url'] +this.LoanId
    
        //     window.location.assign(d)  
    
        //   }else{
          this.DisplayMessage("Please Contact Admin!","Alert");
    
        //   }
    
        // })
      }
    });
  }
  getEsignDoc2(){

    let param = {
      "Loanid":this.loanId,
    }
    this.commonService.getesign2(param).subscribe(res=>{
      if(res['status']['code']== 1 && res['status']['flag']== 1){
      let d = res['url'] +this.loanId

        window.location.assign(d)  

      }else{
      this.DisplayMessage(res['status']['message'],"Alert");

      }

    })
 
  }

  download(){
    var link = document.createElement('a');
    link.innerHTML = 'Download PDF file';
    link.download = 'file.pdf';
    link.href = 'data:application/octet-stream;base64,' + this.resultSet;
    link.click();

  }

  clearPdf(){
    this.resultSet = undefined;
    var d = document.getElementById("pdfContainer");
    if(d){
      d.textContent = '';
    }
    

  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

}
