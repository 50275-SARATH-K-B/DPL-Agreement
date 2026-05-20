import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../../../services/report/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../../../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-dashboardsecond',
  templateUrl: './dashboardsecond.component.html',
  styleUrls: ['./dashboardsecond.component.scss']
})
export class DashboardsecondComponent implements OnInit {
  datakey: number;
  userData: any;

  constructor(private dialog: MatDialog,private commonService: CommonService
,    public router: Router) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    let params = {
      "user_Id":this.userData['empCode']
    }
    this.commonService.sessionactive(params).subscribe(res=>{
     if(res['message'] == 'Session is already active'){

     }else{
      this.DisplayMessage(res['message'], "Alert")

      this.router.navigate(['/login']);

     }
    })
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
  installment(){
    this.router.navigateByUrl('/repayment/installment-receipt')

  }
  Settlement(){
    this.router.navigateByUrl('/repayment/settlement')

  }
  AccountStatement(){
    this.router.navigateByUrl('/repayment/installment-schedule-account-statement')

   
  }
  Report(){
    this.router.navigateByUrl('/personal-report/report')

  }
  

}
