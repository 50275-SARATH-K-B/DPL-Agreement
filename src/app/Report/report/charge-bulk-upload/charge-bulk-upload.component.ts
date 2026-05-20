import { DatePipe } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
// import { CommonService } from '../services/common.service';
// import { RepaymentService } from '../services/repayment.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RepaymentService } from '../../../services/LMS/repayment.service';
import { CommonService } from '../../../services/common/common.service';

// import { NgxSpinnerService } from 'ngx-spinner';
// import { AlertMessageComponent } from '../common/alert-message/alert-message.component';

@Component({
  selector: 'app-charge-bulk-upload',
  templateUrl: './charge-bulk-upload.component.html',
  styleUrls: ['./charge-bulk-upload.component.scss']
})
export class ChargeBulkUploadComponent implements OnInit {
  datesdata: any = new Date(); 
  userData: any;
  date:any;
  value_date: Date;
  constructor(
    private repaymentService: RepaymentService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datepipe: DatePipe,

    // private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit() {
      this.userData = this.commonService.getCredentials();
      this.commonService.session2()

  }
  exportexcel(id): void {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'charge_upload' + new Date().toLocaleDateString() + ".xlsx");

  }
  getDatePipe(date) {
    let fullDate = new Date(date);
    let month = fullDate.getMonth() + 1;
    return (month > 9 ? month : ('0' + month)) + '-' + fullDate.getDate() + '-' + fullDate.getFullYear();
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
      console.log(data)
      let collection = [];
      data.forEach(element => {
        let collectionItem =
        {
          "loanId": element['Loan_number'],
          "custId": element['Customer_id'],
          "collAmt": element['Rec_Pay_amt'],
          "accNo": element['ledger_id'],
          "accType": element['transaction_type'],
          "businesS_PARTNER": element['Business_Partner'],
          "reC_PAY_CHARGECODE": element['Rec_Pay_chargecode'],
          "reC_PAY_AMT": element['Rec_Pay_amt'],
          "reC_PAY_DATE": this._rptdatePipe(element['Rec_Pay_date']),
          "remark": element['Remark'],
          "reason": element['Reason']
        }
        collection.push(collectionItem);
      });
      let params = {
        "FirmID": this.userData['firmID'],
        "userId": this.userData['empCode'],
        "branchId": this.userData['branchID'],
        "chargeBulk": collection,
        "ExcelName": FileName,
      }
      // this.spinner.show();
      // this.repaymentService.uploadCharge(params).subscribe(res => {
      //   if (res['status'].code == 1 && res['status'].flag == 1) {
      //     // this.DisplayMessage('Charge Collection Details are updated', 'Success');
      //     this.dialog.open(UploadStatusReportCharge, {
      //       width: "90%",
      //       height: "70%",
      //       disableClose: true,
      //       data: {response :res['bulkProperties'] }
      //     })
      //   } else {
      //     // this.DisplayMessage(res['status']['message'], 'Alert');
      //   }
      //   // this.spinner.hide();
      // }, error => {
      //   // this.spinner.hide();
      // })
    };
    reader.readAsBinaryString(target.files[0]);
  }
  // DisplayMessage(message, type): any {
  //   const dialogRef = this.dialog.open(AlertMessageComponent, {
  //     width: '30%',
  //     data: { message: message, type: type }
  //   });
  // }
}



@Component({
  selector: 'app-UploadStatusReport',
  templateUrl: './charge-Upload-Status.html',
  styleUrls: []
})
export class UploadStatusReportCharge implements OnInit {
  CountSuccess: any;
  SuccessAmountTotal:number = 0;
  CountFailed: any;
  FailedAmountTotal: number = 0;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
  private dialog:MatDialog) { }
  displayedColumnsSuccess = ["CustId","LoanId","CollectionAmt","AccNo","AccType","EnterDate","Reason"];
  // displayedColumnsFailed = ["CustId","LoanId","CollectionAmt","EnterBY","EnterDate","instrumentReference","RecieptNo","LoanAccNo","PaymentMode","RecieptPurpose","BounceCancelReason","BounceCancelDate","Remarks","DepositDate","TransactionDate","AccNo"];
  SuccessDataSource = new MatTableDataSource<any>();
  FailedDataSource = new MatTableDataSource<any>();
  successDataList:any=[];
  failedDataList:any=[];
  ngOnInit() { 
    if(!!this.data['response']) {
      this.successDataList = this.data['response'].filter(x=>x.StatusId == 1);
      this.failedDataList = this.data['response'].filter(x=>x.StatusId == 0);
      if(this.successDataList) {
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
          PaymentMode: "",
          RecieptPurpose: ""
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
          PaymentMode: "",
          RecieptPurpose: ""
        }
        this.failedDataList.push(lastRow);
        this.FailedDataSource = new MatTableDataSource<any>(this.failedDataList);
      }

    }
  }
  close(){
    this.dialog.closeAll()
  }
}

function AlertMessageComponent(AlertMessageComponent: any, arg1: { width: string; data: { message: any; type: any; }; }) {
  throw new Error('Function not implemented.');
}
