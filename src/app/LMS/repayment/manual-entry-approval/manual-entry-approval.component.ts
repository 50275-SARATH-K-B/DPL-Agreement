import { Component, OnInit } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../services/report/common.service';
import { RepaymentService } from '../../../services/report/repayment.service';
import { DatePipe } from '@angular/common';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
export interface accountElement {
  accountId: any,
  accountName: any,
  description: any,
  Amount: any,
  type: any,
  typeID: any, 
}
var ACCOUNTDATA: accountElement[] = [];
@Component({
  selector: 'app-manual-entry-approval',
  templateUrl: './manual-entry-approval.component.html',
  styleUrls: ['./manual-entry-approval.component.scss']
})
export class ManualEntryApprovalComponent implements OnInit {
  public settings: Settings;
  userData: any;
  paymentModeList: any;
  displayedColumns: string[] = ['accountName', 'description', 'amount', 'type'];
  dataSource = new MatTableDataSource<accountElement>(ACCOUNTDATA);
  custData: any;
  accountData: any;
  ChargeList: any;
  typeList: any;
  constructor(public appSettings: AppSettings,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe
  ) { this.settings = this.appSettings.settings; }


  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.custData = {
      customerID: '',
      customerName: '',
      loanID: '',
      loanAmount: '',
      loanDate: '',
    }
    this.accountData = {
      accountName: '',
      accountId: '',
      decription: '',
      Amount: '',
      type: '',
      typeID: '',
    }
    ACCOUNTDATA = [];
    this.dataSource = new MatTableDataSource<accountElement>(ACCOUNTDATA);
    this.getTypes();
    this.getChargeTypesList();
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
      }
    })
  }
  
  getTypes() {
    let param = {
      flag : 0
    }
    this.commonService.getManualTypeList(param) 
      .subscribe(res => {
        if (res['status'].code == 1 && res['status'].flag == 1) {
          this.typeList = res['commonDataList'];
        }
      })
  }
  public loanSearch(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.settings.loadingSpinner = false;
        this.getSelectedLoanDetails(result.loanItem);
      }
    });
  }
  getChargeTypesList() {
    const params = {
      FirmID: this.userData['firmID'],
      StatusID: 1,
      ProductID: this.userData['productID'], 
    } 
    
    this.repaymentService.GetChargeTypesList(params).subscribe(res => {
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.ChargeList = res['chargeProperties'];
      }
    })
  }
  getSelectedLoanDetails(loanItem: any) {
    this.custData['loanID'] = loanItem.LoanId;
    this.custData['loanDate'] = !!loanItem.LoanDate ? this.filterDate(loanItem.LoanDate, "/") : "";
    this.custData['loanAmount'] = loanItem.LoanAmount;
    this.custData['customerName'] = loanItem.CustName;
    this.custData['customerID'] = loanItem.CustID;
  }
  filterDate(date, formatChar) {
    const month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = (new Date(date)).getDate();
    const month_index = (new Date(date)).getMonth();
    const year = (new Date(date)).getFullYear();
    if (formatChar == "-") {
      return day + "-" + month_names[month_index] + "-" + year;
    } else if (formatChar == "/") {
      return day + "/" + month_names[month_index] + "/" + year;
    } else {
      return day + "-" + month_names[month_index] + "-" + year;
    }

  }
  AddEntry(ManualEntryForm) {
    let accountData = this.ChargeList.find(s => s.ChargeId == this.accountData['accountId']);
    let typeData = this.typeList.find(s => s.CommonDataName == this.accountData['typeID']);
    const element = {
      accountName: accountData['ChargeDesc'],
      accountId: this.accountData['accountId'],
      description: this.accountData['decription'],
      Amount: this.accountData['Amount'],
      type: typeData['Description'],
      typeID: this.accountData['typeID'],
    }
    ACCOUNTDATA.push(element);
    this.dataSource = new MatTableDataSource<accountElement>(ACCOUNTDATA);
    ManualEntryForm.resetForm();
  }
  Clear(ManualEntryForm, custDetailsForm) {
    if (!!ManualEntryForm) {
      ManualEntryForm.resetForm();
    }
    if (!!custDetailsForm) {
      custDetailsForm.resetForm();
    }
    ACCOUNTDATA = [];
    this.dataSource = new MatTableDataSource<accountElement>(ACCOUNTDATA);
  }
  saveEntry(ManualEntryForm, custDetailsForm) {
    if (this.dataSource.data.length > 0) {
      let inputData: string = '';
      ACCOUNTDATA.forEach(element => {
        inputData = inputData + element.accountId + '~' + element.description + '~' + element.type + '~' + element.Amount + '^'
      });
      inputData = inputData + "$" + this.userData['branchID'] + "$" + this.userData['firmID'] + "$" + this.userData['productID']
      const params = {
        LoanID: this.custData['loanID'],
        UserID: this.userData['empCode'],
        InputData: inputData,
        InputCnt: ACCOUNTDATA.length
      }
      this.settings.loadingSpinner = true;
      this.repaymentService.saveAdhoc(params).subscribe(res => {
        if (res['status'].code == 1 && res['status'].flag == 1) {
          this.settings.loadingSpinner = false;
          this.displayMessage('Data saved successfully', "Success");
          this.Clear(ManualEntryForm, custDetailsForm);
          ACCOUNTDATA = [];
          this.dataSource = new MatTableDataSource<accountElement>(ACCOUNTDATA);
        } else {
          this.settings.loadingSpinner = false;
          this.displayMessage(res['status'].message, "Alert");
        }
      }, error => { this.settings.loadingSpinner = false; })
    }
  }
  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: type }
    });
  }
}