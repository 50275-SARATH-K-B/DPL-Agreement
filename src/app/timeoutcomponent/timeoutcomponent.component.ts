import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Settings } from './../app.settings.model';
import { CommonService } from '../services/report/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
@Component({
  selector: 'app-timeoutcomponent',
  templateUrl: './timeoutcomponent.component.html',
  styleUrls: ['./timeoutcomponent.component.scss']
})
export class TimeoutcomponentComponent implements OnInit {
  userData: any;
  public settings: Settings;

  constructor(private dialog: MatDialog,private commonService: CommonService,public appSettings: AppSettings,private router: Router) {
    this.settings = this.appSettings.settings;

   }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
  if(!!this.userData){
    let params = {
      "user_Id":this.userData['empCode']
    }
    this.settings.loadingSpinner = true;
    this.dialog.closeAll()

    this.commonService.sessionlogout(params).subscribe(res=>{

      if(res['message'] = "User logged out"){
        this.settings.loadingSpinner = false;
        sessionStorage.removeItem('currentUser')
        sessionStorage.removeItem('branchuser')
        // this.router.navigate(['/login']);

      }else{
        this.settings.loadingSpinner = false;

        this.DisplayMessage(res['status'].message, "Alert");
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('branchuser')
      }
    })
  }else{
    this.settings.loadingSpinner = false;

  }
   
  this.settings.loadingSpinner = false;

  }
  clickfunc(){
 
    this.router.navigate(['/login']);
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
}
