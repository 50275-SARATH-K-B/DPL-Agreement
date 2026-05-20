import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { PostDatedEntriesService } from '../../../services/LMS/post-dated-entries.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
export interface loanDataElement {
  LoanId: string;
  BranchID: string;
  CustomerName: string;
  PrimaryPhone: string;
  LoanAmount: string,
  LoanDate: any,
  Classification: string,
  BranchName: string
}


export interface InstallmentNoElement {
  Level: number;
  InstrumentNo: number;
  InstrumentDate: any;
  checked: any;
}



let DOCUMENT_DATA: InstallmentNoElement[] = [];


@Component({
  selector: 'app-post-dated-cheque',
  templateUrl: './post-dated-cheque.component.html',
  styleUrls: ['./post-dated-cheque.component.scss']
})
export class PostDatedChequeComponent implements OnInit {

  displayedColumnsLoanDetails: string[] = ["LoanId", "CustomerName",
    "PrimaryPhone", "LoanAmount", "LoanDate", "Classification", "BranchName"];

  displayedColumnsDocumentDetails: string[] = ["Level", "InstrumentNo", "InstrumentDate", 'notapplicable'];

  selection = new SelectionModel<loanDataElement>(true, []);
  documentDetailsSource = new MatTableDataSource<InstallmentNoElement>(DOCUMENT_DATA);

  isLoanDataAvailable: boolean = false;
  resultStringMaster: any;
  resultObjectMaster: any;
  loanId: any;
  public InstrumentDate: any = {};
  public InstrumentNo: any = {};
  dataSourceList: any;
  loanDataSourceList: any;
  pdcStr: any = '';
  resultStringConfirm: any;
  resultObjectConfirm: any;
  outPutMessage: any;
  ispdcDataAvailable: boolean = false;
  isConfirmEnabled: boolean = false;
  slno: any = 0;
  userData: any;
  constructor(public dialog: MatDialog, private pdcService: PostDatedEntriesService) { }

  ngOnInit() {
    this.userData = this.pdcService.getCredentials();
    this.onLoad();
  }

  onLoad(): any {
    this.clearDataSource();
    this.loanSearch();
  }

  customerName: string;
  loanSearch(): any {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
        this.loanId = result['loanItem'].LoanId.toString();;
        this.customerName = result['loanItem'].CustomerName;
      }
    });
  }


  clearDataSource() {
    DOCUMENT_DATA = [];
    this.documentDetailsSource = new MatTableDataSource(this.documentDetailsSource.filteredData);
  }

  getSelectedLoanDetails(e) {
    if (!!e) {
      this.loanId = e.LoanId;
      this.pdcService.getInstNoList(this.loanId)
        .pipe(first())
        .subscribe(dt => {
          this.documentDetailsSource = new MatTableDataSource(dt.instList);
          if (dt.instList == "" || dt.instList == null) {
            this.ispdcDataAvailable = false;
            this.isConfirmEnabled = false;
            this.displayMessage('No Installment No(s) available', 'Alert')
          } else {
            this.ispdcDataAvailable = true;
            this.isConfirmEnabled = true;
          }
        }, error => console.log(error));
      return false;
    }

  }

  public clear() {
    this.isLoanDataAvailable = false;
    this.ispdcDataAvailable = false;
    this.isConfirmEnabled = false;
    this.dataSourceList = this.documentDetailsSource;
    this.onLoad()
  }

  public confirm(pdcSearchForm) {
    this.dataSourceList = this.documentDetailsSource;
    this.dataSourceList.data.forEach((element, index) => {
      if (element.checked != true) {
        if (element.InstrumentNo != undefined && element.InstrumentDate != undefined) {
          this.pdcStr = this.pdcStr +
            element.Level + '|' + element.InstrumentNo + '|' + this.toShortFormat(element.InstrumentDate) + '^';
        } else {
          this.pdcStr = this.pdcStr;
        }
      }

    });

    this.pdcStr = this.loanId + '|' + this.pdcStr;

    const saveParams = {
      'FirmID': this.userData['firmID'], 'BranchID': this.userData['branchID'],
      'ModuleID': 1, 'UserID': this.userData['empCode'],
      'InputData': this.pdcStr, "ProcedureID": 2
    }
    this.pdcService.saveData(saveParams)
      .subscribe(result => {
        this.resultStringConfirm = JSON.stringify(result);
        this.resultObjectConfirm = JSON.parse(this.resultStringConfirm);
        this.outPutMessage = this.resultObjectConfirm.outputMessage;
        if (this.resultObjectConfirm['status'].flag == 1 && this.resultObjectConfirm['status'].code == 1) {
          this.displayMessage('Data submitted successfully', 'Success');
          this.pdcStr = '';
        } else {
          this.displayMessage(this.outPutMessage, 'Alert')
        }
      }, error => {
        console.log('There was an error: ');
      })

  }

  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (type == 'Success') {
        this.clear();
      }
    });
  }

  toShortFormat(dateStringVal) {
    var month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];
    var day = ('0' + dateStringVal.getDate()).slice(-2);
    var month_index = dateStringVal.getMonth();
    var year = dateStringVal.getFullYear();
    return day + '/' + month_names[month_index] + '/' + year;
  }


}
