import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
export interface collectionElement {
  LoanNo: any;
  CollectionAmount: any;
  BranchID: any;
  BranchName: any;
  TraDate: any;
}
const colloectionDatas: collectionElement[] = [];
@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.scss']
})
export class CollectionDetailsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private route: ActivatedRoute, private dashboardService: DashBoardService) {
    this.route.params.subscribe((params: Params) => {
      if (!!params && !!params['branchID'] && !!params['from_date'] && !!params['to_date']) {
        this.searchByBranchID({ BRANCH_ID: +params['branchID'], FROM_DATE: this._rptdatePipe(params['from_date']), TO_DATE: this._rptdatePipe(params['to_date']) });

      } else {

      }
    });
  }
  colloectionDatas: any;
  dataSource = new MatTableDataSource<collectionElement>(colloectionDatas);
  displayedColumns: string[] = ['branchID', 'branchName', 'loanNo', 'TraDate', "collectionAmount"]

  ngOnInit() {
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

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  total: any = 0.00;
  searchByBranchID(params) {
    this.dashboardService.getcollectionByBranchID(params)
      .subscribe(result => {
        if (result['status'].code == 1 && result['collectionDataDtls']) {
          result['collectionDataDtls'].forEach(element => {
            element['TraDate'] = this._datePipe(new Date(element['TraDate']));
          });
          this.dataSource = new MatTableDataSource<collectionElement>(result['collectionDataDtls']);
          this.total = this.dataSource.filteredData.reduce((accum, curr) => +(accum + curr.CollectionAmount), 0);
          this.dataSource.paginator = this.paginator;
        }
      })
  }
  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

}
