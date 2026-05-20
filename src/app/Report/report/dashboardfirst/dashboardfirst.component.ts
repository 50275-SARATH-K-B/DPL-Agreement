import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../pages/login/authentication.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { CommonService } from '../../../services/report/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboardfirst',
  templateUrl: './dashboardfirst.component.html',
  styleUrls: ['./dashboardfirst.component.scss']
})
export class DashboardfirstComponent implements OnInit {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';
  userData: any;
  home: any[]=[];
  home2: any[]=[];
  home3: any[]=[];
  home4: any[]=[];
  home5: any[]=[];
  home6: any[]=[];
  constructor(private dialog: MatDialog,private commonService: CommonService
,    private idle: Idle, private keepalive: Keepalive,public router: Router , public authenticationService :AuthenticationService) {
    // idle.setIdle(60); // this will be 58*60

    // idle.setTimeout(5); //counter time.

    // idle.setInterrupts(DEFAULT_INTERRUPTSOURCES); // there are various Interupts

    // idle.onIdleEnd.subscribe(() => {

    //   this.idleState = 'No Longer Idle';
    //   console.log(this.idleState)

    // });// this is the palce to do somthing if user comes back after being idle.

    // idle.onTimeout.subscribe(() => {
    //   debugger
    //   this.idleState = 'Timed out!';
    //   console.log(this.idleState)

    //   this.timedOut =true;
    //   this.router.navigate(['/login']);


    // });// this is place for redirect to login page.

    // idle.onIdleStart.subscribe(() =>{

    //   this.idleState = 'You have gone Idle';
    //   console.log(this.idleState)

    // }); // this is place to do somthing when user goes Idle.

    // idle.onTimeoutWarning.subscribe((countdown) => {

    //   this.idleState = 'You will time out in ' + countdown + 'seconds';
    //   console.log(this.idleState)
    // }); // this is the place for alert to notify of the logout 

    // keepalive.interval(15);
    
    // keepalive.onPing.subscribe(() => {

    //   this.lastPing = new Date();
    //   console.log(this.lastPing)

    // });
    // this.reset(); // this function start the whole ng Idle
   }
 

   reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  routeicon(route){
    let v = this.home2.find(s=>s.pageurl == route)
    if(!!v){
      this.router.navigateByUrl(route)

    }else{
      this.DisplayMessage("You Dont have permission to Enter !", "Alert")

    }

  }
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    
    sessionStorage.removeItem("schemeData")
    let params = {
      "user_Id":this.userData['empCode'],
      "token":this.userData['token']
    }
    this.commonService.sessionactive(params).subscribe(res=>{
     if(res['message'] == 'Session is already active'){

      let params2 = {
        employeeCode:this.userData['empCode']
      }
      this.commonService.menu(params2).subscribe(res=>{
        if(res['parameterValue'] == 1){
          for(let i=0;i<res['roleDetails'].length;i++){
            if(res['roleDetails'][i].parenT_ID == 1){
              this.home.push(res['roleDetails'][i])
            }else if(res['roleDetails'][i].parenT_ID == 2){
              this.home3.push(res['roleDetails'][i])
  
            }else if(res['roleDetails'][i].parenT_ID == 3){
              this.home4.push(res['roleDetails'][i])
  
            }else if(res['roleDetails'][i].parenT_ID == 4){
              this.home5.push(res['roleDetails'][i])
  
            }else if(res['roleDetails'][i].parenT_ID == 5){
              this.home6.push(res['roleDetails'][i])
  
            }
          }
        }else{
          for(let i=0;i<res['commonRoleAccessList'].length;i++){
            if(res['commonRoleAccessList'][i].parenT_ID == 1){
              this.home.push(res['commonRoleAccessList'][i])
            }else if(res['commonRoleAccessList'][i].parenT_ID == 2){
              this.home3.push(res['commonRoleAccessList'][i])
  
            }else if(res['commonRoleAccessList'][i].parenT_ID == 3){
              this.home4.push(res['commonRoleAccessList'][i])
  
            }else if(res['commonRoleAccessList'][i].parenT_ID == 4){
              this.home5.push(res['commonRoleAccessList'][i])
  
            }else if(res['commonRoleAccessList'][i].parenT_ID == 5){
              this.home6.push(res['commonRoleAccessList'][i])
  
            }
          }
        }
  
      this.home2 = res['roleDetails']

      })
     }else{
      this.DisplayMessage("User has been logged out!", "Alert")

      this.router.navigate(['/login']);

     }
    })
  }
  installment(){
    this.router.navigateByUrl('/repayment/installment-receipt')
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
  almReport(){
    this.router.navigateByUrl('/personal-report/alm-report')

  }
  Settlement(){
    this.router.navigateByUrl('/repayment/settlement')
  }
  InstallmentCancel(){
    this.router.navigateByUrl('/personal-report/coll-rev')
  }
  DuedateChange(){
    this.router.navigateByUrl('/personal-report/due-date-change')
  }
  Duedateapprovl(){
    this.router.navigateByUrl('/personal-report/due-approval')
  }
  settlemntnew(){
    this.router.navigateByUrl('/repayment/settlement-new')
  }
 
  schemeCreation(){
    this.router.navigateByUrl('/personal-report/schemeCreation')
  }
  schemeApproval(){
    this.router.navigateByUrl('/personal-report/SchemeApproval')
  }
  schemeCreationDashboard(){
    this.router.navigateByUrl('/personal-report/SchemeDashboard')
  }

  AccountStatement(){
    this.router.navigateByUrl('/repayment/installment-schedule-account-statement')

   
  }
  csedataupload(){
    this.router.navigateByUrl('/personal-report/cse-data')

  }
  AccountStatement2(){
    this.router.navigateByUrl('/personal-report/soa')
  }
 
  Outstanding(){
    this.router.navigateByUrl('/personal-report/outstanding')

  }
  DisbursementCancel(){
    this.router.navigateByUrl('/personal-report/disbursement-cancel-request')

  }
  DisbursementCancelapproval(){
    this.router.navigateByUrl('/personal-report/disbursement-cancel-approval')

  }
  Report(){
    this.router.navigateByUrl('/personal-report/report')

  }
  DetailAccountStatement(){
    this.router.navigateByUrl('/personal-report/detail-account-statement')

  }
  ManualEntry(){
    this.router.navigateByUrl('/personal-report/manual-entry')

  }
  Payu(){
    this.router.navigateByUrl('/personal-report/payu-updation')

  }
  Duelist(){
    this.router.navigateByUrl('/report/due-list')

  }
  outstandingreport(){
    this.router.navigateByUrl('/personal-report/customer-wise')

  }
  Downloadagreement(){
    this.router.navigateByUrl('/personal-report/agreement-download')

  }
  Declaration(){
    this.router.navigateByUrl('/personal-report/declaration')

  }
  DisbursementReport(){
    this.router.navigateByUrl('/personal-report/disbursement-report')

  }
  rbi(){
    this.router.navigateByUrl('/personal-report/rbi-report')

  }
  arbitrationrp(){
    this.router.navigateByUrl('/personal-report/arbitration-report')

  }
  enachpre(){
    this.router.navigateByUrl('/personal-report/e-nach-presentation')

  }
  Enachre(){
    this.router.navigateByUrl('/personal-report/e-nach-realisation')

  }
  enachapp(){
    this.router.navigateByUrl('/personal-report/e-nach-disbursement-approval')

  }
  EligibilityApproval(){
    this.router.navigateByUrl('/personal-report/eligibility-approval')

  }
  EligibilityUpdate(){
    this.router.navigateByUrl('/personal-report/eligibility-updation')

  }
  collectionpre(){
    this.router.navigateByUrl('/personal-report/collection-presentation')

  }
  chargesbulk(){
    this.router.navigateByUrl('/personal-report/charge-bulk-upload')

  }
  enachsend(){
    this.router.navigateByUrl('/personal-report/enach-resend')

  }
  noc(){
    this.router.navigateByUrl('/personal-report/noc')

  }
  bulkupload(){
    this.router.navigateByUrl('/personal-report/bulk-upload')

  }
  enachupload(){
    this.router.navigateByUrl('/personal-report/enach-upload')

  }
  excelupload(){
    this.router.navigateByUrl('/personal-report/excelupload')

  }
  enachurl(){
    this.router.navigateByUrl('/personal-report/enachlink')
  }
  disbexcel(){
    this.router.navigateByUrl('/personal-report/disbexcl')

  }
  waiverentry(){
    this.router.navigateByUrl('/personal-report/waiver-entry')

  }
  waiverapprval(){
    this.router.navigateByUrl('/personal-report/waiver-approval')

  }
  payuupload(){
    this.router.navigateByUrl('/personal-report/payuupload')

  }
insurance(){
  this.router.navigateByUrl('/personal-report/insurance')
}
sanctionletter(){
  this.router.navigateByUrl('/personal-report/sanction-letter')

}
customerremoval(){
  this.router.navigateByUrl('/personal-report/customer-removal')

}
identityview(){
  this.router.navigateByUrl('/personal-report/identity-verify')

}
eligibility2(){
  this.router.navigateByUrl('/personal-report/eleigibi-for')

}
sanctionurl(){
  this.router.navigateByUrl('/personal-report/sanctionurl')

}
collectionupload(){
  this.router.navigateByUrl('/personal-report/collection-upload')

}
dataallocation(){
  this.router.navigateByUrl('/personal-report/allocation-data')

}
kycstatus(){
  this.router.navigateByUrl('/personal-report/kyc-status')

}
eligibledataup(){
  this.router.navigateByUrl('/personal-report/eligible-dataupload')
}

kycVerification(){
  this.router.navigateByUrl('/personal-report/kyc-verification')
}

kycVerificationStatus(){
  this.router.navigateByUrl('/personal-report/kyc-verification-status')
}
enachreports(){
  this.router.navigateByUrl('/personal-report/enach-reports')
}


loanAccountStatus(){
  this.router.navigateByUrl('/personal-report/loan-account-status')
}
loanAccountApproval(){
  this.router.navigateByUrl('/personal-report/loan-account-approval')
}
loanAccountDashboard(){
  this.router.navigateByUrl('/personal-report/loan-account-dashboard')
}
InstallmentCancelappr(){
  this.router.navigateByUrl('/personal-report/coll-rev-appr')

}
settlementapproval(){
  this.router.navigateByUrl('/repayment/settlement-apprv')

}
nocreports(){
  this.router.navigateByUrl('/personal-report/noc-reports')

}
salesempdata(){
  this.router.navigateByUrl('/personal-report/sales-empdata')

}
deathrequest(){
  this.router.navigateByUrl('/personal-report/Death-Request')

}
settlementblok(){
  this.router.navigateByUrl('/repayment/settlement-block')

}
settlementblkapp(){
  this.router.navigateByUrl('/repayment/settlement-block-appr')

}
daethstatusapp(){
  this.router.navigateByUrl('/personal-report/Death-Approve')

}
Insuranceupload(){
  this.router.navigateByUrl('/personal-report/Insurance-upload')

}
deathreports(){
  this.router.navigateByUrl('/personal-report/Death-report')

}

welcolett(){
  this.router.navigateByUrl('/personal-report/welcome-letter')

}
welcolettrpt(){
  this.router.navigateByUrl('/personal-report/welcome-letter-report')

}
}
