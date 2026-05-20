import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-billing-checker-report',
  templateUrl: './billing-checker-report.component.html',
  styleUrls: ['./billing-checker-report.component.css']
})
export class BillingCheckerReportComponent implements OnInit {

  apdatas = [];
  applicationDataList = [];
  apdata: any;
  dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = ['slno', 'billdate', 'cin', 'count', 'emiamnt', 'intamnt', 'prinamnt', 'debtor', 'accntamnt', 'receiveamnt', 'different', 'company', 'term', 'status', 'reason', 'description'];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getuploadloans()

  }

  getuploadloans() {

    this.apdatas = []
    let params = {
      status_id: "1"
    }
    this.commonService.billmainreport(params).subscribe(res => {
      console.log(res)

      this.applicationDataList = res['extreportdata']
      this.applicationDataList.forEach((element) => {
        console.log(this.applicationDataList)
        let param = {

          Billed_Date: element['froM_DATE'],
          Verification_Date: this.datePipe.transform(element['verifieD_DATE'], 'dd/MM/yyyy'),
          Total_Billed_Loan_Count_in_LMS: element['loan_count'],
          Total_Billed_EMI_Amt_in_LMS: element['total_installment_amount'],
          Total_Billed_Int_Amt_in_LMS: element['total_interest_amount'],
          Total_Billed_Prin_Amt_in_LMS: element['total_principal_amount'],
          Account_Total_Billed_Debtors_Amt: element['total_loan_debtor'],
          Account_Total_Billed_Loan_Account_Amt: element['total_loan_control'],
          Account_Total_Billed_Interest_Received_Amt: element['total_interest_received'],
          Different_Amount_LMS_AND_Account: element['difference'],
          Emp_Code: element['emP_CODE'],
          Emp_Name: element['emP_NAME'],
          Status: element['verified'],
          Reason: element['verifieD_REASON'],
          Remarks: element['remarks']
        }
        this.apdatas.push(param)
        this.dataSource = new MatTableDataSource(this.apdatas);
        console.log(this.apdatas)
      })

    }, error => {
    })
  }

  ExportExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.apdatas);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Billing Checker Report' + ".xlsx");
  }

  

  applyFilter(filterValue: any) {
    let a: any = filterValue.target.value
    filterValue = a.trim();
    filterValue = a.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  remarkview(element) {
    const dialogRef = this.dialog.open(DescriptionComponent, {
      height: "50%",
      width: '50%',
      data: element
    });
  }

}

@Component({
  selector: 'app-remarkks-views',
  templateUrl: './description.html',
})

export class DescriptionComponent implements OnInit {
  remake: any;
  constructor(public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any) { }
  ngOnInit(): void {
    console.log(this.data)
    this.remake = this.data['Remarks']

  }

}
