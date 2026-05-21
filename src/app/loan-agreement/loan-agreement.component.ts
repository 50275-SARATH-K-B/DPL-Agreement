import { Component, OnInit } from '@angular/core';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { Settings } from '../app.settings.model';
import { AppSettings } from '../app.settings';
import { RepaymentService } from '../services/report/repayment.service';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-loan-agreement',
  templateUrl: './loan-agreement.component.html',
  styleUrls: ['./loan-agreement.component.scss']
})
export class LoanAgreementComponent implements OnInit {
  settings: Settings;
  userData: any;
  todaydt: any;
  custdtls: any;
  place: any;
  custdtls1: any;
  loandt: any;
  anlint: any;
  loanpur: any;
  borrnm: any;
  addr: any;
  emailaddr: any;
  mobno: any;
  regmobno: any;
  borrtype: any;
  loanamt: any;
  tenure: any;
  custid: any;
  agmntplc: any;
  procfee: any;
  crdlinked: any;
  emiamt: any;
  dueday: any;
  bnkdtlsstr: any;
  bnkdtlsstr1: any;
  benefname: any;
  bnkname: any;
  bnkacc: any;
  ifsc: any;
  // FromDate = "1-APR-2023";
  // ToDate = "31-DEC-2023";

  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData);
    // this.commonService.session2()
    // this.getloanid();
    this.getcustomerdtls();
  }

  getloanid() {
    let params = {
      "FromDate" : "1-APR-2023",
      "ToDate" : "31-DEC-2023",
    }
    this.settings.loadingSpinner = true;
    this.commonService.getloanidagreement(params).subscribe(res =>{
      this.settings.loadingSpinner = false;
      console.log(res);
      if(res['status'].flag == 1 && res['status'].code == 1 ){

      }
    })
  }

  getcustomerdtls(){
    let params ={
      "loanid": "58857",
    }
    this.settings.loadingSpinner = true;
    this.commonService.getcustdtlsagreement(params).subscribe(res =>{
      this.settings.loadingSpinner = false;
      console.log(res);
      if(res['status'].code == 1 && res['status'].flag == 1 ){
        this.custdtls1 = res['agreementDetails'].split('~');
        this.custdtls = this.custdtls1[0].split('^');
         this.todaydt = this.custdtls[0];
        //  this.place = this.custdtls[1];
         this.loandt = this.custdtls[2];
         this.anlint = this.custdtls[3];
         this.loanpur = this.custdtls[4];
         this.borrnm = this.custdtls[5];
         this.addr = this.custdtls[6];
         this.emailaddr = this.custdtls[7];
         this.mobno = this.custdtls[8];
         this.regmobno = this.custdtls[9];
        this.borrtype = this.custdtls[10];
        this.loanamt = this.custdtls[11];
        this.tenure = this.custdtls[12];
        this.custid = this.custdtls[13];
        this.agmntplc = this.custdtls[14];
        this.procfee = this.custdtls1[1];
        this.crdlinked = this.custdtls1[2];
        this.emiamt = this.custdtls1[3];
        this.dueday = this.custdtls1[4];
        this.bnkdtlsstr = this.custdtls1[5];
        this.bnkdtlsstr1 = this.bnkdtlsstr.split('^');
        this.benefname = this.bnkdtlsstr1[0];
        this.bnkname = this.bnkdtlsstr1[1];
        this.bnkacc = this.bnkdtlsstr1[2];
        this.ifsc = this.bnkdtlsstr1[3];
        

        console.log("dtls",this.procfee, this.emiamt);
      }
    });
  }

}
