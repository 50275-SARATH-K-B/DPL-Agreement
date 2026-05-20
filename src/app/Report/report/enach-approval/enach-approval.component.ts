import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/common/common.service';
import { EnachService } from '../../../services/report/enach.service';

@Component({
  selector: 'app-enach-approval',
  templateUrl: './enach-approval.component.html',
  styleUrls: ['./enach-approval.component.scss']
})
export class EnachApprovalComponent implements OnInit {
  private userData: object;
  public nachApproveData: object;
  public nachApprovalList: Array<object> = [];
  ApplicationId: any;
  // public nachApprovalList: Array<object> = [];
  constructor(
    private dialog: MatDialog, private EnachService: EnachService, private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getApplicationID();

    this.nachApproveData = {
      ApplicationId: '',
      CustomerId: '',
      custname: '',
      LoanAmount: '',
      Tenure: '',
      InterestRate: '',
      Branch: '',
      BankDetails: '',

    }


  }
  public getApplication(): void {

    let params = {
      applicationid: this.ApplicationId

    }
    this.EnachService.getApplicationData(params).subscribe(res => {
      if (!!res) {
        if (res['status'].code == 1) {
          // this.nachApprovalList = res['nachApprovalList'];


        }
      }
    })

  }
  public getApplicationID(): void {
    // this.nachApproveData['ApplicationId'] = '';
    // this.nachApproveData['CustomerId'] = '';
    // this.nachApproveData['custname'] = '';
    // this.nachApproveData['LoanAmount'] = '';
    // this.nachApproveData['Tenure'] = '';
    // this.nachApproveData['InterestRate'] = '';
    // this.nachApproveData['Branch'] = '';
    // this.nachApproveData['BankDetails'] = '';
    // this.nachApprovalList = [];
    // if(this.nachApproveData['ApplicationId'] !== null ){
    let params = {
      status: 4
    }
    this.EnachService.getApplicationList(params).subscribe(res => {
      if (!!res) {
        if (res['status'].code == 1) {
          this.nachApprovalList = res['nachApprovalLoadList'];


        }
      }
    })
    // }
    this.ApplicationId = this.nachApprovalList['ApplicationId'];
  }


  public onApplicationChange(): void {
    this.nachApproveData['ApplicationId'] = '';
    this.nachApproveData['CustomerId'] = '';
    this.nachApproveData['custname'] = '';
    this.nachApproveData['LoanAmount'] = '';
    this.nachApproveData['Tenure'] = '';
    this.nachApproveData['InterestRate'] = '';
    this.nachApproveData['Branch'] = '';
    this.nachApproveData['BankDetails'] = '';
    this.nachApprovalList = [];
    // if (this.nachApproveData['BranchID'] !== '' && this.nachApproveData['BranchID'] !== null && !!this.nachApproveData['BranchID']) {
    //   this.moratoriumService.getnachApprovalList({ _firmID: this.userData['firmID'], _branchID: this.nachApproveData['BranchID'] }).subscribe(res => {
    //     if (!!res) {
    //       if (res['status'].code == 1) {
    //         this.nachApprovalList = res['morotoriumDataList'];
    //       }
    //     }
    //   })
    // }
    let params = {
      applicationid: this.ApplicationId
    }
    this.EnachService.getApplicationData(params).subscribe(res => {
      if (!!res) {
        if (res['status'].code == 1) {
          this.nachApprovalList = res['nachApprovalList'];
        }
      }
    })
  }


