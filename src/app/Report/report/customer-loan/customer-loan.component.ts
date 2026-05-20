import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DashBoardService } from '../../../services/dashboard/dash-board.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
export interface customerElement {
  BranchID: any;
  CustomerID: any;
  CustomerName: any;
  LoanAmount: any;
  MaxPreApprovedAmt: any;
  MaxROI: any;
  MaxTenure: any;
}
const customerDatas: customerElement[] = [];
@Component({
  selector: 'app-customer-loan',
  templateUrl: './customer-loan.component.html',
  styleUrls: ['./customer-loan.component.scss']
})
export class CustomerLoanComponent implements OnInit {
  branchID: any;
  displayedColumns: string[] = ['branchID', 'CustID', 'custName', 'approvedAmount', 'tenure', 'roi', 'LoanAmount'];
  dataSource = new MatTableDataSource<customerElement>(customerDatas);
  constructor(private route: ActivatedRoute,@Inject(MAT_DIALOG_DATA) private data: any, private dashBoardService: DashBoardService, private dialog: MatDialog, ) {
    // this.route.params.subscribe((params: Params) => {
    //   if (!!params && !!params['branchID']) {
    //     this.searchbranchId(+params['branchID']);
    //   } else {
    //     this.searchbranchId()
    //   }
    // });
  }

  ngOnInit() {
    if(!!this.data&&!!this.data['branchID']){
       this.searchbranchId(+this.data['branchID']);

    }
  }


  searchbranchId(value?: any) {

    this.dashBoardService.getCustomerList({ BRANCH_ID: value })
      .subscribe(result => {
        if (result['status'].code == 1) {
          this.dataSource = result['customerList']
        } else {
          this.displayMessage(result['status'].message, "Alert")
        }
      })

  }




  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: 'auto',
      data: { message: message, type: type }
    });
  }
}
