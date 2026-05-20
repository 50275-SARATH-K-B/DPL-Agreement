import { Component, OnInit, ViewChild, ElementRef,Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonService } from '../../../services/common/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { EnachService } from '../../../services/report/enach.service';
import { RepaymentService } from '../../../services/report/repayment.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

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
  selector: 'app-enachpres',
  templateUrl: './enachpres.component.html',
  styleUrls: ['./enachpres.component.scss']
})
export class EnachpresComponent implements OnInit {
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
  resdata: any=[];
  customerdata:any=[];
  params2:any=[];
  failedlist: any=[];
  successlist: any=[];
  datalist: any=[];
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
    this.datalist = []
    this.failedlist= []
    this.successlist = []
    this.customerdata = []
    this.selectedDatas = []
    this.resdata = []
    this.params2 = []
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
    this.datalist = data;
    this.datalist.forEach(element => {
      const params = {
        amount: element['INSTALLMENT_AMOUNT'] * 100,
        // mandate: 'MD00146HQE1NRH'
        mandate: element['MandateCode']
      }
      sessionStorage.setItem('isENACH', '1');

       this.enachService.submitNachPresentationExternal(params)
        .subscribe( res => {
  let val=  res;
          if (!!val && val['status'] == 'SUCCESS') {
            let customerdata = val['data']
      this.customerdata.push(customerdata);
      let succcesslist = element;
  this.successlist.push(succcesslist)
  // let accountData = this.datalist.find(s => s.MandateCode == element['MandateCode']);
  this.datalist.shift()
      }else{
        let failedlist = element;
        this.failedlist.push(failedlist)
        this.datalist.shift()

      } 
      if(this.datalist.length==0){
        this.saveInternalData(this.successlist, this.customerdata, presentationDate, presentationForm)

      }
    })
     
      // const params = {
      //   amount: element['INSTALLMENT_AMOUNT'] * 100,
      //   // mandate: 'MD00146HQE1NRH'
      //   mandate: element['MandateCode']
      // }
      // localStorage.setItem('isENACH', '1');
      // this.enachService.submitNachPresentationExternal(params)
      //   .subscribe( res => {
      //     let val=  res;
      //     if (!!val && val['status'] == 'SUCCESS') {
      //       let customerdata = val['data']
      // this.customerdata.push(customerdata);
      //     let succcesslist = element;
      // this.successlist.push(succcesslist)
      // this
      //     }else{
      //       let failedlist = element;
      //       this.failedlist.push(failedlist)
      //     } 
      //   })
    // this.successlist.push(element)

    });


    
    
    // let datad ={
    //  amount: 272400,
    //  charge_date: null,
    //  created: 1647941797,
    //  customer: "CU0061WEDUG17E",
    //  failure_code: null,
    //  failure_message: null,
    //  id: "122222",
    //  livemode: true,
    //  mandate: "MD0080DXWNVW4T",
    //  metadata: null,
    //  nach_sponsor_bank: null,
    //  nach_utility_code: null, 
    //  object: "ach_debit",
    //  sequence_number: null,
    //  status: "pending",
    //  umrn: "SBIN7022207210006903"
    // }
    // let datad1 ={
    //   amount: 272400,
    //   charge_date: null,
    //   created: 1647941797,
    //   customer: "CU0061WEDUG17E",
    //   failure_code: null,
    //   failure_message: null,
    //   id: "123333",
    //   livemode: true,
    //   mandate: "MD0080DXWNVWty",
    //   metadata: null,
    //   nach_sponsor_bank: null,
    //   nach_utility_code: null, 
    //   object: "ach_debit",
    //   sequence_number: null,
    //   status: "pending",
    //   umrn: "SBIN7022207210006903"
    //  }
    //  let datad3 ={
    //   amount: 272400,
    //   charge_date: null,
    //   created: 1647941797,
    //   customer: "CU0061WEDUG17E",
    //   failure_code: null,
    //   failure_message: null,
    //   id: "1445555",
    //   livemode: true,
    //   mandate: "33333333333333",
    //   metadata: null,
    //   nach_sponsor_bank: null,
    //   nach_utility_code: null, 
    //   object: "ach_debit",
    //   sequence_number: null,
    //   status: "pending",
    //   umrn: "SBIN7022207210006903"
    //  }
    //  let datad4 ={
    //   amount: 272400,
    //   charge_date: null,
    //   created: 1647941797,
    //   customer: "CU0061WEDUG17E",
    //   failure_code: null,
    //   failure_message: null,
    //   id: "1277777777",
    //   livemode: true,
    //   mandate: "44444444444",
    //   metadata: null,
    //   nach_sponsor_bank: null,
    //   nach_utility_code: null, 
    //   object: "ach_debit",
    //   sequence_number: null,
    //   status: "pending",
    //   umrn: "SBIN7022207210006903"
    //  }
    // this.customerdata.push(datad)
    // this.customerdata.push(datad1)
    // this.customerdata.push(datad3)
    // this.customerdata.push(datad4)
    // console.log(this.customerdata)
    //  this.saveInternalData(data, this.customerdata, presentationDate, presentationForm)

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
    console.log(data)
    console.log(res)
    this.resdata = res;
    let payDtls: string = "";
    var instrumentReference = "0";
    var subledger = 0;
    var instrumentDate = this.due_Date;