  public getApplicationDetails(): void {

    let params = {
      applicationid: this.nachApproveData['ApplicationId']
    }
    this.EnachService.getApplicationData(params).subscribe(res => {
      if (!!res) {
        if (res['status'].code == 1) {
          this.nachApproveData['ApplicationId'] = res['nachApprovalList'][0]['ApplicationId'];
          this.nachApproveData['CustomerId'] = res['nachApprovalList'][0].CustomerId;
          this.nachApproveData['custname'] = res['nachApprovalList'][0]['Name'];
          this.nachApproveData['LoanAmount'] = res['nachApprovalList'][0]['LoanAmount'];
          this.nachApproveData['Tenure'] = res['nachApprovalList'][0]['Tenure'];
          this.nachApproveData['InterestRate'] = res['nachApprovalList'][0]['InterestRate'];
          this.nachApproveData['Branch'] = res['nachApprovalList'][0]['Branch'];
          this.nachApproveData['BankDetails'] = res['nachApprovalList'][0]['BankDetails'];


        }
      }

    })
  }
  // public clear(morotoriumApproval): void {
  //   morotoriumApproval.resetForm();
  // }
  // public approve(morotoriumApproval): void {
  //   const body = {
  //     FirmID: this.userData['firmID'],
  //     BranchID: this.userData['branchID'],
  //     ModuleID: 0,
  //     UserID: this.userData['empCode'],
  //     InputData: this.nachApproveData['LoanID'],
  //     ProcedureID: 16
  //   }
  //   this.update(body, morotoriumApproval);
  // }
  // public reject(morotoriumApproval): void {
  //   const body = {
  //     FirmID: this.userData['firmID'],
  //     BranchID: this.userData['branchID'],
  //     ModuleID: 0,
  //     UserID: this.userData['empCode'],
  //     InputData: this.nachApproveData['LoanID'],
  //     ProcedureID: 18
  //   }
  //   this.update(body, morotoriumApproval);
  // }
  // private update(body, morotoriumApproval): void {
  //   this.moratoriumService.saveMorotorium(body).subscribe(result => {
  //     if (result['status'].code == 1) {
  //       this.displayMessage({ type: "Success", message: result['status']['message'] });
  //       this.clear(morotoriumApproval);
  //     } else {
  //       this.displayMessage({ type: "Alert", message: result['status']['message'] })
  //     }
  //   }, error =>
  //       console.log('There was an error: '),
  //   );
  // }

  public Approve(nachApproval): void {
    let params = {
      applicationid: this.nachApproveData['ApplicationId'],
      status: 1
    }
    this.EnachService.getApplicationUpdate(params).subscribe(res => {
      if (res['status'].code == 1) {
        this.displayMessage({ type: "Success", message: res['status']['message'] });
        this.clear(nachApproval);
      } else {
        this.displayMessage({ type: "Alert", message: res['status']['message'] })
      }
    }, error =>
      console.log('There was an error: '),
    );

  }
  public Reject(nachApproval): void {
    let params = {
      applicationid: this.nachApproveData['ApplicationId'],
      status: 0
    }
    this.EnachService.getApplicationUpdate(params).subscribe(res => {
      if (res['status'].code == 1) {
        this.displayMessage({ type: "Rejected", message: 'Rejected' });
        this.clear(nachApproval);
      } else {
        this.displayMessage({ type: "Alert", message: res['status']['message'] })
      }
    }, error =>
      console.log('There was an error: '),
    );

  }
  public ApprovePhysicalNach(nachApproval,applicationId): void {
    let params = {
      applicationid: this.nachApproveData['ApplicationId'],
      status: 2
    } 
    this.EnachService.getApplicationUpdate(params).subscribe(res => {
      if (res['status'].code == 1) {
        this.displayMessage({ type: "Success", message: res['status']['message'] });
        this.goToPhysicalNach(nachApproval);
        this.clear(nachApproval);
        
      } else {
        this.displayMessage({ type: "Alert", message: res['status']['message'] })
      }
    }, error =>
      console.log('There was an error: '),
    );

  }
  public clear(nachApproval): void {
    nachApproval.resetForm();
  }
  public goToPhysicalNach(nachApproval) {
    this.router.navigate(['./enach/NACH-registration', { applicationId: this.nachApproveData['ApplicationId']}]);    
  }
  private displayMessage(params): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: params
    });
  }
}
