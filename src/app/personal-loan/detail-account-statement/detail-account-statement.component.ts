import { Component, OnInit } from '@angular/core';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ReportService } from '../../services/report/report.service';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-detail-account-statement',
  templateUrl: './detail-account-statement.component.html',
  styleUrls: ['./detail-account-statement.component.scss']
})
export class DetailAccountStatementComponent implements OnInit {
  public settings: Settings;
  constructor(public appSettings: AppSettings, private reportService: ReportService, private dialog: MatDialog) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.resetValues();
  }

  resetValues() {
    this.customerDetals = {
      CustName: undefined, house_name: undefined,
      address_line_2: undefined, address_line_3: undefined, Address_Line_4: undefined,
      Pincode: undefined, MobilePhone: undefined, PrimaryEmail: undefined,
    }
    this.displayFlag = undefined;
    this.disbursementList = this.collateralList = this.loanDtlList = [];
    this.accountStmtList = this.accountStmtDtlList = this.loanInstDtlList = [];

  }


  getDetailAccountStmt(){


  }


  customerDetals: any;
  disbursementList: any;
  disbursementTotal: any;
  loanDtlList: any;
  collateralList: any;
  accountStmtList: any;
  accountStmtDtlList: any;
  loanInstDtlList: any;
  totalInstPaidAmt: any;
  totalLoanSctionAmount: any;
  totalPendingInstAmt: any;
  totalLateFee: any;
  transactionDebitTotal: any;
  transactionCreditTotal: any;
  transactionTotalBalance: any;
  loanTransactionDebitTotal: any;
  loanTransactionCreditTotal: any;
  loanTransactionTotalBalance: any;
  getLoanDetails(loanID) {
    this.resetValues();
    this.settings.loadingSpinner = true;
    this.reportService.getAccountStatementReport({ loanID: loanID })
      .subscribe(result => {
        this.settings.loadingSpinner = false;
        if (result['status'].code == 1) {
          this.displayFlag = 1;
          this.customerDetals = result['customerDataList'][0];
          this.disbursementList = result['disbursementList'];
          this.disbursementTotal = this.disbursementList.reduce((accum, curr) => +(accum + curr.DisbursedAmount), 0);
          this.collateralList = result['collateralList'];
          this.loanDtlList = result['loanDtlList'];
          this.totalLoanSctionAmount = this.loanDtlList.reduce((accum, curr) => +(accum + curr.ApprovedAmount), 0);
          this.totalInstPaidAmt = this.loanDtlList.reduce((accum, curr) => +(accum + curr.InstPaidAmt), 0);
          this.totalPendingInstAmt = this.loanDtlList.reduce((accum, curr) => +(accum + curr.PendingInstAmt), 0);
          this.accountStmtList = result['accountStmtList'];
          this.transactionDebitTotal = this.accountStmtList.reduce((accum, curr) => +(accum + curr.Debit), 0);
          this.transactionCreditTotal = this.accountStmtList.reduce((accum, curr) => +(accum + curr.Credit), 0);
          this.transactionTotalBalance = this.accountStmtList.reduce((accum, curr) => +(accum + curr.Balance), 0);
          this.accountStmtDtlList = result['accountStmtDtlList'];
          this.loanTransactionDebitTotal = this.accountStmtDtlList.reduce((accum, curr) => +(accum + curr.Debit), 0);
          this.loanTransactionCreditTotal = this.accountStmtDtlList.reduce((accum, curr) => +(accum + curr.Credit), 0);
          this.loanTransactionTotalBalance = this.accountStmtDtlList.reduce((accum, curr) => +(accum + curr.Balance), 0);
          this.loanInstDtlList = result['loanInstDtlList'];

          this.totalLateFee = this.loanInstDtlList.reduce((accum, curr) => +(accum + curr.LateFee), 0);
        } else {
          this.displayMesage(result['status'].message, "Alert");
        }
      }, err => {
        console.log(err);
        this.settings.loadingSpinner = false;
      })
  }



  print(displayFlag) {

    // if (+displayFlag != 0) {
    //   let date = new Date();
    //   let issueDate = (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) + '/' + ((date.getMonth() + 1) > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) + '/' + date.getFullYear()
    //   var doc = new jspdf();
    //   let table_id;
    //   doc.setFontSize(22);
    //   doc.text('Loan Statement', 80, 16);
    //   doc.autoTable({
    //     html: '#customer-details',
    //     tableWidth: '80%',
    //     styles: { cellPadding: 0.4, fontSize: 8, border: 0, margin: 130, halign: 'left', headStyles: { fillColor: 20 } },
    //     margin: { top: 90 },
    //     bodyStyles: {
    //       lineColor: [0, 0, 0, 0]
    //     },
    //     startY: 20,
    //     theme: 'grid'
    //   });
    //   doc.setFontSize(11);
    //   doc.text(`Issue Date: ${issueDate}`, 150, 25);
    //   if (+displayFlag == 1) {
    //     table_id = "loan-details";
    //     doc = this.setHeaderLine(doc, { headerName: 'Loan Details', tableID: table_id });
    //     doc.setFontSize(11);
    //     doc.setTextColor('#000000');
    //     doc.text(`Total Loan Sanction Amount: ${this.totalLoanSctionAmount}`, 100, doc.autoTable.previous.finalY + 5);
    //     doc.text(`Total Disbursed Amount. / Amount: 0.00`, 100, doc.autoTable.previous.finalY + 10);
    //     doc.text(`Total Installment Paid No. / Amount: ${this.totalInstPaidAmt}`, 100, doc.autoTable.previous.finalY + 15);
    //     doc.text(`Total Installment Pending No. / Amount: ${this.totalPendingInstAmt}`, 100, doc.autoTable.previous.finalY + 20);
    //   } else if (+displayFlag == 2) {
    //     table_id = "installment-details";
    //     doc = this.setHeaderLine(doc, { headerName: 'Installment Details', tableID: table_id });
    //   } else if (+displayFlag == 3) {
    //     table_id = "colateral-details";
    //     doc = this.setHeaderLine(doc, { headerName: 'Colateral Details', tableID: table_id });
    //   } else if (+displayFlag == 4) {
    //     table_id = "disbursement-details";
    //     doc = this.setHeaderLine(doc, { headerName: 'Disbursement Details', tableID: table_id });
    //   } else if (+displayFlag == 5) {
    //     table_id = "transaction-summary";
    //     doc = this.setHeaderLine(doc, { headerName: 'Transaction Summary', tableID: table_id });
    //   } else if (+displayFlag == 6) {
    //     table_id = "loan-transaction";
    //     doc = this.setHeaderLine(doc, { headerName: 'Loan Transaction Details', tableID: table_id });
    //   } else if (+displayFlag == 7) {
    //     table_id = "unrealized-details";
    //     doc = this.setHeaderLine(doc, { headerName: 'Unrealized Receipts Details', tableID: table_id });
    //   } else {

    //   }
    //   doc.save(`${table_id}.pdf`);
    // } else {
    //   this.accountStatementPrint()
    // }
  }

  accountStatementPrint() {

  }

  setHeaderLine(doc: any, header: object) {
    doc.setFillColor('#00695c');
    doc.rect(10, doc.autoTable.previous.finalY + 10, 190, 5, 'F');
    doc.setTextColor('#fafafa');
    doc.text(header['headerName'], 15, doc.autoTable.previous.finalY + 14);
    doc.autoTable({
      html: '#' + header['tableID'],
      tableWidth: '80%',
      styles: { cellPadding: 0.4, fontSize: 8, border: 1, margin: 130, halign: 'center', headStyles: { fillColor: 20 } },
      margin: { top: 20 },
      startY: doc.autoTable.previous.finalY + 20,
      theme: 'grid'
    });

    return doc;
  }
  displayFlag: any;
  onDisplay(ID) { this.displayFlag = +ID; }


  loanID: any;
  onClear() {
    this.loanID = undefined;
    this.resetValues();
  }

  displayMesage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: "30%",
      data: { message: message, type: type }
    });
  }

}
