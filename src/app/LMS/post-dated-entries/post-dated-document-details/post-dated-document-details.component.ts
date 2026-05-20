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


export interface PDDElement {
  slno: number;
  documentid: any;
  documentname: any;
  originalreceived: boolean;
  originalreceiveddate: any;
  scannedcopyreceived: boolean;
  scannedcopyreceiveddate: any;
}

const LOAN_DATA: loanDataElement[] = [
  {
    LoanId: '', BranchID: '', CustomerName: '',
    PrimaryPhone: '', LoanAmount: '', LoanDate: '',
    Classification: '', BranchName: ''
  }
];

let PDD_DATA: PDDElement[] = [];

@Component({
  selector: 'app-post-dated-document-details',
  templateUrl: './post-dated-document-details.component.html',
  styleUrls: ['./post-dated-document-details.component.scss']
})

export class PostDatedDocumentDetailsComponent implements OnInit {
  displayedColumnsLoanDetails: string[] = ["LoanId", "BranchID", "CustomerName",
    "PrimaryPhone", "LoanAmount", "LoanDate", "Classification", "BranchName"];
  displayedColumnsDocumentDetails: string[] = ['slno', "documentname", "originalreceived", "originalreceiveddate", 'scannedcopyreceived', 'scannedcopyreceiveddate'];
  loanDataSource = new MatTableDataSource<loanDataElement>(LOAN_DATA);
  selection = new SelectionModel<loanDataElement>(true, []);
  pddDetailSource = new MatTableDataSource<PDDElement>(PDD_DATA);

  //liveLoanSearchType:any=33;
  liveLoanSearchType: any;
  commonDataList: any;
  searchText: any;
  isLoanDataAvailable: boolean = false;
  resultStringMaster: any;
  resultObjectMaster: any;
  loanId: any;
  public originalreceiveddate: any = {};
  public scannedcopyreceiveddate: any = {};
  dataSourceList: any;
  loanDataSourceList: any;
  pdcStr: any = '';
  resultStringConfirm: any;
  resultObjectConfirm: any;
  outPutMessage: any;
  ispddDataAvailable: boolean = false;
  isConfirmEnabled: boolean = false;
  originalRecDate: any;
  scannedRecDate: any;
  slno: number = 0;
  userData: any;
  constructor(public dialog: MatDialog, private pddService: PostDatedEntriesService) { }



  ngOnInit() {
    this.userData = this.pddService.getCredentials();
    this.onLoad();

  }

  onLoad() {
    PDD_DATA = [];
    this.customerName = undefined;
    this.loanId = undefined;
    this.pddDetailSource = new MatTableDataSource(PDD_DATA);
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

  public searchLoan(searchTextData: string, item, searchForm) {
    let commonDataListModelText;
    let commonDataListModel = this.commonDataList.find(s => s.CommonDataID == item);
    if (commonDataListModel) {
      commonDataListModelText = commonDataListModel.CommonDataName; // contains dropdown selected text 
    }

    const searchType = {
      "PRODUCT_ID": this.userData['productID'],
      "FIRM_ID": this.userData['firmID'],
      "SEARCH_TYPE": commonDataListModelText,
      "SEARCH_DATA": searchTextData
    };

    this.pddService.getLoanData(searchType)
      .pipe(first())
      .subscribe(dt => {
        this.loanDataSource = dt.loanDataList;
        if (dt.loanDataList == "" || dt.loanDataList == null) {
          let msg = 'The requested customer/loan details not exist'
          this.displayMessage(msg, 'Alert');
          this.onLoad();
        } else {
          this.isLoanDataAvailable = true;
        }
      }, error =>
          console.log(error));
    return false;

  }

  getSelectedLoanDetails(e) {
    if (!!e) {
      PDD_DATA = [];
      this.pddDetailSource = new MatTableDataSource(PDD_DATA);
      this.slno = 0;
      this.loanId = e.LoanId;

      const passParams = {
        'FIRM_ID': this.userData['firmID'],
        'apiID': 6,
        'WHERE_DATA': this.loanId,
        'DATA': '',
      }

      this.pddService.getPddDocumentDetails(passParams)
        .pipe(first())
        .subscribe(dt => {
          this.pddDetailSource = dt.apiDataList;
          if (dt.apiDataList == "" || dt.apiDataList == null) {
            this.ispddDataAvailable = false;
            this.isConfirmEnabled = false;
            this.displayMessage('No Installment No(s) available', 'Alert')
          } else {
            dt.apiDataList.forEach(element => {
              let splitted = element.ParameterValue.split('^', 2);

              this.slno = this.slno + 1;
              let object_name = {
                slno: this.slno,
                documentid: splitted[0],
                documentname: splitted[1],
                originalreceived: null,
                originalreceiveddate: null,
                scannedcopyreceived: null,
                scannedcopyreceiveddate: null

              };
              PDD_DATA.push(object_name);

            })

            this.pddDetailSource = new MatTableDataSource(PDD_DATA);
            this.ispddDataAvailable = true;
            this.isConfirmEnabled = true;
          }
        }, error => console.log(error));
      return false;
    }

  }



  public confirm(searchForm) {

    this.dataSourceList = this.pddDetailSource.filteredData;
    this.dataSourceList.forEach((element, index) => {

      if (element.originalreceived != undefined || element.originalreceiveddate != undefined || element.scannedcopyreceived != undefined || element.scannedcopyreceiveddate != undefined) {
        this.originalRecDate = this.toShortFormat(element.originalreceiveddate);
        this.scannedRecDate = this.toShortFormat(element.scannedcopyreceiveddate);

        this.pdcStr = this.pdcStr +
          element.documentid + '|' + element.documentname + '|' + element.originalreceived + '|' + this.originalRecDate + '|' + element.scannedcopyreceived + '|' + this.scannedRecDate + '^';
      } else {
        this.pdcStr = this.pdcStr;
      }
    });
    if (this.pdcStr.length > 0) {
      this.pdcStr = this.loanId + '|' + this.pdcStr;
    } else {
      this.displayMessage('Enter PDD Details', 'Alert')
      return;
    }
    const saveParams = {
      'FirmID': this.userData['firmID'],
      'BranchID': this.userData['branchID'],
      'ModuleID': 1,
      'UserID': this.userData['empCode'],
      'InputData': this.pdcStr,
      "ProcedureID": 3
    }


    this.pddService.saveData(saveParams)
      .subscribe(result => {
        this.resultStringConfirm = JSON.stringify(result);
        this.resultObjectConfirm = JSON.parse(this.resultStringConfirm);
        if (this.resultObjectConfirm.status.flag == 1) {
          this.displayMessage(this.resultObjectConfirm.outputMessage, 'Success');
          this.pdcStr = '';
        } else {
          this.displayMessage(this.resultObjectConfirm.outputMessage, 'Alert')
        }
      }, error => {
        console.log('There was an error: ');
      })

  }

  toShortFormat(dateStringVal) {
    let month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];
    let day = ('0' + dateStringVal.getDate()).slice(-2);
    let month_index = dateStringVal.getMonth();
    let year = dateStringVal.getFullYear();
    return day + '/' + month_names[month_index] + '/' + year;
  }


  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (type == 'Success') {
        this.onLoad();
      }
    });
  }


}
