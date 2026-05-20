import { Component, OnInit } from '@angular/core';
import { ConfirmationPageComponent } from '../confirmation-page/confirmation-page.component';
import { RejectapprComponent } from '../rejectappr/rejectappr.component';
import { CommonService } from '../services/report/common.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';

@Component({
  selector: 'app-collappr',
  templateUrl: './collappr.component.html',
  styleUrls: ['./collappr.component.scss']
})
export class CollapprComponent implements OnInit {

  datesdata: any = new Date();
  CollectionList: any[];
  loanID: any;
  LoanDate: string;
  LoanAmount: any;
  customerName: any;
  customerID: any;
  displayedColumns: string[] = ['Slno', 'LoanID', 'transID', 'CollectionAmount', 'instrument_reference_no', 'receipt_number', 'payment_mode', 'remarks', 'Actions'];
  dataSource: any;
  userData: any;
  CancelStatus: any;
  remarkId: any;
  remarkText: any;
  mes: any;
  date: any;
  Name: any;
  EmpCode: any;
  public filter: string = "";
  public settings: Settings;

  applicationDatasTemp: any;
  


  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,

    
    private datePipe: DatePipe,public appSettings: AppSettings) { 
      this.settings = this.appSettings.settings;

    }
    ngOnInit() {
      this.userData = this.commonService.getCredentials();
      this.commonService.session2()

      this.dataSource = new MatTableDataSource<any>(this.CollectionList);
      this.date = new Date();
      this.getReversalData()
  
    }
  
    getReversalData() {

      this.CollectionList = []
      const params = {
        FIRM_ID: this.userData['firmID'],
        Product_ID: 69,
        BRANCH_ID: this.userData['branchID'],
        UserId: this.userData['empCode'],
        FunctionID: 754,
      }
      this.commonService.getCollRequestData(params).subscribe(res => {
        this.CollectionList = [];
       if (res['status'].code == 1 && res['status'].flag == 1) {

        if(res['collReqDataList'].length>0 ){

          this.CollectionList = res['collReqDataList'];
          this.dataSource = new MatTableDataSource<any>(this.CollectionList);
          this.EmpCode = this.userData['empCode']
          this.Name = this.userData['employeeName']
        }else{
       

          this.displayMessage('No Data Found', "Alert");
          this.CollectionList = [];
          this.dataSource = new MatTableDataSource<any>(this.CollectionList);

        }
    
        }else{

          this.displayMessage(res['status']['message'], "Alert");
          this.CollectionList = [];
          this.dataSource = new MatTableDataSource<any>(this.CollectionList);
        }

      
  
      }, error => {

       })
    }
    public loanSearch(): void {
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          if (result.loanItem.LoanStatus == 0) {
            this.displayMessage("Loan Already Closed", "Success");
          } else {
            this.getSelectedLoanDetails(result.loanItem);
          }
        }
      });
    }
    getSelectedLoanDetails(loanItem: any) {
      this.loanID = loanItem.LoanId;
      this.LoanDate = this.datePipe.transform(loanItem.LoanDate, 'dd/MM/yyyy');
      this.LoanAmount = loanItem.LoanAmount;
      this.customerName = loanItem.CustomerName;
      this.customerID = loanItem.CustomerID;
      this.getReversalData();
    }

  
    SaveCollection(element, ApproveFlag) {
    
      const dialogRef1 = this.dialog.open(RejectapprComponent, {
        height: "60%",
        width: '85%',
        data: { data: element,approvalflag:ApproveFlag,trans:element.transID,lnid:element.LoanID}
  
      });
      dialogRef1.afterClosed().subscribe(result => {
        if (!!result) {

          console.log(result);
          this.remarkId = "";
          this.remarkText = "";
          if (ApproveFlag == 1) {
            this.mes = "Are you sure you want to Approve the Cancellation"
          }
          else {
            this.mes = "Are you sure you want to Reject the Cancellation"
          }
          const dialogRef = this.dialog.open(ConfirmationPageComponent, {
            width: '30%',
            data: { message: this.mes, type: 'Alert' }
          }); dialogRef.afterClosed().subscribe(result => {
            if (!!result) {
              if (result['Confirm'] == true) {
                this.settings.loadingSpinner = true;

                const params = {
                  firmID: this.userData['firmID'],
                  branchID: this.userData['branchID'],
                  ProductID: 69,
                  LoanID: element.LoanID,
                  ReqID: +element.RequestID,
                  ApproveStatus: +ApproveFlag,
                  EnteredBy: this.userData['empCode'],
                  approveD_REMARK_ID: "0",
                  Approved_remark_text: ""
                }
                this.commonService.CollReversalApproval(params).subscribe(res => {
                  if (res['status'].code == 1 && res['status'].flag == 1) {
                    this.settings.loadingSpinner = false;

                    this.displayMessage('Cancelled successfully', "Success");

                    setTimeout(() => {
                      this.getReversalData();
                    }, 2000);
                    // this.CollectionList.splice()
                  } else {
                    this.settings.loadingSpinner = false;

                    this.displayMessage(res['status'].message, "Success");
                  }
                }, error => {
                  this.settings.loadingSpinner = false;

                })
              }
            }
          })
        }
      });
  
  
  
    }
    public filterSource(filterValue:any) {
      // if (this.filter !== "") {
          let a: any = filterValue.target.value
          filterValue = a.trim(); // Remove whitespace
          filterValue = a.toLowerCase(); // MatTableDataSource defaults to lowercase matches
          this.dataSource.filter = filterValue;
        }
    
    displayMessage(message, type) {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%', data: { message: message, type: type }
      });
    }

}
