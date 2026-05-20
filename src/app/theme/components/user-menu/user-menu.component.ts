import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { defaultValues } from '../../../../environments/environment';
import { CommonService } from '../../../services/report/common.service';
import { Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UserMenuComponent implements OnInit {
  userData: any;
  public settings: Settings;

  public userImage = 'assets/img/profile/customer.png';
  constructor(private dialog: MatDialog,public appSettings: AppSettings,public router: Router,private commonService: CommonService) {
    this.settings = this.appSettings.settings;

   }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
      
  }
  logouut(){
    this.userData = this.commonService.getCredentials();

    let params = {
      "user_Id":this.userData['empCode']
    }
    this.settings.loadingSpinner = true;

    this.commonService.sessionlogout(params).subscribe(res=>{

      if(res['message'] = "User logged out"){
        this.settings.loadingSpinner = false;
        sessionStorage.removeItem('currentUser')
        sessionStorage.removeItem('branchuser')
        this.router.navigate(['/login']);

      }else{
        this.DisplayMessage(res['status'].message, "Alert");

      }
    })
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

}
