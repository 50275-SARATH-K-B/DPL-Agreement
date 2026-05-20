import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-billing-checker-dashboard',
  templateUrl: './billing-checker-dashboard.component.html',
  styleUrls: ['./billing-checker-dashboard.component.css']
})
export class BillingCheckerDashboardComponent implements OnInit {
  apdatas = [];
  applicationDataList = [];
  apdata: any;
  dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = ['slno', 'cin', 'company', 'term'];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getuploadloans()

  }

  getuploadloans() {

    this.apdatas = []
    let params = {
      verified: "Negative"
    }
    this.commonService.billreport(params).subscribe(res => {
      console.log(res)

      this.applicationDataList = res['reportdata']
      this.applicationDataList.forEach((element) => {
        console.log(this.applicationDataList)
        let param = {
          company: element['from_date'],
          name: element['loan_count'],
          term: element['total_installment_amount']
        }
        this.apdatas.push(param)
        this.dataSource = new MatTableDataSource(this.apdatas);
        console.log(this.apdatas)
      })

    }, error => {
    })
  }

  applyFilter(filterValue: any) {
    let a: any = filterValue.target.value
    filterValue = a.trim();
    filterValue = a.toLowerCase();
    this.dataSource.filter = filterValue;
  }


}

