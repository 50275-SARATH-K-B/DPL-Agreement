import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { environment } from '../../../environments/environment';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../services/common/common.service';
import { RepaymentService } from '../../services/LMS/repayment.service';

@Component({
  selector: 'app-collection-upload',
  templateUrl: './collection-upload.component.html',
  styleUrls: ['./collection-upload.component.scss']
})
export class CollectionUploadComponent implements OnInit {
  datesdata: any = new Date();
  ledgerId: any;
  PaymentModeID: any;
  paymentModeSearchType: any;
  paymentMode: any;
  instrumentReference: string;
  instrumentDate: string;
  accountListType: string;
  userData: any;
  accountList: any;
  showPaymentMethodExtras: boolean;
  paymentModeList: any;
  subledger: any;
  date:any;
  constructor(
    private repaymentService: RepaymentService,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.date = new Date();
    const param =  {
      flag: 1,
      product_id: this.userData['productID']
    }
    this.repaymentService.GetPaymentModeDetails(param).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
      }
    })
  }
  exportexcel(id): void {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'collection_upload' + new Date().toLocaleDateString() + ".xlsx");

  }


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
  onSelectFile(evt: any): any {
    var splitted = this.paymentModeSearchType.split("^");
    this.ledgerId = splitted[0];
    this.PaymentModeID = splitted[1];
    this.paymentMode = splitted[2];
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    let FileName = target.files[0]['name'];
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      let data = (XLSX.utils.sheet_to_json(ws));
      let collection = [];
      data.forEach(element => {
        let collectionItem = {
          "recordno": element['RecordNo'],
          "transactiondate":this._rptdatePipe(element['TransactionValueDate']),
          "depositdate":this._rptdatePipe(element['DepositDate']),
          "loanId": element['Loan_id'],
          "custId": element['Customer_Id'],
          "collAmt": element['Collection_amount'],
          "receiptNo": element['ReceiptNo'],
          "loanAccountNumber": element['LoanAccountNumber'],
          "paymentMode": element['PaymentMode'],
          "receiptPurpose": element['ReceiptPurpose'],
          "status": element['Status'],
          "bounceCancelReason": element['BounceCancelReason'],
          "bounceCancelDate": this._rptdatePipe(element['BounceCancelDate']),
          "remarks": element['Remarks'],
          "accno": element['DepositBankAccountNumber'],
          "InstrumentReferenceNumber": element['InstrumentReferenceNumber']
        }
        collection.push(collectionItem);
      });
      let params = {
        "FirmID": this.userData['firmID'],
        "userId": this.userData['empCode'],
        "branchId": this.userData['branchID'],
        "paymentmodeId": this.PaymentModeID ? this.PaymentModeID : 0,
        "ledgerId": this.ledgerId ? this.ledgerId : 0,
        "subledgerId": this.subledger ? this.subledger : 0,
        "instrumentReference": this.instrumentReference,
        "collections": collection,
        "ExcelName": FileName,
        "valueDt": this._rptdatePipe(new Date())
      }
      this.repaymentService.uploadCollections(params).subscribe(res => {
        if (res['status'].code == 1 && res['status'].flag == 1) {
          this.dialog.open(UploadStatusReport, {
            width: "90%",
            height: "90%",
            disableClose: true,
            data: { response: res['bulkProperties'] }
          })
          // this.DisplayMessage('Collection Details are updated', 'Success');
        } else {
          // this.dialog.open(UploadStatusReport, {
          //     width: "90%",
          //     height: "70%",
          //     // disableClose: true,
          //     data: { response :res['bulkPropoerties'] }
          //   })
          this.DisplayMessage(res['status']['message'], 'Alert');
        }
      })
    };
    reader.readAsBinaryString(target.files[0]);
  }
  // onChange() {
  //   console.log(this.paymentModeSearchType)
  //   if (!!this.paymentModeSearchType && this.paymentModeSearchType != null) {
  //     var splitted = this.paymentModeSearchType.split("^", 3);
  //     this.ledgerId = splitted[0];
  //     this.PaymentModeID = splitted[1];
  //     this.paymentMode = splitted[2];
  //     if (this.PaymentModeID == 1) {// cash
  //       this.instrumentReference = ''
  //       this.instrumentDate = ''
  //       this.accountListType = ''
  //     }
  //     if (this.userData['branchID'] != null) {
  //       const subAccountParms = {
  //         "Account_No": this.ledgerId,
  //         "Branch_ID": this.userData['branchID'],
  //         "Firm_ID": this.userData['firmID'],
  //       };
  //       this.repaymentService.getSubAccountDetails(subAccountParms)
  //         .subscribe(result => {
            
  //           this.accountList = result['accountList'];
  //           this.showPaymentMethodExtras = (this.accountList == "" || this.accountList == null) ? false : true;
  //         }, error => { console.log('There was an error: ');   });
  //     } else {
  //       this.showPaymentMethodExtras = false;
         
  //     }
  //   }
  // }
  onChangeAction(subLederVal) {
    this.subledger = subLederVal;
  }
  DisplayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
}

