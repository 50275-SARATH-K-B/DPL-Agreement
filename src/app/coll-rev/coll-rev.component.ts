import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
// import{ConfirmationPageComponent}  from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RemarksReaderComponent } from '../remarks-reader/remarks-reader.component';
import { MatTableDataSource } from '@angular/material/table';
import { CommonService } from '../services/report/common.service';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { ConfirmationPageComponent } from '../confirmation-page/confirmation-page.component';
import { Settings } from './../app.settings.model';
import { environment } from '../../environments/environment';
import { AppSettings } from '../app.settings';
@Component({
  selector: 'app-coll-rev',
  templateUrl: './coll-rev.component.html',
  styleUrls: ['./coll-rev.component.scss']
})
export class CollRevComponent implements OnInit {
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  datesdata:any = new Date();
  CollectionList: any[];
  loanID: any;
  LoanDate: string;
  LoanAmount: any;
  customerName: any;
  customerID: any;
  displayedColumns: string[] = ['Slno', 'transID', 'ReceiptNo', 'ReceiptDate', 'paymentMode', 'instrumentNo', 'account_type', 'CollectionAmount', 'Actions'];
  dataSource: any;
  date:any;
  userData: any;
  CancelStatus: any;
  remarkText: any = "";
  remarkId: any = "";
  funID: any;
  settledloan:any;
  public settings: Settings;
  constructor(
    
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
   
    private datePipe: DatePipe,public appSettings: AppSettings) {
      this.settings = this.appSettings.settings;

  }
  ngOnInit() {
    this.date = new Date();
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.CollectionList = [];
    this.dataSource = new MatTableDataSource<any>(this.CollectionList);
    this.route.params.subscribe((params: Params) => {
      // if (!!params && !!params['params']) {
      //   this.funID = params['params'];
        this.loanSearch()
      // }
    });
  }

  getReversalData() {
  
    const params = {
      FIRM_ID: this.userData['firmID'],
      Product_ID: this.userData['productID'],
      Loan_ID: this.loanID,
      BRANCH_ID: this.userData['branchID'],
    }
  
    this.commonService.GetCollectionReversal(params).subscribe(res => {
    
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.CollectionList = res['collDataList'];
        console.log(this.CollectionList)
        this.dataSource = new MatTableDataSource<any>(this.CollectionList);
      } else {
        this.displayMessage(res['status'].message, 'Alert');
        this.CollectionList = [];
        this.dataSource = new MatTableDataSource<any>(this.CollectionList);
      }
    }, error => {
      this.settings.loadingSpinner = false;
    })
  }
  public loanSearch(): void {
   {
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          
        }
      });
    
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.loanItem.LoanStatus == 0) {
          this.displayMessage("Loan Already Closed", "Success");
        } else {
        this.getSelectedLoanDetails(result.loanItem);
        this.loanID = result.loanItem.LoanId;
        this.date = new Date();
        }
      }
    });
  }
}
// public loanSearch(): void {
//   const dialogRef = this.dialog.open(LoanSearchComponent, {
//     height: "80%",
//     width: '100%',
//     data:{funid:this.funID}
//   });
//   dialogRef.afterClosed().subscribe(result => {
//     if (!!result) {
//       if (result.loanItem.LoanStatus == 0) {
//         this.displayMessage("Loan Already Closed", "Success");
//       } else {
//       this.getSelectedLoanDetails(result.loanItem);
//       this.loanID = result.loanItem.LoanId;
//       this.date = new Date();
//       }
//     }
//   });
// }
  getReason(element) {
    const dialogRef = this.dialog.open(RemarksReaderComponent, {
      height: "60%",
      width: '80%',
    });
    dialogRef.afterClosed().subscribe(result => {
      
      if (!!result) {
        
         this.FileExte = result.ext,
         this.FileData = result.file,
         this.FileDataType = result.filetype,
         this.FileName = result.filenme
        this.remarkId = Number(result.reasonMasterID);
        this.remarkText = result.reasonText;
        this.SaveCollection(element);
      }
    });
  }
  getSelectedLoanDetails(loanItem: any) {
    this.loanID = loanItem.LoanId;
    this.LoanDate = this.datePipe.transform(loanItem.LoanDate, 'dd/MM/yyyy');
    this.LoanAmount = loanItem.LoanAmount;
    this.customerName = loanItem.CustomerName;
    this.customerID = loanItem.CustomerID;
    this.getReversalData();
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
  SaveCollection(element) {
    
    // const dialogRef = this.dialog.open(ConfirmationPageComponent, {
    //   width: '30%', data: { message: 'Are you sure you want to cancel ', type: 'Alert' }
    // }); dialogRef.afterClosed().subscribe(result => {
    //   if (!!result) {
        // if (result['Confirm'] == true) {
   let param = {
    "loan_id": this.loanID,
    "trans_id": element.transID,
    "attachment": this.FileData,
    "userid":this.userData['empCode'],
    "attachementname": this.FileName,
    "attachemenT_EXT": this.FileExte,
    "attachemenT_TYPE": this.FileDataType,
    "requesteD_NAME":this.userData['employeeName']
   }      
   this.settings.loadingSpinner = true;
 
   this.commonService.docuploadinst(param).subscribe(res=>{
    if (res['status'].code == 1 && res['status'].flag == 1) {
      const params = {
      firmID: this.userData['firmID'],
      branchID: this.userData['branchID'],
      ProductID:  this.userData['productID'],
      LoanID: this.loanID,
      tranS_ID: element.transID,
      TransDate: this._rptdatePipe(element.ReceiptDate),
      TransAmt: element.CollectionAmount,
      EnteredBy: this.userData['empCode'],
      Remark_ID: this.remarkId,
      Remark_Text: this.remarkText
    }
    
    // this.spinner.show();
    this.commonService.saveCollectionReversal(params).subscribe(res => {

      this.settings.loadingSpinner = false;
      this.CollectionList = [];
      this.dataSource = new MatTableDataSource<any>(this.CollectionList);
      this.FileName = ""
      this.FileExte = ""
      this.FileDataType = ""
      this.FileData = ""
      // if (res['status'].code == 1 && res['status'].flag == 1) {
        this.displayMessage(res['outputMessage'], "Success");
      this.getReversalData()
      // } else {
        // this.displayMessage(res['status'].message, "Alert");
      // }

    }, error => {
      this.displayMessage(res['outputMessage'], "Success");
      this.settings.loadingSpinner = false;

    })
  }else{
    this.displayMessage(res['status']['message'], "Alert");
    this.settings.loadingSpinner = false;

  }
   })
         
        // }
    //   }
    // })
  }
  
  displayMessage(message, type) {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%',
        data: { message: message, type: type },
      });
  }
}
