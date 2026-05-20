import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { defaultValues } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { EmiCalculatorComponent } from '../../common/emi-calculator/emi-calculator.component';
import { AuthenticationService } from '../login/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public settings: Settings;
  keydata: any;
  constructor(public appSettings:AppSettings,private dialog:MatDialog,private authenticationService: AuthenticationService){
    this.settings = this.appSettings.settings; 
  }

  ngOnInit() {
    
  }
  public openEmiCalculator():void{
    const dialogRef = this.dialog.open(EmiCalculatorComponent, {
      width: '60%',
      height: '95%',
    });
  }

}
