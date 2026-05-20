import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/report/common.service';

@Component({
  selector: 'app-loan-account-status-dashboard',
  templateUrl: './loan-account-status-dashboard.component.html',
  styleUrls: ['./loan-account-status-dashboard.component.scss']
})
export class LoanAccountStatusDashboardComponent implements OnInit {
  fromDate:any;
  toDate:any;
  selected2:any;
  dashboardData:any;
  public dashboardsource = new MatTableDataSource([]);
  displayedColumns: any[] =['slno','custid','custname','loanId','deathdate','status'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public commonService:CommonService,public datePipe:DatePipe,public dialog: MatDialog,
    public router: Router,public route:ActivatedRoute) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dashboardsource.paginator = this.paginator;
  }

  getDashboardDetails(){

    let params = {
      "fromDATE": this.datePipe.transform(this.fromDate,'dd/MM/yyyy'),
      "toDate": this.datePipe.transform(this.toDate,'dd/MM/yyyy')
    }

    this.commonService.getloanAccountDashboard(params).subscribe(res=> {
      console.log(res)
      this.dashboardData = res['dashboardlist']

      this.dashboardsource = new MatTableDataSource(this.dashboardData)
      this.dashboardsource.paginator = this.paginator;

    })
  }

  radioChange2(event){
console.log(event)
  }

}