    data.forEach(element1 => {
    // if (!!this.field['paymentMode']['PaymentModeID']) { payDtls = payDtls + this.field['paymentMode']['PaymentModeID'] + "^"; } else {  }
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + element1['MandateCode'] + "^";
    payDtls = payDtls + 0 + "^";
    payDtls = payDtls + instrumentDate + "^";
    payDtls = payDtls + this.userData['firmID'] + "^";
    payDtls = payDtls + this.userData['branchID']+ "^";
    payDtls = payDtls + this.userData['empCode']+ "^";
    // if (!!this.field['paymentMode']['LedgerID']) { payDtls = payDtls + this.field['paymentMode']['LedgerID'] + "^"; } else {  }
    
    // if (!!subledger) { payDtls = payDtls + subledger + "^"; } else {  }
    // if (!!element1['stateid']) { } else { payDtls = payDtls + 0 + "^"; }
    // if (!!instrumentReference) { payDtls = payDtls + instrumentReference + "^"; } else {  }
    // if (!!instrumentDate) {  } else { payDtls = payDtls + 0 + "^"; }
    // if (!!this.userData['firmID']) { + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!this.userData['branchID']) {  + "^"; } else { payDtls = payDtls + 0 + "^"; }
    // if (!!this.userData['empCode']) {  + "^"; } else { payDtls = payDtls + 0 + "^"; }
    
      const params = {
        mandate:element1['MandateCode'],
        CustID: element1['CUSTOMER_ID'],
        LoanID: element1['LOAN_ID'],
        CollectionAmt: element1['INSTALLMENT_AMOUNT'],
        PaymentDtls: payDtls,
        presented_id: undefined,
        presented_date: this.pre_date,
        enter_by: this.userData['empCode'],
        sponser_bank: res['nach_sponsor_bank'] == null ? "" : res['nach_sponsor_bank'],
        utility_code: res["nach_utility_code"] == null ? "" : res["nach_utility_code"],
        // due_date: this.datePipe.transform(new Date(data['DUE_DATE']), 'MM/dd/yyyy'),
        due_date: this.due_Date,
      }
       this.params2.push(params)
       payDtls=""


    });
    // let datad = {
    //   CollectionAmt: 2547,
    //   CustID: "01630010737342",
    //   LoanID: "13690",
    //   PaymentDtls: "0^0^0^MD0022QKISJCQD^0^22/MAR/2022^1^3038^21721^",
    //   due_date: "22/MAR/2022",
    //   enter_by: "21721",
    //   mandate: "MD0080DXWNVW4T",
    //   presented_date: "22/MAR/2022",
    //   presented_id: undefined,
    //   sponser_bank: "",
    //   utility_code: ""
    // }
    // let datad1 = {
    //   CollectionAmt: 2547,
    //   CustID: "01630010737342",
    //   LoanID: "13690",
    //   PaymentDtls: "0^0^0^MD0022QKISJCQD^0^22/MAR/2022^1^3038^21721^",
    //   due_date: "22/MAR/2022",
    //   enter_by: "21721",
    //   mandate: "MD0080DXWNVWty",
    //   presented_date: "22/MAR/2022",
    //   presented_id: undefined,
    //   sponser_bank: "",
    //   utility_code: ""
    // }
    // let datad2 = {
    //   CollectionAmt: 2547,
    //   CustID: "01630010737342",
    //   LoanID: "13690",
    //   PaymentDtls: "0^0^0^MD0022QKISJCQD^0^22/MAR/2022^1^3038^21721^",
    //   due_date: "22/MAR/2022",
    //   enter_by: "21721",
    //   mandate: "33333333333333",
    //   presented_date: "22/MAR/2022",
    //   presented_id: undefined,
    //   sponser_bank: "",
    //   utility_code: ""
    // }
    // let datad3 = {
    //   CollectionAmt: 2547,
    //   CustID: "01630010737342",
    //   LoanID: "13690",
    //   PaymentDtls: "0^0^0^MD0022QKISJCQD^0^22/MAR/2022^1^3038^21721^",
    //   due_date: "22/MAR/2022",
    //   enter_by: "21721",
    //   mandate: "44444444444",
    //   presented_date: "22/MAR/2022",
    //   presented_id: undefined,
    //   sponser_bank: "",
    //   utility_code: ""
    // }
    // this.params2.push(datad)
    // this.params2.push(datad1)
    // this.params2.push(datad2)
    // this.params2.push(datad3)

    
    setTimeout(() => {
    for(let i=0;i<this.params2.length;i++){
      console.log(this.params2[i])
      
      let accountData = this.resdata.find(s => s.mandate == this.params2[i]['mandate']);
      this.params2[i].presented_id = accountData.id;
      console.log(accountData)
    }
     
      console.log(this.params2)

    }, 3000);
    
