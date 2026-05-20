import { Component, OnInit } from '@angular/core';
import { MoratoriumService } from '../../../services/LMS/moratorium.service';
import { CommonService } from '../../../services/common/common.service';
import { MatDialog } from '@angular/material';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-moratorium-approval',
  templateUrl: './moratorium-approval.component.html',
  styleUrls: ['./moratorium-approval.component.scss']
})
export class MoratoriumApprovalComponent implements OnInit {

  private userData: object;
  public morottorium: object;
  public branchList: Array<object> = [];
  public morottoriumList: Array<object> = [];
  constructor(private moratoriumService: MoratoriumService,
    private dialog: MatDialog,
    private commonService: CommonService) { }


  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.morottorium = {
      BranchID: '',
      LoanID: '',
      CustomerName: '',
      PrimaryPhone: '',
      LoanAmount: '',
      LoanDate: '',
      Classification: '',
      MorotoriumFrom: '',
      MorotoriumTo: '',
      Reason: '',
      Days: '',
      LoanBalance: '',
      DebtorsBalance: '',
      ChargesPending: '',
      AdvanceAmt: '',
      DueNo: '',
      netDue: ''
    }
    this.getBranchList();

  }
  public getBranchList(): void {
    this.moratoriumService.getBranchList({ FIRM_ID: this.userData['firmID'] }).subscribe(res => {
      if (!!res) {
        if (res['status'].code == 1) {
          this.branchList = res['branchList'];
        }
      }
    })
  }
  public onBranchChange(): void {
    this.morottorium['LoanID'] = '';
    this.morottorium['CustomerName'] = '';
    this.morottorium['PrimaryPhone'] = '';
    this.morottorium['LoanAmount'] = '';
    this.morottorium['LoanDate'] = '';
    this.morottorium['Classification'] = '';
    this.morottorium['MorotoriumFrom'] = '';
    this.morottorium['MorotoriumTo'] = '';
    this.morottorium['Reason'] = '';
    this.morottoriumList = [];
    if (this.morottorium['BranchID'] !== '' && this.morottorium['BranchID'] !== null && !!this.morottorium['BranchID']) {
      this.moratoriumService.getMorottoriumList({ _firmID: this.userData['firmID'], _branchID: this.morottorium['BranchID'] }).subscribe(res => {
        if (!!res) {
          if (res['status'].code == 1) {
            this.morottoriumList = res['morotoriumDataList'];
          }
        }
      })
    }
  }
  public onLoanNumberChange(): void {
    this.morottorium['CustomerName'] = '';
    this.morottorium['PrimaryPhone'] = '';
    this.morottorium['LoanAmount'] = '';
    this.morottorium['LoanDate'] = '';
    this.morottorium['Classification'] = '';
    this.morottorium['MorotoriumFrom'] = '';
    this.morottorium['MorotoriumTo'] = '';
    this.morottorium['Reason'] = '';
    if (this.morottorium['LoanID'] !== '' && this.morottorium['LoanID'] !== null && !!this.morottorium['LoanID'] && this.morottoriumList.length > 0) {
      const result = this.morottoriumList.filter(element => +element['LoanId'] == +this.morottorium['LoanID']);
      this.morottorium['CustomerName'] = result[0]['CustomerName'];
      this.morottorium['PrimaryPhone'] = result[0]['PrimaryPhone'];
      this.morottorium['LoanAmount'] = result[0]['LoanAmount'];
      this.morottorium['LoanDate'] = new Date(result[0]['LoanDate']);
      this.morottorium['Classification'] = result[0]['Classification'];
      this.morottorium['MorotoriumFrom'] = new Date(result[0]['MorotoriumFrom']);
      this.morottorium['MorotoriumTo'] = new Date(result[0]['MorotoriumTo']);
      this.morottorium['Reason'] = result[0]['Reason'];
      this._getNumberofDays();
      this.getLoanDetails();
    }
  }

  private _getNumberofDays() {
    if (this.morottorium['MorotoriumFrom'] != null && this.morottorium['MorotoriumTo'] != null) {
      const diff = Math.abs(this.morottorium['MorotoriumFrom'].getTime() - this.morottorium['MorotoriumTo'].getTime());
      const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
      this.morottorium['Days'] = diffDays;
    }
  }

  private getLoanDetails(): void {
    const data = {
      Product_ID: +this.userData['productID'],
      Loan_ID: this.morottorium['LoanID'],
      FIRM_ID: this.userData['firmID'],
    };
    this.moratoriumService.getLoanDetails(data)
      .subscribe(res => {
        if (!!res && res['status'].code == 1) {
          if (res['outstandingData'] !== null) {
            this.morottorium['LoanBalance'] = res['outstandingData'][0]['LoanBalance'];
            this.morottorium['DebtorsBalance'] = res['outstandingData'][0]['DebtorsBalance'];
            this.morottorium['ChargesPending'] = res['outstandingData'][0]['ChargesPending'];
            this.morottorium['AdvanceAmt'] = res['outstandingData'][0]['AdvanceAmt'];
            this.morottorium['DueNo'] = res['outstandingData'][0]['DueNo'];
            this.morottorium['netDue'] = res['outstandingData'][0]['AmountPendingClearance'];
          }
        }
      }, error => {

      })
  }
  public clear(morotoriumApproval): void {
    morotoriumApproval.resetForm();
  }
  public approve(morotoriumApproval): void {
    const body = {
      FirmID: this.userData['firmID'],
      BranchID: this.userData['branchID'],
      ModuleID: 0,
      UserID: this.userData['empCode'],
      InputData: this.morottorium['LoanID'],
      ProcedureID: 16
    }
    this.update(body, morotoriumApproval);
  }
  public reject(morotoriumApproval): void {
    const body = {
      FirmID: this.userData['firmID'],
      BranchID: this.userData['branchID'],
      ModuleID: 0,
      UserID: this.userData['empCode'],
      InputData: this.morottorium['LoanID'],
      ProcedureID: 18
    }
    this.update(body, morotoriumApproval);
  }
  private update(body, morotoriumApproval): void {
    this.moratoriumService.saveMorotorium(body).subscribe(result => {
      if (result['status'].code == 1) {
        this.displayMessage({ type: "Success", message: result['status']['message'] });
        this.clear(morotoriumApproval);
      } else {
        this.displayMessage({ type: "Alert", message: result['status']['message'] })
      }
    }, error =>
        console.log('There was an error: '),
    );
  }

  private displayMessage(params): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: params
    });
  }
}
