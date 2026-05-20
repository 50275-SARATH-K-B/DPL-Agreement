import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { environment } from '../../environments/environment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonService } from '../services/report/common.service';


@Component({
  selector: 'app-reasonsearch',
  templateUrl: './reasonsearch.component.html',
  styleUrls: ['./reasonsearch.component.scss']
})
export class ReasonsearchComponent implements OnInit {

  searchText: any;
  displayedColumns: any[] =
    [
      'Code',
      'Description',
    ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  waiverArray: any[];
  userData: any;
  filter: string;
  sort: any;
  public highlightedRows: Array<object> = [];
  ReasonId: any;
  constructor(public dialogRef: MatDialogRef<ReasonsearchComponent>, private commonService: CommonService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ReasonsearchComponent) { }

  ngOnInit(): void {
    this.userData = this.commonService.getCredentials();
    if(this.data['value'] == 30){
      this.ReasonId = 7
    } else {
      this.ReasonId = 5
    }
    const param = {
      "FIRM_ID": this.userData['firmID'],
      "PRODUCT_ID": this.userData['productID'],
      "ReasonId": this.ReasonId,
    }
   
    this.commonService.reason(param).subscribe(res => {
      // let appsearch=res["message"]
     
      if (res['status'].code == "1" && res['status'].flag == "1") {
        this.dataSource = new MatTableDataSource<any>(res['reasonlist'])
      }
      })
  }
  getLoanDetails(e) {
    e.LoanId;
    if (!!e) {
      this.highlightedRows = [];
      this.highlightedRows.push(e);
    }
  }
  doubleClick(e) {
    if (!!e) {
      this.highlightedRows = [];
      this.highlightedRows.push(e);
    }
    this.onConfirm();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  onConfirm(): void {
    this.dialogRef.close(this.highlightedRows[0]);
  }


  onDismiss(): void {
    this.dialogRef.close(false);
  }

  showNoApplicationIdFlag: boolean = false;
  search() {
    var component = this;
    this.showNoApplicationIdFlag = true;
    this.filterSource();
  }
  public filterSource(): void {
    this.dataSource.filterPredicate = (data, filter) =>
    (data.reason_code.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
      || data.reason_name.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();

    if (this.dataSource.filteredData.length == 0) {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.showNoApplicationIdFlag) {
        this.showNoApplicationIdFlag = false;
        this.filter = "";
        this.DisplayMessage( "No Data Found", "Alert")
      }
    }

  }
  
}