    console.log(this.params2)

    
    

    // this.enachService.submitNachPresentationInternal(params).subscribe(result => {
    //   debugger;
    //   console.log(result)
    //   if ((result['status'] == "SUCCESS")) {
    //     const dialogRef = this.dialog.open(AlertMessageComponenent, {
    //       width: '30%',
    //       data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
    //     });
    //     dialogRef.afterClosed().subscribe(res => {
    //       if (this.selectedDatas.length !== 0) {
    //         this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
            
    //       } else {
    //         this.selection.clear();
    //         this.selectedDatas = [];
    //         this.checkboxRef['checked'] = false;
    //         this.getInstallmentdetailsByDate(presentationForm);
    //         this.disabled = false;
    //       }
    //     })
    //   } else {
    //     const dialogRef = this.dialog.open(AlertMessageComponenent, {
    //       width: '30%',
    //       data: { message: "NACH presentation failed for Loan ID: " + data['LOAN_ID'] + ". Please try again", type: "Alert", presentationData: params }
    //     });
    //     dialogRef.afterClosed().subscribe(res =>
    //        {
    //       const dialogRef = this.dialog.open(AlertMessageComponenent, {
    //         width: '30%',
    //         data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
    //       });
    //       dialogRef.afterClosed().subscribe(res => {
    //         if (this.selectedDatas.length !== 0) {
    //           this.confirm(this.selectedDatas.shift(), this.field['presentationDate'], presentationForm)
    //         } else {
    //           this.selection.clear();
    //           this.selectedDatas = [];
    //           this.checkboxRef['checked'] = false;
    //           this.getInstallmentdetailsByDate(presentationForm);
    //           this.disabled = false;
    //         }
    //       })
    //     })
    //   }
    // })
  }
  search() {
    var component = this;
    this.filterSource();
    setTimeout(function () { component.filterSource(); }, 5);
   
  }

  public filterSource(): void {

    this.dataSource.filterPredicate = (data, filter) =>
      (data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.applicationId.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.productName.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        // || data.statusDescr.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
        || data.LOAN_ID.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();

    // if (this.dataSource.filteredData.length == 0) {
    //   this.dataSource = new MatTableDataSource<any>(temp);
    //   this.dataSource.paginator = this.paginator;
    //   if (this.showNoApplicationIdFlag) {
    //     this.showNoApplicationIdFlag = false;
    //     const dialogRef = this._dialog.open(AlertMessageComponenent, {
    //       width: '30%',
    //       data: { message: "No Data Found", type: 'Alert' }
    //     });

    //   }
    // }
    // }
  }
  }
  