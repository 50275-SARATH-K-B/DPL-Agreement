import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../services/report/common.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-billing-checker',
  templateUrl: './billing-checker.component.html',
  styleUrls: ['./billing-checker.component.css']
})
export class BillingCheckerComponent implements OnInit {
  employeeCode: any;
  searchText: any;
  billcount: any;
  emiamnt: any;
  intamnt: any;
  prinamnt: any;
  billdebt: any;
  loanamnt: any;
  receiveamnt: any;
  lmsaccont: any;
  verified: any;
  negative: any;
  remark: any;
  letterdate: any;
  credit: any;
  today = new Date()
  applicationDataList = []
  apdata: any;
  ListData = []
  remarks: any;
  userData: any;
  certificatearray = [];
  certificateList = [];
  DuesArray = [];
  dataSource = new MatTableDataSource<any>([]);
  selectedOption: string = '';
  options: string[] = ['Positive', 'Negative'];
  hidess: boolean = false;
  // isDateDisabled: boolean;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userData = this.commonService.getCredentials();

  }

  loanSearch() {
    this.billcount = ""
    this.emiamnt = ""
    this.intamnt = ""
    this.prinamnt = ""
    this.billdebt = ""
    this.loanamnt = ""
    this.receiveamnt = ""
    this.lmsaccont = ""
    this.verified = ""
    this.negative = ""
    this.remark = ""
    this.DuesArray = []
    this.certificatearray = []
    this.hidess = false

    let params = {
      "from_date": this.datePipe.transform(this.credit, 'MM/dd/yyyy'),
      "empcode": this.userData['empCode']
    }
    console.log(params)
    this.commonService.excelbill(params).subscribe(res => {
      console.log(res)
      if (res['status'].flag == 1 && res['status'].code == 1) {
        this.DuesArray = res['chargeProperties']

        this.DuesArray.forEach(element => {
          console.log(element)
          let para = {
            LOAN_ID: element['loan_id'],
            TRANSACTION_ID: element['trans_id'],
            PRODUCT_NAME: element['product_name'],
            BILLING_DATE: this.datePipe.transform(element['due_date'], 'dd/MM/yyyy'),
            INTEREST_AMOUNT: element['interest_amount'],
            PRINCIPLE_AMOUNT: element['principal_amount'],
            INSTALLMENT: element['installment_amount'],
            // TOTAL_INSTALLMENT: element['total_installment'],
            INTEREST_RECEIVED: element['interest_received'],
            LOAN_CONTROL: element['loan_control'],
            LOAN_DEBTORS: element['loan_debtor'],
            // TOTAL: element['total'],
            DIFFERENCE: element['difference']

          }
          this.certificatearray.push(para)
        });
        this.dataSource = new MatTableDataSource<any>(this.certificatearray);

        console.log(this.certificatearray)
      } else {
        this.displayMessage(res['status'].message, "Alert");
      }
    })
    // this.isDateDisabled = true;
    this.getTotalData()
  }


  ExportExcel() {
    if (this.DuesArray.length > 0) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.certificatearray);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Billing Checker Report.xlsx');
    } else {
      this.displayMessage("No Data Found", "Alert");
    }
  }

  changedata() {
    console.log(this.verified)
    if (this.verified === 'Negative' || this.verified == undefined || this.verified == "") {
      this.hidess = true;
      this.remark = ""
    } else {
      this.hidess = false;
      this.remark = ""
    }
  }


  getTotalData() {
    this.ListData = []
    let params = {
      "from_date": this.datePipe.transform(this.credit, 'MM/dd/yyyy'),
      "empcode" : this.userData['empCode']
    }
    console.log(params)
    this.commonService.totalbill(params).subscribe(res => {
      console.log(res)

      this.applicationDataList = res['totalbillingprp']
      console.log(this.applicationDataList)

      this.billcount = this.applicationDataList[0]['loan_count'],
        this.emiamnt = this.applicationDataList[0]['total_installment_amount'],
        this.intamnt = this.applicationDataList[0]['total_interest_amount'],
        this.prinamnt = this.applicationDataList[0]['total_principal_amount'],
        this.billdebt = this.applicationDataList[0]['total_loan_debtor'],
        this.loanamnt = this.applicationDataList[0]['total_loan_control'],
        this.receiveamnt = this.applicationDataList[0]['total_interest_received'],
        this.lmsaccont = this.applicationDataList[0]['difference']

    }, error => {
    })
  }

  confirm() {

    let para = {

      "fromdate": this.datePipe.transform(this.credit, 'dd/MM/yyyy'),
      "loan_count": this.billcount,
      "total_installment_amount": this.emiamnt,
      "total_interest_amount": this.intamnt,
      "total_principal_amount": this.prinamnt,
      "total_interest_received": this.receiveamnt,
      "total_loan_debtor": this.billdebt,
      "total_loan_control": this.loanamnt,
      "difference": this.lmsaccont,
      "verified": this.verified,
      "verified_Reason": this.negative,
      "remarks": this.remark,
      "empcode": this.userData['empCode'],
      "emp_name": this.userData['employeeName']
    }

    this.commonService.confirmbill(para).subscribe(res => {
      console.log(res)

      if (res['status']['flag'] === 1 && res['status']['code'] === 1) {
        this.displayMessage(res['status'].message, "Success");
        this.clear()
      } else {
        this.displayMessage(res['status'].message, "Alert");
        this.clear()
      }
    }, error => {
    })
  }

  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: type }
    });
  }

  clear() {
    this.credit = ""
    this.DuesArray = []
    this.certificatearray = []
    this.billcount = ""
    this.emiamnt = ""
    this.intamnt = ""
    this.prinamnt = ""
    this.billdebt = ""
    this.loanamnt = ""
    this.receiveamnt = ""
    this.lmsaccont = ""
    this.verified = ""
    this.negative = ""
    this.remark = ""
    this.hidess = false
    // this.isDateDisabled = false;

  }

}
