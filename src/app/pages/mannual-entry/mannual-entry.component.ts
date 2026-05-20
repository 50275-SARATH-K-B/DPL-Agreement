import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

export interface accountElement {
  BranchID: string;
  BranchName: string;
  LoanCount: string; 
  CollectionAmount: string;
}
const accountDatas: accountElement[] = [];
@Component({
  selector: 'app-mannual-entry',
  templateUrl: './mannual-entry.component.html',
  styleUrls: ['./mannual-entry.component.scss']
})
export class MannualEntryComponent implements OnInit {
  custData: object;
  accountData: object;
  constructor() { }
  displayedColumns: string[] = ['accountName', 'description', 'amount', 'type'];
  dataSource = new MatTableDataSource<accountElement>(accountDatas);
  ngOnInit() {
    this.custData = {
      customerID: undefined, customerName: undefined, loanID: undefined, loanAmount: undefined, loanDate: undefined,
    }
    this.accountData = { accountName: undefined, decription: undefined, Amount: undefined, type: undefined }
  }

  filterDate(date) {
    const month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = (new Date(date)).getDate();
    const month_index = (new Date(date)).getMonth();
    const year = (new Date(date)).getFullYear();
    return day + "-" + month_names[month_index] + "-" + year;
  }
}
