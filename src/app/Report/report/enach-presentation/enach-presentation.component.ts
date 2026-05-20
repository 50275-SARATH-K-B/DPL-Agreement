import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../../services/common/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { EnachService } from '../../../services/report/enach.service';
import { RepaymentService } from '../../../services/report/repayment.service';
export interface Installment {
  LOAN_ID: string;
  DUE_DATE: string;
  INTEREST_AMOUNT: number;
  LATE_FEE: number;
  INSTALLMENT_AMOUNT: number;
  position: number;
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  MandateCode: string;
}

@Component({
  selector: 'app-enach-presentation',
  templateUrl: './enach-presentation.component.html',
  styleUrls: ['./enach-presentation.component.scss']
})
export class EnachPresentationComponent implements OnInit {
  @ViewChild('ref') checkboxRef: ElementRef;
  public field: any = null;
  private userData: any;
  public paymentModeList: Array<object> = [];
  public selectedDatas: Array<object> = [];
  public selection = new SelectionModel<Installment>(true, []);
  public displayedColumns: string[] = ['select', 'MandateCode', 'CUSTOMER_NAME', 'LOAN_ID', 'INSTALLMENT_AMOUNT', 'INTEREST_AMOUNT', 'LATE_FEE', 'DUE_DATE'];
  public installmentList: Installment[] = [];
  public disabled: boolean = false;
  presentationDate: any;  
  public filter: string = "";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<Installment>(this.installmentList);
  due_Date: string;
  pre_date: string;
  resdata: Object;
  //repaymentService: any;
  constructor(private enachService: EnachService,
    private commomService: CommonService, private repaymentService: RepaymentService,
    private dialog: MatDialog,
    private datePipe: DatePipe) { }

