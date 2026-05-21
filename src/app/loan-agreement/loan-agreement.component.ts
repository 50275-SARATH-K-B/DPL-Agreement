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
  }

}
