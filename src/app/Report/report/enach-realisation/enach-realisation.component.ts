import { Component, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { RepaymentService } from '../../../services/LMS/repayment.service';
import { first } from 'rxjs/operators';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../../services/common/common.service';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';


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

export interface collectionPendingElement {
  slno: number,
  loanId: string,
  customerName: string,
  instrumentRefNo: string,
  interestAmount: string,
  principle: string,
  vapAmount: string,
  otherCharges: string,
  collectionAmount: string,
  collectionId: string,
  checked: boolean


}

var LOAN_DATA: loanDataElement[] = [];
var COLLECTION_DATA: collectionPendingElement[] = [];

@Component({
  selector: 'app-enach-realisation',
  templateUrl: './enach-realisation.component.html',
  styleUrls: ['./enach-realisation.component.scss']
})
export class EnachRealisationComponent implements OnInit {

  public settings: Settings;
  
  displayedColumn2: string[] = ["realisationStatus", "loanId", "customerName", "instrumentRefNo",
    "interestAmount", "principle", "vapAmount", "otherCharges", "collectionId", "collectionAmount"];


  loanDataSource = new MatTableDataSource<loanDataElement>(LOAN_DATA);
  loanDataSource2 = new MatTableDataSource<collectionPendingElement>(COLLECTION_DATA);

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<collectionPendingElement>(this.allowMultiSelect, this.initialSelection);


  paymentModeList: any;
  loanId: any;
  isLoanDataAvailable: boolean = false;
  isAll: boolean;
  loanSearchType: string;
  searchTypeParam: any;
  searchDataParam: any;
  whereData: string;

  instrumentType: any;
  firmId: any;
  loanIdToPass: any;
  productId: any;
  instrumentDate: any;
  paymentModeSearchType: any;
  apiDataList: any;
  //dataListArray:any;
  dataListArray: any[] = new Array();
  isChecked: boolean = true;
  selectRowData = true;
  whereDataLoanId: string;
  slno: number;
  loanId_InsRef_Amount: string;
  poundSymbol: string;
  totalNetAmount: any;
  totalAmount: number = 0;
  apiId: any;
  isVisible: boolean;
  apiDataListLength: any = 0;
  userData: any;

  constructor(private repaymentService: RepaymentService, private dialog: MatDialog,
    private commonService: CommonService, public appSettings: AppSettings) {
    this.settings = this.appSettings.settings;
  }


  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.isVisible = false;
    this.loanSearchType = '2';
    this.BindPaymentMode();
  }

  public  GetLoanDetails() {


    if (this.loanSearchType == '1') {
      this.searchTypeParam = 'ALL'
    }
    else {
      this.searchTypeParam = 'LOAN_ID'
    }

    const searchType =
    {
      "PRODUCT_ID": this.userData['productID'],
      "FIRM_ID": this.userData['firmID'],
      "SEARCH_TYPE": this.searchTypeParam,
      "SEARCH_DATA": this.loanId
    };


    this.repaymentService.getLoanData(searchType)
      .pipe(first())
      .subscribe(
        dt => {
          this.loanDataSource = dt.loanDataList;
          if (dt.loanDataList == "" || dt.loanDataList == null) {
            this.DisplayMessage("Invalid Loan ID", "Alert");
            this.isLoanDataAvailable = false;
          }
          else {
            this.GetChequeDetails(this.loanId);
            this.isLoanDataAvailable = true;
          }

        },
        error =>
          console.log(error));
    return false;

  }



  public BindPaymentMode() {  
    this.paymentModeList = [];
    const params = {
      FIRM_ID: this.userData['firmID'],
    //  PRODUCT_ID: 69,
      flag: 1,
    }
    // this.commomService.getPaymentModeList(params).subscribe(res => {
    //   if (!!res && res['status'].code == 1) {
    //     this.paymentModeList = res['paymentModeList'];
    //     this.field['paymentMode'] = this.paymentModeList.find(x => +x['PaymentModeID'] == +  this.field['paymentModeID'])
    //   }
    // })
    this.repaymentService.GetPaymentModeDetails1({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
        console.log(this.paymentModeList)
      }
    })

  }

  public getSelectedLoanDetails(rowElement) {
    if (!!rowElement) {
      this.loanId = rowElement.LoanId;
      if (this.loanId != null || this.loanId != '') {
        this.GetChequeDetails(this.loanId);
      }
    }

  }

  private ClearDataSource() {
    COLLECTION_DATA = [];
    this.loanDataSource2 = new MatTableDataSource(COLLECTION_DATA);
  }

  public radioAllChange(e) {

  }
  public radioLoanIdChange(e) {

  }

  public findTotal(element) {
    if (element.checked) {
      this.totalAmount = this.totalAmount + +element.collectionAmount;
      this.totalNetAmount = this.totalAmount;
    } else {
      this.totalAmount = this.totalAmount - +element.collectionAmount;
      this.totalNetAmount = this.totalAmount;
    }
  }

  PromiseArray: any;
  private _rptdatePipe(DateValue) {
    var date = new Date(DateValue);
    const months = {
      1: 'JAN',
      2: 'FEB',
      3: 'MAR',
      4: 'APR',
      5: 'MAY',
      6: 'JUN',
      7: 'JUL',
      8: 'AUG',
      9: 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC'
    }
  //  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
  public GetChequeDetails(_loanId) {
    this.ClearDataSource();
    this.totalNetAmount = '';
    this.totalAmount = 0;
    this.instrumentType = this.paymentModeSearchType;
    this.firmId = this.userData['firmID'];
    this.loanId = _loanId;
    this.productId = this.userData['productID'];
    var insDate = new Date(this.instrumentDate);
    let instrumentDate = this.toShortFormat(insDate);
    if (this.loanSearchType == '1') {
      this.apiId = 3;
      this.whereData = this.instrumentType + '||' + this.firmId
        + '||' + this.productId + '||' + instrumentDate;

    } else {
      this.apiId = 2;
      this.whereData = this.instrumentType + '||' + this.firmId
        + '||' + this.loanId + '||' + this.productId + '||' + instrumentDate;
    }
    const passParams =
    {
      "FIRM_ID": this.userData['firmID'],
      "apiID": this.apiId,
      "WHERE_DATA": this.whereData,
      "DATA": ''

    };


    this.repaymentService.getClearedBouncedDetails(passParams)
      .pipe(first())
      .subscribe(
        dt => {
          this.PromiseArray = dt;
          if (this.PromiseArray['status'].code == 1) {
            this.apiDataList = dt.apiDataList;
            if (dt.apiDataList == null || dt.apiDataList == '') {
              this.isVisible = false;
            } else {
              this.isVisible = true;
            }
            this.slno = 1;
            this.apiDataList.forEach(element => {
              this.slno = +this.slno;
              var splitted = element.ParameterValue.split('^', 9);
              var object_name = {
                slno: this.slno,
                loanId: splitted[0],
                customerName: splitted[1],
                instrumentRefNo: splitted[2],
                interestAmount: splitted[3],
                principle: splitted[4],
                vapAmount: splitted[5],
                otherCharges: splitted[6],
                collectionAmount: splitted[7],
                collectionId: splitted[8],
                checked: false

              };
              COLLECTION_DATA.push(object_name);
              this.slno = this.slno + 1;
            })
            this.loanDataSource2 = new MatTableDataSource(COLLECTION_DATA);
          } else {
            this.DisplayMessage(this.PromiseArray['status']['message'], "Alert");
          }

        }, error =>
        console.log('There was an error:'));
  }

  DisplayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  toShortFormat(dateStringVal) {

    this.instrumentDate = dateStringVal;

    var month_names = ["Jan", "Feb", "Mar",
      "Apr", "May", "Jun",
      "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"];

    var day = ('0' + this.instrumentDate.getDate()).slice(-2);
    var month_index = this.instrumentDate.getMonth();
    var year = this.instrumentDate.getFullYear();

    return day + '/' + month_names[month_index] + '/' + year;

  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.loanDataSource2.data.length;
    return numSelected == numRows;
  }

  masterToggle(rowData) {
    this.isAllSelected() ?
      this.selection.clear() :
      this.loanDataSource2.data.forEach(row => this.selection.select(row));

  }

  public PostCleared() {
    this.settings.loadingSpinner = true;

    COLLECTION_DATA.forEach((element, index) => {

      if (element.checked) {

        this.checkedCount = this.checkedCount + 1;

      }

    });

    if (this.checkedCount <= 0) {
      this.DisplayMessage('Select atleast one record to proceed', 'Alert');
      this.settings.loadingSpinner = false;
      return;
    }


    this.loanId_InsRef_Amount = '';
    this.poundSymbol = '#';
    COLLECTION_DATA.forEach((element, index) => {
      if (element.checked) {
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + this.poundSymbol
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.loanId + '~'
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.collectionId + '~'
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.collectionAmount + '^'
        this.poundSymbol = '';
      }
    });
    let instrumentDate
    if (this.instrumentDate != null) {
      var insDate = new Date(this.instrumentDate);
      instrumentDate = this.toShortDate(insDate);
    }
    var appended_loanId_InsRef_Amount = '1' + '#'
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + this.instrumentType + '#'
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + instrumentDate
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + this.loanId_InsRef_Amount;
    const PostRelisationData =
    {
      "firmID": this.userData['firmID'],
      "branchID": this.userData['branchID'],
      "moduleID": 1,
      "LoanDetails": appended_loanId_InsRef_Amount,
      "UserID": this.userData['empCode']
    };
    this.repaymentService.PostInstrumentRealisation(PostRelisationData)
      .subscribe(result => {
        this.settings.loadingSpinner = false;
        if (result['status'].flag == 1 && result['status'].code == 1) {
          this.DisplayMessage('Data submitted successfully', "Success");

          COLLECTION_DATA.forEach((element, index) => {
            if (element.checked) {
              COLLECTION_DATA.splice(index, 1);
            }
          });
          this.loanDataSource2 = new MatTableDataSource(COLLECTION_DATA);
          this.totalNetAmount = '';
          this.totalAmount = 0;
          this.loanId = undefined;
          this.paymentModeSearchType = undefined;
        } else {
          this.DisplayMessage(result['status'].message, "Alert");
        }
      }, error => {
        console.log('There was an error: ');
      })
  }

  Clear() {
    this.instrumentDate = '';
    this.instrumentType = '';
    this.paymentModeSearchType = '';
    this.loanId = '';
    this.ClearDataSource();
  }

  checkedCount: number = 0;

  
  public PostBounced() {
    this.settings.loadingSpinner = true;
    COLLECTION_DATA.forEach((element, index) => {
      if (element.checked) {
        this.checkedCount = this.checkedCount + 1;
      }
    });
    if (this.checkedCount <= 0) {
      this.DisplayMessage('Select atleast one record to proceed', 'Alert');
      this.settings.loadingSpinner = false;
      return;
    }
    this.loanId_InsRef_Amount = '';
    COLLECTION_DATA.forEach((element, index) => {
      if (element.checked) {
        this.checkedCount = this.checkedCount + 1;
        return false;
      }
    });
    if (this.checkedCount = 0) {
      this.DisplayMessage('Select atleast one record to proceed', 'Alert');
      this.settings.loadingSpinner = false;
      return;
    }
    this.poundSymbol = '#'
    COLLECTION_DATA.forEach((element, index) => {
      if (element.checked) {
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + this.poundSymbol;
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.loanId + '~';
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.loanId + '~'
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.collectionId + '~'
        this.loanId_InsRef_Amount = this.loanId_InsRef_Amount + element.collectionAmount + '^'
        this.poundSymbol = '';
      }
    });
    let instrumentDate;
    if (this.instrumentDate != null) {
      var insDate = new Date(this.instrumentDate);
      instrumentDate = this.toShortDate(insDate);
    }
    var appended_loanId_InsRef_Amount = 2 + '#';
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + this.instrumentType + '#';
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + instrumentDate;
    appended_loanId_InsRef_Amount = appended_loanId_InsRef_Amount + this.loanId_InsRef_Amount;



    const PostRelisationData = {
      "firmID": this.userData['firmID'],
      "branchID": this.userData['branchID'],
      "moduleID": 1,
      "LoanDetails": appended_loanId_InsRef_Amount,
      "UserID": this.userData['empCode']

    }
    this.settings.loadingSpinner = true;
    this.repaymentService.PostInstrumentRealisation(PostRelisationData)
      .subscribe(result => {
        this.settings.loadingSpinner = false;
        if (result['status'].flag == 1 && result['status'].code == 1) {
          this.DisplayMessage('Data submitted successfully', "Success");
          COLLECTION_DATA.forEach((element, index) => {
            if (element.checked) {
              COLLECTION_DATA.splice(index, 1);
            }
          });
          this.loanDataSource2 = new MatTableDataSource(COLLECTION_DATA);
          this.totalNetAmount = '';
          this.totalAmount = 0;
          this.loanId = undefined;
          this.paymentModeSearchType = undefined;
        } else {
          this.DisplayMessage(result['status'].message, "Alert");

        }
      }, error => {
        this.settings.loadingSpinner = false;
        console.log('There was an error: ');
      })
  }

  toShortDate(dateStringVal) {
    this.instrumentDate = dateStringVal;
    var month_names = ["01", "02", "03",
      "04", "05", "06",
      "07", "08", "09",
      "10", "11", "12"];
    var day = ('0' + this.instrumentDate.getDate()).slice(-2);
    var month_index = this.instrumentDate.getMonth();
    var year = this.instrumentDate.getFullYear();
    return day + '-' + month_names[month_index] + '-' + year;
  }

}