  ngOnInit() {
   
    this.userData = this.commomService.getCredentials();
    this.field = {
      dueDate: '',
      presentationDate: '',
      paymentModeID: '',
      paymentMode: ''
    }
    this.getPaymentModes();
    this.field['paymentModeID'] = '92';

  }
  private getPaymentModes(): void {
    this.paymentModeList = [];
    const params = {
      FIRM_ID: this.userData['firmID'],
      PRODUCT_ID: this.userData['productID'],
      flag: 2,

    }
    // this.commomService.getPaymentModeList(params).subscribe(res => {
    //   if (!!res && res['status'].code == 1) {
    //     this.paymentModeList = res['paymentModeList'];
    //     this.field['paymentMode'] = this.paymentModeList.find(x => +x['PaymentModeID'] == +  this.field['paymentModeID'])
    //   }
    // })
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
        console.log(this.paymentModeList)
      }
    })

  }
  public getInstallmentdetailsByDate(presentationForm): void {
    this.installmentList = [];
    this.dataSource = new MatTableDataSource(this.installmentList);
    var params = {
      getDate: this._rptdatePipe(this.field['dueDate'])
    }
    this.enachService.getInstallmentDetailsbyDate(params).subscribe(res => {
      if (!!res && res['status'].code == 1 && res['status'].flag == 1) {
        if (!!res && res['instaProperties'].length > 0) {
          this.installmentList = res['instaProperties'];

          console.log(this.installmentList);
          this.dataSource = new MatTableDataSource(this.installmentList);
          setTimeout(() => { this.dataSource.paginator = this.paginator; }, .3);
        }
      } else {
        this.displayMessage({ message: res['status'].message, type: "Alert" });
        presentationForm.resetForm();
      }
    })
  }
  public isAllSelected() {
    
    const numSelected = this.selection.selected.length;
    // console.log(numSelected)
    const numRows = this.dataSource.data.length;
    // console.log(numRows)
    return numSelected === numRows;
  }

  public masterToggle(ref) {
    console.log(ref)
    if (this.isSomeSelected()) {
      this.selection.clear();
      ref.checked = false;
    } else {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
    this.selectedDatas = this.selection.selected;
  }
  public isSomeSelected() {
    this.selectedDatas = this.selection.selected;
    return this.selection.selected.length > 0;
  }
  public checkboxLabel(row?: Installment): string {
   
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  private displayMessage(params): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: params['message'], type: params['type'] }
    });
  }

  public clear(presentationForm): void {
    presentationForm.resetForm();
    this.selection.clear();
    this.installmentList = [];
    this.dataSource = new MatTableDataSource(this.installmentList);
    this.getPaymentModes();
    setTimeout(() => {
      this.field['paymentModeID'] = '92';
    }, .01);
    this.disabled = false;
    this.selectedDatas = [];
    this.checkboxRef['checked'] = false;

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

  public confirm(data, presentationDate, presentationForm): void {
    
    this.disabled = true;
    const params = {
      amount: data['INSTALLMENT_AMOUNT'] * 100,
      // mandate: 'MD00146HQE1NRH'
      mandate: data['MandateCode']
    }

    sessionStorage.setItem('isENACH', '1');
    this.enachService.submitNachPresentationExternal(params)
      .subscribe(res => {
        if (!!res && res['status'] == 'SUCCESS') {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (this.selectedDatas.length !== 0) {
              this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
            } else {
              this.selection.clear();
              this.selectedDatas = [];
              this.checkboxRef['checked'] = false;
              this.getInstallmentdetailsByDate(presentationForm);
              this.disabled = false;
            }
          })
          // this.saveInternalData(data, res['data'], this.field['presentationDate'], presentationForm);
        } else {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: "NACH presentation failed for Loan ID: " + data['LOAN_ID'], type: "Alert" }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (this.selectedDatas.length !== 0) {
              this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
            } else {
              this.selection.clear();
              this.selectedDatas = [];
              this.checkboxRef['checked'] = false;
              this.getInstallmentdetailsByDate(presentationForm);
              this.disabled = false;
            }
          })
        }
      }, error => {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presentation failed for Loan ID: " + data['LOAN_ID'], type: "Alert" }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (this.selectedDatas.length !== 0) {
            this.confirm(this.selectedDatas.shift(),this.field['presentationDate'], presentationForm)
          } else {
            this.selection.clear();
            this.selectedDatas = [];
            this.checkboxRef['checked'] = false;
            this.getInstallmentdetailsByDate(presentationForm);
            this.disabled = false;
          }
        })
      })
  }
  dueDateChange(event){
    console.log(event.value)
    this.due_Date = this._rptdatePipe(event.value)
    console.log(this.due_Date)
  }

  presDateChange(event){
    console.log(event)
    this.pre_date = this._rptdatePipe(event.value)
    console.log(this.pre_date)
  }

  public saveInternalData(data, res, presentationDate, presentationForm): void {
    let payDtls: string = "";
    var instrumentReference = "0";
    var subledger = 0;
    var instrumentDate = this.due_Date;
    // if (!!this.field['paymentMode']['PaymentModeID']) { payDtls = payDtls + this.field['paymentMode']['PaymentModeID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!this.field['paymentMode']['LedgerID']) { payDtls = payDtls + this.field['paymentMode']['LedgerID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + data['MandateCode'] + "^";
     payDtls = payDtls + 0 + "^";
     payDtls = payDtls + instrumentDate + "^";
    // if (!!subledger) { payDtls = payDtls + subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!data['MandateCode']) { payDtls = payDtls + data['MandateCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!instrumentReference) { payDtls = payDtls + instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!instrumentDate) { payDtls = payDtls + instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['firmID']) { payDtls = payDtls + this.userData['firmID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    payDtls = payDtls + this.userData['branchID']+"^";
    // if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    payDtls = payDtls + this.userData['empCode']+"^";
    const params = {
      CustID: data['CUSTOMER_ID'],
      LoanID: data['LOAN_ID'],
      CollectionAmt: data['INSTALLMENT_AMOUNT'],
      PaymentDtls: payDtls,
      presented_id: this.resdata['id'],
      presented_date: this.pre_date,
      enter_by: this.userData['empCode'],
      sponser_bank: this.resdata['nach_sponsor_bank'] == null ? "" : this.resdata['nach_sponsor_bank'],
      utility_code: this.resdata["nach_utility_code"] == null ? "" : this.resdata["nach_utility_code"],
      // due_date: this.datePipe.transform(new Date(data['DUE_DATE']), 'MM/dd/yyyy'),
      due_date: this.due_Date,
    }
    console.log(params)
    this.enachService.submitNachPresentationInternal(params).subscribe(result => {
      console.log(result)
      if ((result['status'] == "SUCCESS")) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (this.selectedDatas.length !== 0) {
            this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
            
          } else {
            this.selection.clear();
            this.selectedDatas = [];
            this.checkboxRef['checked'] = false;
            this.getInstallmentdetailsByDate(presentationForm);
            this.disabled = false;
          }
        })
      } else {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presentation failed for Loan ID: " + data['LOAN_ID'] + ". Please try again", type: "Alert", presentationData: params }
        });
        dialogRef.afterClosed().subscribe(res =>
           {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
          });
          dialogRef.afterClosed().subscribe(res => {
            if (this.selectedDatas.length !== 0) {
              this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
            } else {
              this.selection.clear();
              this.selectedDatas = [];
              this.checkboxRef['checked'] = false;
              this.getInstallmentdetailsByDate(presentationForm);
              this.disabled = false;
            }
          })
        })
      }
    })
  }
  search() {
    var component = this;
    this.filterSource();
    setTimeout(function () { component.filterSource(); }, 5);
   
  }

  public filterSource(): void {

    this.dataSource.filterPredicate = (data, filter) =>
      (data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
       
        || data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();

  
  }
  }

