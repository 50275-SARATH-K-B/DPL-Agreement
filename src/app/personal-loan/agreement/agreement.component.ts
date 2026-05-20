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
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  public settings: Settings;
  userData: any;
  loanID:any;
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.settings = this.appSettings.settings;
    this.userData = this.commonService.getCredentials();
  }

  public loanSearch(): void {
    
    
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.settings.loadingSpinner = false;
        
        
        
      }
    }, error => { this.settings.loadingSpinner = false; });
  }

}
