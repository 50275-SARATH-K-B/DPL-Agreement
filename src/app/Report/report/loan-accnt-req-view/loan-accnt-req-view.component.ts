import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { FileviewComponent } from '../../../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-loan-accnt-req-view',
  templateUrl: './loan-accnt-req-view.component.html',
  styleUrls: ['./loan-accnt-req-view.component.scss']
})
export class LoanAccntReqViewComponent implements OnInit {
  public settings: Settings;
  enterID:any;
  status:any;
  settlementAmnt:any;
  reqEmp:any;
  reqDate:any;
  loanAmnt:any;
  deathDate:any;
  custName:any;
  custId:any;
  data:any;
  legalCert:any;
  deathCert:any;
  empCode:any;
  userData: any;
  fromDate: any;
  toDate: any;
  constructor(public route:ActivatedRoute,public dialog: MatDialog,public commonService:CommonService,
    public datepipe : DatePipe,public appSettings: AppSettings,public router:Router) { 
    
  this.commonService.selectedRow$.subscribe((row)=> {
    console.log(row)
    this.data = row;
  })


    this.route.params.subscribe(x =>{
      console.log(x)
      this.fromDate = x['fromDate'];
      this.toDate = x['toDate']
    })
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if(!!this.data){
      this.userData = this.commonService.getCredentials();
      console.log(this.userData)
      this.legalCert = 'data:image/png;base64,' + this.data['legalCertificate']
      this.deathCert = 'data:image/png;base64,' + this.data['deathCertificate']
      this.enterID = this.data['loanId']
      this.status=this.data['accountStatus'];
      this.settlementAmnt=this.data['settlementAmount'];
      this.reqEmp=this.data['requestedEmpCode'];
      this.reqDate=this.datepipe.transform(this.data['requestDate'],'dd/MM/yyyy');
      this.loanAmnt=this.data['loanAmount'];
      this.deathDate=this.datepipe.transform(this.data['deathDate'],'dd/MM/yyyy');
      this.custName=this.data['customer_name'];
      this.custId=this.data['customerId'];
    }else {
      this.back()
    }
   
  }

  DeathCertificateView(){
    let dataI = {
      file: this.data['deathCertificate'],
      exte: this.data.extension ? this.data.extension : 'jpg',
      isView: true
    };
    let mobilewidth = "50%";
    let mobileheight = "50%";
    
    const dialogRef = this.dialog.open(FileviewComponent, {
      data:dataI,
      width: mobilewidth,
      height: mobileheight,
    });
  }

  LegalCertificateView(){
    let dataI = {
      file: this.data['legalCertificate'],
      exte: this.data.extension ? this.data.extension : 'jpg',
      isView: true
    };
    let mobilewidth = "50%";
    let mobileheight = "50%";
    
    const dialogRef = this.dialog.open(FileviewComponent, {
      data:dataI,
      width: mobilewidth,
      height: mobileheight,
    });
  }

  approve(){
    let params = {
      "loanId": this.enterID != null ? this.enterID : this.enterID != undefined ? this.enterID : '',
      "accountStatus": this.status !=null ? this.status : this.status != undefined ? this.status : '',
      "approverempcode": this.userData['empCode'],
      "approvaldate": this.datepipe.transform(new Date(),'dd/MM/yyyy'),
      "status":2 
    }

    this.commonService.loanAccountStatusApproval(params).subscribe(res => {
    if(res['status']['flag']==1 && res['status']['code']==1){
      this.displayMessage(res['status']['message'],'Success')
      this.settings.loadingSpinner = false;
      this.clear()
      sessionStorage.removeItem('loanStatusApproveData')
    }else{
      this.displayMessage(res['status']['message'],'Alert')
      this.settings.loadingSpinner = false;
    }
    })
  }

  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });
  }

  back(){
    this.router.navigate(['/personal-report/loan-account-approval',{fromDate:this.fromDate,
    toDate:this.toDate}])
  }

  reject(){
    let params = {
      "loanId": this.enterID != null ? this.enterID : this.enterID != undefined ? this.enterID : '',
      "accountStatus": this.status !=null ? this.status : this.status != undefined ? this.status : '',
      "approverempcode": this.userData['empCode'],
      "approvaldate": this.datepipe.transform(new Date(),'dd/MM/yyyy'),
      "status":0 
    }
    this.commonService.loanAccountStatusApproval(params).subscribe(res => {
    if(res['status']['flag']==1 && res['status']['code']==1){
      this.displayMessage(res['status']['message'],'Success')
      this.settings.loadingSpinner = false;
      this.clear()
    }else{
      this.displayMessage(res['status']['message'],'Alert')
      this.settings.loadingSpinner = false;
    }
    })
  }

  clear(){
      this.legalCert ="";
      this.deathCert = "";
      this.enterID = "";
      this.status="";
      this.settlementAmnt="";
      this.reqEmp="";
      this.reqDate="";
      this.loanAmnt="";
      this.deathDate="";
      this.custName="";
      this.custId="";
  }

}
