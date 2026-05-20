import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common/common.service';
import { UserService } from '../../services/master/user.service';
import { SelectionModel } from '@angular/cdk/collections';
export interface dataElement {
  TypeID: number;
  TypeName: string;
  TableName: string;
  ValueField: string;
  DisplayField: string;
  Position: number;
}
@Component({
  selector: 'app-user-link-search',
  templateUrl: './user-link-search.component.html',
  styleUrls: ['./user-link-search.component.scss']
})
export class UserLinkSearchComponent implements OnInit {

  private userData: object;
  public displayedColumns: string[] = ['select', 'DisplayField'];
  public dataList: dataElement[] = [];
  public filter: string = "";
  public dataSource = new MatTableDataSource<dataElement>(this.dataList);
  selection = new SelectionModel<dataElement>(true, []);
  constructor(private commonService: CommonService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserLinkSearchComponent>) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getData();
  }

  public getData() {
    if (!!this.data) {
      const params = {
        TYPE_ID: this.data['TypeID'],
        TABLE_NAME: this.data['TableName'],
        DISPLAY_FIELD: this.data['DisplayField'],
        VALUE_FIELD: this.data['ValueField'],
        FIRM_ID: this.userData['firmID'],
        PRODUCT_ID: this.userData['productID']
      }
      this.userService.getUserTypeLinkDetails(params).subscribe(res => {
        if (!!res && res['status'].code == 1) {
          if (res['typeList'] !== null && res['typeList'].length > 0) {
            res['typeList'].forEach((element, index) => {
              element['Position'] = index + 1;
              element['TypeName'] = this.data['TypeName'];
              element['TypeID'] = this.data['TypeID'];
              this.dataList.push(element);
            });
            this.dataSource = new MatTableDataSource<dataElement>(this.dataList);
          }
        }
      })
    }
  }
  public confirm(): void {
    if (this.selection.selected.length > 0) {
      this.dialogRef.close(this.selection.selected);
    }
  }
  public filterSource(): void {
    this.dataSource = new MatTableDataSource(this.dataList);
    this.dataSource.filterPredicate = (data, filter) =>
      (data.DisplayField.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();
  }
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: dataElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.Position + 1}`;
  }

}
