import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/master/user.service';
import { MatTableDataSource, MatDialogRef } from '@angular/material';
export interface userElement {
  EmpName: string;
  EmpCode: string;
  ContactNo: any;
  EmailID: any;
}
@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss']
})

export class UserSearchComponent implements OnInit {
  private userData: object;
  public displayedColumns: string[] = ['EmpName', 'EmpCode', 'ContactNo', 'EmailID'];
  public userList: userElement[] = [];
  public highlightedRows: Array<object> = [];
  public filter: string = "";
  public dataSource = new MatTableDataSource<userElement>(this.userList);
  constructor(private userService: UserService,
    private dialogRef: MatDialogRef<UserSearchComponent>) { }

  ngOnInit() {
    this.userData = this.userService.getCredentials();
    this.getUserData();
  }

  public getUserData() {
    const params = {
      flag: 2,
      FIRM_ID: this.userData['firmID'],
      PRODUCT_ID :this.userData['productID']
    }
    this.userService.getUserData(params).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['userList'] !== null && res['userList'].length > 0) {
          this.userList = res['userList'];
          this.dataSource = new MatTableDataSource(this.userList);
        }
      }
    })
  }
  public onRowClick(row): void {
    if (!!row) {
      this.highlightedRows = [];
      this.highlightedRows.push(row);

    }
  }
  public confirm(): void {
    this.dialogRef.close(this.highlightedRows[0]);
  }
  public filterSource(): void {
    this.dataSource = new MatTableDataSource(this.userList);
    this.dataSource.filterPredicate = (data, filter) =>
      (data.EmpCode.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1||data.EmpName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();
    // }
  }

}
