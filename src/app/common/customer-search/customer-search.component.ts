import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../services/common/common.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';
export interface customerDataElement {
  CustId: string;
  name: string;
  FathHusName: string;
  HouseName: string;
  Locality: string;
  PostOffice: string;
  PINCode: string;
  Phone1: string;
  Phone2: string;
  Share: string;
  Action: string;
}


@Component({
  selector: 'app-customer-search',
  templateUrl: './customer-search.component.html',
  styleUrls: ['./customer-search.component.scss']
})
export class CustomerSearchComponent implements OnInit {
  displayedColumns: string[] = ["cust_Id", "name", "guardianName", "Phone", "Email"];
  public customerList: customerDataElement[] = [];
  dataSource = new MatTableDataSource<customerDataElement>(this.customerList);
  public customerSearchItem: string;
  public customerId: string;
  public customerName: string;
  public panNo: string;
  public kyc: string;
  public phone: string;
  constructor(private commonService: CommonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public router: Router,
    public dialogRef: MatDialogRef<CustomerSearchComponent>,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.customerSearchItem = "5";

  }
  public keyDownFunction(event, searchForm): void {
    if (event.keyCode == 13) {
      this.getSearchResults(searchForm);
    }
  }
  public getSearchResults(searchForm) {
    if (searchForm.valid) {
      let searchValue;
      if (+this.customerSearchItem == 1) {
        searchValue = this.customerId;
        this.customerName = undefined;
        this.panNo = undefined;
        this.kyc = undefined;
        this.phone = undefined;
      } else if (+this.customerSearchItem == 2) {
        searchValue = this.customerName;
        this.customerId = undefined;
        this.panNo = undefined;
        this.kyc = undefined;
        this.phone = undefined;
      } else if (+this.customerSearchItem == 3) {
        searchValue = this.panNo;
        this.customerId = undefined;
        this.customerName = undefined;
        this.kyc = undefined;
        this.phone = undefined;
      } else if (+this.customerSearchItem == 4) {
        searchValue = this.kyc;
        this.customerId = undefined;
        this.customerName = undefined;
        this.panNo = undefined;
        this.phone = undefined;
      } else {
        searchValue = this.phone;
        this.customerId = undefined;
        this.customerName = undefined;
        this.panNo = undefined;
        this.phone = undefined;
      }
      const params = {
        optionId: +this.customerSearchItem,
        searchValue: searchValue
      }
      this.dataSource = new MatTableDataSource<customerDataElement>([]);
      this.commonService.searchCustomerDetails(params)
        .subscribe(res => {
          if (!!res && res['status'].code == 1) {
            if (res['customerDataList'] !== null) {
              this.customerList = res['customerDataList'];
              this.dataSource = new MatTableDataSource<customerDataElement>(this.customerList);
            } else {
              this.displayMessage({ type: "Alert", message: "The requested customer doesn't exist" });
            }
          } else {
            this.displayMessage({ type: "Alert", message: res['status'].message });
          }
        });
    }
  }
  private displayMessage(params): void {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: params
    });
  }
  public onRowClick(selectedCustomer): void {
    if (!!selectedCustomer) {
      this.dialogRef.close(selectedCustomer);
    }
  }
  public gotoCustomer(): void {
    if (!!this.data && !!this.data['applicationId']) {
      this.dialogRef.close();
      this.router.navigate(['/customer/add-modify-customer', { applicationID: this.data['applicationId'] }]);

    } else {
      this.dialogRef.close();
      this.router.navigate(['/customer/add-modify-customer']);

    }
  }
  public clear(searchForm): void {
    searchForm.resetForm();
    this.customerList = [];
    this.dataSource = new MatTableDataSource<customerDataElement>(this.customerList);
    this.customerSearchItem = '5';
  }

}

























