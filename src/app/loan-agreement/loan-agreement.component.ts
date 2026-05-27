import { Component, OnInit } from '@angular/core';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { Settings } from '../app.settings.model';
import { AppSettings } from '../app.settings';
import { RepaymentService } from '../services/report/repayment.service';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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
  reccur: any[] = [];
  intchg: any;
  upfrontchg: any;
  othlinked: any;
  netdisbursed: any;
  totamt: any;
  annualper: any;
  repayfreq: any;
  noofrepay: any;
  penrt: any;
  process_rate: any;
  loanId: any;
  // FromDate = "1-APR-2023";
  // ToDate = "31-DEC-2023";

  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService , public route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData);
    // this.commonService.session2()
    // this.getloanid();

    this.route.queryParams.subscribe(params => {
      this.loanId = params['loanId'];
     console.log(this.loanId)
    });

    this.getcustomerdtls();
    this.looptable();
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

  getloanid() {
    let params = {
      "FromDate": "1-APR-2023",
      "ToDate": "31-DEC-2023",
    }
    this.settings.loadingSpinner = true;
    this.commonService.getloanidagreement(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      console.log(res);
      if (res['status'].flag == 1 && res['status'].code == 1) {

      }
    })
  }

  getcustomerdtls() {
    let params = {
      "loanid": this.loanId,
    }
    this.settings.loadingSpinner = true;
    this.commonService.getcustdtlsagreement(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      console.log(res);
      if (res['status'].code == 1 && res['status'].flag == 1) {
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
        this.getdetails1();

        console.log("dtls", this.procfee, this.emiamt);
      } else {
        this.DisplayMessage(res['status'].message, "Alert");
        return;
      }
    }, error => {
      this.settings.loadingSpinner = false;
      this.DisplayMessage("Error ", "Alert");
    }
    );
  }

  looptable() {
    let params = {
      "ROI": 0,
      "LOAN_AMT": 0,
      "SCHEME_ID": 1,
      "TENURE_DTLS": this.loanId,
      "TENURE": 0,
    }
    this.settings.loadingSpinner = true;
    this.commonService.loopingtable(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      console.log(res);
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.reccur = res['instScheduleList'];
        this.reccur = this.reccur.map(item => ({

          dueDate: item.DueDate,
          installmentAmount: item.InstallmentAmount,
          installmentNo: item.InstallmentNo,
          interestAmount: item.InterestAmount,
          openingBalance: item.OpeningBalance,
          principalAmount: item.PrincipalAmount,



        }));
        console.log("recrr", this.reccur)

      }
      else {
        this.DisplayMessage(res['status'].message, "Alert");
        return;
      }
    }, error => {
      this.settings.loadingSpinner = false;
      this.DisplayMessage("Error ", "Alert");
    }
    );
  }

  getTotal(field: string): number {
    return parseFloat(
      this.reccur.reduce((sum, item) => {
        return sum + (parseFloat(item[field]) || 0);
      }, 0).toFixed(2)
    );
  }

  getdetails1() {
    let params = {
      "LOAN_AMT": Number(this.loanamt),
      "TENURE": Number(this.tenure),
      "ROI":  Number(this.anlint),
      "customerid": this.custid,
    }
    this.settings.loadingSpinner = true;
    this.commonService.getdetailsagreement(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      console.log(res);
      if(res['status'].flag == 1 && res['status'].code == 1){
        this.intchg = res['totintchg'];
        this.upfrontchg = res['upfrontchg'];
        this.othlinked = res['otherschg'];
        this.netdisbursed = res['netdisbamt'];
        this.totamt = res['totamttobepaid'];
        this.annualper = res['apr'];
        this.repayfreq = res['repayfreqpr'];
        this.noofrepay = res['noofrepay'];
        this.penrt = res['annualpenalchg'];   //36
        this.process_rate = res['processfeert'];
      }

    });
  }





}