@Component({
  templateUrl: './StatusReport.html',
  styleUrls: ['./collection-upload.component.scss']
})


export class UploadStatusReport implements OnInit {
  CountSuccess: any;
  SuccessAmountTotal: number = 0;
  CountFailed: any;
  FailedAmountTotal: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,  private dialog:MatDialog) { }
  displayedColumnsSuccess = ["CustId", "LoanId", "CollectionAmt", "EnterDate", "DepositDate", "TransactionDate", "RecieptNo", "CollectionStatus", "RecieptPurpose","remarks"];
  // displayedColumnsFailed = ["CustId","LoanId","CollectionAmt","EnterBY","EnterDate","instrumentReference","RecieptNo","LoanAccNo","PaymentMode","RecieptPurpose","BounceCancelReason","BounceCancelDate","Remarks","DepositDate","TransactionDate","AccNo"];
  SuccessDataSource = new MatTableDataSource<any>();
  FailedDataSource = new MatTableDataSource<any>();
  successDataList: any = [];
  failedDataList: any = [];
  ngOnInit() {
    
    console.log(this.data['response'])
    if (!!this.data['response']) {
      
      this.failedDataList = this.data['response'].filter(x => x.StatusId == 0);
      this.successDataList = this.data['response'].filter(x => x.StatusId == 1);
      if (this.successDataList) {
        
        this.CountSuccess = this.successDataList.length;
        this.successDataList.forEach(element => {
          this.SuccessAmountTotal = this.SuccessAmountTotal + (+element.CollectionAmt);
        });
        let lastRow = {
          CustId: "Total",
          LoanId: this.CountSuccess,
          CollectionAmt: this.SuccessAmountTotal,
          EnterDate: undefined,
          DepositDate: "",
          TransactionDate: "",
          RecieptNo: "",
          CollectionStatus: "",
          RecieptPurpose: "",
          remarks:""
        }
        this.successDataList.push(lastRow);
        this.SuccessDataSource = new MatTableDataSource<any>(this.successDataList);

      }
      if (this.failedDataList) {
        this.CountFailed = this.failedDataList.length;
        this.failedDataList.forEach(element => {
          this.FailedAmountTotal = this.FailedAmountTotal + (+element.CollectionAmt);
        });
        let lastRow = {
          CustId: "Total",
          LoanId: this.CountFailed,
          CollectionAmt: this.FailedAmountTotal,
          EnterDate: undefined,
          DepositDate: "",
          TransactionDate: "",
          RecieptNo: "",
          CollectionStatus: "",
          RecieptPurpose: "",
          remarks:""
        }
        this.failedDataList.push(lastRow);
        this.FailedDataSource = new MatTableDataSource<any>(this.failedDataList);
      }

    }
  }
  exportexcelformat(idSuccess, idFailed): void {

    console.log(idSuccess);
    
    /* table id is passed over here */
    let element = document.getElementById(idSuccess);
    console.log(element);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Collection' + new Date().toLocaleDateString() + ".xlsx");
    // this.exportexcelformats(idFailed);
  }
  exportexcelformats(idFailed) {
    /* table id is passed over here */
    let element = document.getElementById(idFailed);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Failed' + new Date().toLocaleDateString() + ".xlsx");
  }
  close(){
    this.dialog.closeAll()
  }
}