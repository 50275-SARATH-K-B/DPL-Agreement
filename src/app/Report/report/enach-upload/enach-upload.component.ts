
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MatDialog, MatTableDataSource, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RepaymentService } from '../../../services/LMS/repayment.service';
import { CommonService } from '../../../services/common/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { EnachService } from '../../../services/report/enach.service';
import { PopupremarkComponent } from '../../../popupremark/popupremark.component';
import { SelectionModel } from '@angular/cdk/collections';

export interface enachElement {
  // "SlNo": any;
  "MandateID": any;
  "CustomerName": any;
  "LoanID": any;
  "InstallmentAmount": any;
  "InterestAmount": any;
  "TransactionType": any;
  "LateFee": any;
  "DueDate": any;
}
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
  selector: 'app-enach-upload',
  templateUrl: './enach-upload.component.html',
  styleUrls: ['./enach-upload.component.scss']
})
export class EnachUploadComponent implements OnInit {
  @ViewChild('document')

  myInputVariable: ElementRef;

  datesdata: any = new Date();
  userData: any;
  date: any;
  value_date: Date;
  phonenoList: any;
  enachSource: any;
  file: any;
  arrayBuffer: any;
  filelist: any[];
  visible: boolean = false;
  public settings: Settings;
  public disabled: boolean = false;
  public selection = new SelectionModel<Installment>(true, []);


  displayedColumns: string[] = ["SlNo", "MandateID", "CustomerName", "LoanID", "Customerid", "InstallmentAmount", "TransactionType", "DueDate", "PresentationDate"];
  successlist: any[] = [];
  failedlist: any[] = [];

  constructor(private repaymentService: RepaymentService,
    private enachService: EnachService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datepipe: DatePipe,
    public appSettings: AppSettings,) {
    this.settings = this.appSettings.settings;

  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

  }
  exportexcel(id): void {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload' + new Date().toLocaleDateString() + ".xlsx");

  }
  getDatePipe(date) {
    let fullDate = new Date(date);
    let month = fullDate.getMonth() + 1;
    return (month > 9 ? month : ('0' + month)) + '-' + fullDate.getDate() + '-' + fullDate.getFullYear();
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
    return date.getDate() + '/' + months[date.getMonth() + 1] + '/' + date.getFullYear();
  }

  public clear(followupForm) {
    this.failedlist = []
    this.successlist = []
    this.disabled = false
    this.myInputVariable.nativeElement.value = "";
    followupForm.resetForm();
    this.phonenoList = [];
    this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
    this.visible = false
  }
  public deleteTableItem(data): void {
    this.phonenoList.splice(data.index, 1);
    this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
  }

  trandformDate(dateString) {
    var date = new Date(dateString);
    return new Date(date.setDate(date.getDate() + 1));
  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
  checkdatasave() {
    this.dialog.open(duplicationcheck, {
      width: "90%",
      height: "90%",
      disableClose: true,
      data: { success: this.phonenoList }
    })
  }

  addfile(event) {

    this.phonenoList = [];
    this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
    this.file = event.target.files[0];
    let extension = this.file.name.split('.');
    extension = extension[extension['length'] - 1]
    console.log(extension)
    if (extension == 'xlsx') {
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        var data = new Uint8Array(this.arrayBuffer);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        console.log(bstr)
        console.log(arr)
        var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //  console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
        this.phonenoList = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        let stringArray = [];
        var i = 1;
        console.log(this.phonenoList)
        this.phonenoList.forEach(element => {

          let phObj = {

            "mandateid": element.MandateID,
            "customerName": element.CustomerName,
            "loanid": element.LoanID,
            "installmentamount": element.InstallmentAmount,
            "Customerid": element.CustomerId,
            "transactiontype": element.TransactionType,
            "duedate": this._rptdatePipe(this.trandformDate(element.DueDate)),
            "PresentationDate": this._rptdatePipe(this.trandformDate(element.PresentationDate)),
            "remarks":""
          }

          stringArray.push(phObj);
          console.log(stringArray)
        });
        var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.filelist = [];
        //  console.log(this.filelist)    
        this.phonenoList = stringArray;
        this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
        this.visible = true;

      }
    } else {
      this.displayMessage("Please Upload File in Excel Format", "Alert")
    }
  }


}
@Component({
  templateUrl: './StatusReport.html',
  styleUrls: ['./enach-upload.component.scss']
})


export class EnachdialogReport implements OnInit {
  CountSuccess: any;
  SuccessAmountTotal: number = 0;
  CountFailed: any;
  countnotinsert: any
  FailedAmountTotal: number = 0;
  countinsert: number;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialog: MatDialogRef<EnachdialogReport>) { }
  displayedColumnsSuccess = ["SlNo", "MandateID", "CustomerName", "LoanID", "Customerid", "InstallmentAmount", "TransactionType", "DueDate", "PresentationDate","remarks"];

  // displayedColumnsFailed = ["CustId","LoanId","CollectionAmt","EnterBY","EnterDate","instrumentReference","RecieptNo","LoanAccNo","PaymentMode","RecieptPurpose","BounceCancelReason","BounceCancelDate","Remarks","DepositDate","TransactionDate","AccNo"];
  SuccessDataSource = new MatTableDataSource<any>();
  FailedDataSource = new MatTableDataSource<any>();
  notinsertedsource = new MatTableDataSource<any>();
  insertedsource = new MatTableDataSource<any>();

  successDataList: any = [];
  failedDataList: any = [];
  notinsertdata: any = [];
  insertdata:any[]=[]
  ngOnInit() {
    console.log(this.data['success'])
    if (!!this.data['success']) {

      this.failedDataList = this.data['failed']
      this.successDataList = this.data['success']
      this.notinsertdata = this.data['notinsert']
      this.insertdata = this.data['insert']
      if (this.successDataList) {
        this.CountSuccess = this.successDataList.length;


        this.SuccessDataSource = new MatTableDataSource<any>(this.successDataList);

      }
      if (this.failedDataList) {

        this.CountFailed = this.failedDataList.length;


        this.FailedDataSource = new MatTableDataSource<any>(this.failedDataList);
      }
      if (this.notinsertdata) {
        this.countnotinsert = this.notinsertdata.length;


        this.notinsertedsource = new MatTableDataSource<any>(this.notinsertdata);
      }
      if(this.insertdata){
        this.countinsert = this.insertdata.length;


        this.insertedsource = new MatTableDataSource<any>(this.insertdata);
      }
    }
  }

  close() {
    this.dialog.close()

  }
  insertedexcel(id){
       /* table id is passed over here */
       let element = document.getElementById(id);
       const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
   
       /* generate workbook and add the worksheet */
       const wb: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
   
       /* save to file */
       XLSX.writeFile(wb, 'Enach__notinserted' + new Date().toLocaleDateString() + ".xlsx"); 
  }
  notinsertedexcel(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach__notinserted' + new Date().toLocaleDateString() + ".xlsx");
  }
  failedExportExcel(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload_failed' + new Date().toLocaleDateString() + ".xlsx");
  }
  succExportExcel(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload_succ' + new Date().toLocaleDateString() + ".xlsx");
  }
}
@Component({
  templateUrl: './duplicationpopup.html',
  styleUrls: ['./enach-upload.component.scss']
})


export class duplicationcheck implements OnInit {
  CountSuccess: any;
  SuccessAmountTotal: number = 0;
  CountFailed: any;
  FailedAmountTotal: number = 0;
  resub: boolean = false;
  public selection = new SelectionModel<Installment>(true, []);
  userData: any;
  duplicationfinal: any;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private repaymentService: RepaymentService, private commomService: CommonService, private dialogg: MatDialog, public appSettings: AppSettings, private enachService: EnachService) {
    this.settings = this.appSettings.settings;

  }
  displayedColumnsSuccess = ["SlNo", "MandateID", "CustomerName", "LoanID", "Customerid", "InstallmentAmount", "TransactionType", "DueDate", "PresentationDate"];
  displayedColumnsdupli = ["select","actions","Advanceemi", "SlNo", "MandateID", "CustomerName", "LoanID", "Customerid", "InstallmentAmount", "TransactionType","first_submissiondte", "DueDate", "PresentationDate","remarks"];
  // displayedColumnsFailed = ["CustId","LoanId","CollectionAmt","EnterBY","EnterDate","instrumentReference","RecieptNo","LoanAccNo","PaymentMode","RecieptPurpose","BounceCancelReason","BounceCancelDate","Remarks","DepositDate","TransactionDate","AccNo"];
  SuccessDataSource = new MatTableDataSource<any>();
  FailedDataSource = new MatTableDataSource<any>();
  successDataList: any = [];
  failedDataList: any = [];
  successlist: any[] = [];
  failedlist: any[] = [];
  notinserteddata: any[] = [];
  inserteddata:any[]=[]
  duplicationlist: any[] = [];
  enachlist: any[] = []
  phonenoList: any;
  enachSource: any;
  duplicationSource: any;
  public selectedDatas:any[]= [];
  @ViewChild('ref') checkboxRef: ElementRef;
  remarks:any
  visible: boolean = false;
  public settings: Settings;
  public disabled: boolean = false;
  instrumentDate: any;

  ngOnInit() {
    this.userData = this.commomService.getCredentials();

    this.resub = false
    console.log(this.data['success'])
    if (!!this.data['success']) {
      this.phonenoList = this.data['success'];
      this.enachlist = this.data['success'];
      this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
      this.duplicationlist = []
      this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);
 }
  }
  removfunc(selected){
  
  let dd = this.duplicationlist.findIndex(s=>s.mandateid == selected['mandateid'])
  this.duplicationlist.splice(dd,1)
  this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);


  }
  fieldenachchange(remark,mandid){
    
  for(let i=0;i<this.duplicationlist.length;i++){
    if(this.duplicationlist[i].mandateid == mandid){
      this.duplicationlist[i]['remarks'] = remark
    }
  }
  }
  Duplicationcheck() {

    this.duplicationlist = []
    this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);
    this.duplicationfinal = []
    this.enachlist = []
    let list = []
    list = this.data['success'];
    this.enachSource = new MatTableDataSource<enachElement>(this.enachlist);
    // this.duplicationSource = new MatTableDataSource<enachElement>(this.enachlist);

    
    list.forEach(element => {

      let params = {
        "mandate": element.mandateid
      }

      this.enachService.duplicationcheck(params).subscribe(res => {
        this.settings.loadingSpinner = true;

        if (res['dataList'].length == 0) {
          // this.enachlist = []
          this.enachlist.push(element)
          this.enachSource = new MatTableDataSource<enachElement>(this.enachlist);
          
        } else {
          let dd = this.duplicationlist.find(s=>s.mandateid == element.mandateid)
          if(!!dd){
           

          }else{
            element['first_submissiondate'] = this._rptdatePipe(res['dataList'][0]['first_submissiondate'])
            this.duplicationlist.push(element)
            this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);
          }
  
          if (this.duplicationlist.length > 0) {
            this.resub = true
      
          } else {
            this.resub = false
      
          }
        }
        
        if(list.length == this.enachlist.length + this.duplicationlist.length){
          this.settings.loadingSpinner = false;
     
         }
      }
      , error => {
        this.settings.loadingSpinner = false;

      }
      )

    })
    
   


  }
  
  resubfunc(data){
    this.settings.loadingSpinner = true;
    let dd = this.selectedDatas.find(p=>p.remarks == "")
    
    // if(!dd){
    //   this.displayMessage("Please Fill out all the Selected Remarks fields", "Alert")

    //   this.settings.loadingSpinner = false;
    // }else{

      this.successlist = []
      this.failedlist = []
      let remark = this.selectedDatas.find(p=>p.remarks !== "")
      if(!remark ){
         this.displayMessage("Please Fill out at least one remark", "Alert")
         this.settings.loadingSpinner = false;

      }else{
        this.selectedDatas.forEach(s=>{

          let InstAmount = s.installmentamount;
          let MandId = s.mandateid;
          let remarkss = remark.remarks
          let duedate = this._rptdatePipe(s.duedate)
          let loan_id = s.loanid
          console.log(InstAmount)
          console.log(MandId)
          console.log(this.phonenoList)
          const enachDataUploadFormData = {
            amount: Math.floor(InstAmount * 100),
            // mandate: 'MD00146HQE1NRH'
            mandate: MandId
          }
          this.settings.loadingSpinner = true;
          sessionStorage.setItem('isENACH', '1');
          this.enachService.submitNachPresentationExternal(enachDataUploadFormData)
            .subscribe(result => {
              if (!!result && result['status'] == 'SUCCESS') {
                
                this.settings.loadingSpinner = false;
  
    
                let dd = []
                dd.push({
                  amount: InstAmount,
                  // mandate: 'MD00146HQE1NRH'
                  mandate: MandId,
                  paymenttype: "Resubmission",
                  remarks : remarkss,
                  due_date:duedate,
                  loan_id:loan_id
  
                })
    
                const insertesdata = {
                  "userid": this.userData['empCode'],
    
                  'EnachDuplica': dd,
    
                }
                console.log(insertesdata)
                this.enachService.submitenachdatainsertion(insertesdata).subscribe(res => {
                  if (res['status'].code == 1 && res['status'].flag == 1) {
                    
                    this.settings.loadingSpinner = false;
  
                    let dp = this.duplicationlist.findIndex(ss=>ss.mandateid == s.mandateid)
                    this.duplicationlist.splice(dp,1)
                    let bp = this.selectedDatas.findIndex(ss=>ss.mandateid == s.mandateid)
  
                    this.selectedDatas.splice(bp,1)
                    this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);
                    // this.displayMessage('Enach Resubmitted Successfully', 'Success');
  
                    let insert = s
                    this.inserteddata.push(insert)
                    this.successlist.push(insert)
  
  
                  } else {
                    let notinsert = s;
                    this.notinserteddata.push(notinsert)
                    // this.displayMessage('Please sent this MandateId', 'Success');
                    this.settings.loadingSpinner = false;
  
                  }
    
                }, error => {
                  let notinsert = s;
                  this.notinserteddata.push(notinsert)
                  this.settings.loadingSpinner = false;
  
                }
                )
    
    
              } else {
                let failedlist = s;
                this.failedlist.push(failedlist)
              this.settings.loadingSpinner = false;
  
              //  this.displayMessage('Please Present this MandateID Again', 'Alert');
  
                // console.log(this.failedlist)
              }
            }, error => {
              this.settings.loadingSpinner = false;
  
              // this.displayMessage('Please Present this MandateID Again', 'Alert');
  
              let failedlist = s;
              this.failedlist.push(failedlist)
  
            }
            )
          })
          
      this.disabled = true;
      // if(this.selectedDatas.length == 0){
        this.selection.clear()
        // this.selectedDatas = []
        let vard = this.phonenoList.length
        let time = vard * 1000
        let onet = time / 6
        console.log(time)
        setTimeout(() => {
    
    
           const dialogrefd = this.dialogg.open(EnachdialogReport, {
            width: "90%",
            height: "90%",
            disableClose: true,
            data: { success: this.successlist, failed: this.failedlist, notinsert: this.notinserteddata,insert:this.inserteddata }
          })
          dialogrefd.afterClosed().subscribe(res => {
       
            
          })
          this.settings.loadingSpinner = false;
    
        }, onet);
      }
      
  // }
     
    // }
    


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
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }


  advanceemi(element){
          let custid = element.Customerid
          let loanid = element.loanid
          let amtrcvd = element.installmentamount
          let mandid = element.mandateid
          let remarkss = element.remarks
          let duedate = this._rptdatePipe(element.duedate)
          
        let payDtls: string = "";
  
        this.instrumentDate = this._rptdatePipe(new Date());
  
      if (!!this.instrumentDate) { payDtls = payDtls+"1^33000^0^0^" + this.instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
      if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
       const params = {
        CustID: custid,
        LoanID: loanid,
        CollectionAmt: amtrcvd,
        PaymentDtls: payDtls,
        "Valuedt": this._rptdatePipe(new Date())
      }
      this.settings.loadingSpinner = true
      console.log(this.userData)
      console.log(params)
  
       this.repaymentService.Collection(params).subscribe(res => {
        if (!!res && res['status'].code !== 1) {
          let dp = this.duplicationlist.findIndex(ss=>ss.mandateid == element.mandateid)
          this.duplicationlist.splice(dp,1)
          this.duplicationSource = new MatTableDataSource<enachElement>(this.duplicationlist);
         
          
  
          let dd = []
          dd.push({
            amount: amtrcvd,
            // mandate: 'MD00146HQE1NRH'
            mandate: mandid,
            paymenttype: "Advance EMI",
            remarks : remarkss,
            due_date:duedate,
            loan_id:loanid

          })
  
          const insertesdata = {
            "userid": this.userData['empCode'],
  
            'EnachDuplica': dd,
  
          }
          console.log(insertesdata)
          this.enachService.submitenachdatainsertion(insertesdata).subscribe(res => {
            if (res['status'].code == 1 && res['status'].flag == 1) {

              
              this.settings.loadingSpinner = false

              this.displayMessage('Saved Successfully', 'Success');

            } else {
              this.settings.loadingSpinner = false

              this.displayMessage('Advance EMI Paid, Please share the Loan ID/Mandate ID to developer to insert into table (TBL_ENACH_presentation) ', 'Alert');

            }
  
          }, error => {
            this.settings.loadingSpinner = false
            this.displayMessage('Advance EMI Paid, Please share the Loan ID/Mandate ID to developer to insert into table (TBL_ENACH_presentation) ', 'Alert');

          }
          )
  
        }
        else {
          this.settings.loadingSpinner = false

          this.displayMessage(res['status'].message, 'Alert');

        }
      }, error => { 
        this.settings.loadingSpinner = false

        this.displayMessage("failed", 'Alert');
       }
        )
      
  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialogg.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
  savedata() {
    this.settings.loadingSpinner = true;

    this.successlist = []
    this.failedlist = []
    this.enachlist.forEach(s => {

      let InstAmount = s.installmentamount;
      let MandId = s.mandateid;
      let duedate = this._rptdatePipe(s.duedate)
      let loan_id = s.loanid

      console.log(InstAmount)
      console.log(MandId)
      console.log(this.phonenoList)
      const enachDataUploadFormData = {
        amount: Math.floor(InstAmount * 100),
        // mandate: 'MD00146HQE1NRH'
        mandate: MandId
      }
      this.settings.loadingSpinner = true;
      sessionStorage.setItem('isENACH', '1');
      this.enachService.submitNachPresentationExternal(enachDataUploadFormData)
        .subscribe(result => {
          if (!!result && result['status'] == 'SUCCESS') {
            let succcesslist = s;
            this.successlist.push(succcesslist)

            let dd = []
            dd.push({
              amount: InstAmount,
              // mandate: 'MD00146HQE1NRH'
              mandate: MandId,
              paymenttype: "Initial Enach presentation",
              remarks : "",
              due_date:duedate,
              loan_id:loan_id

            })

            const insertesdata = {
              "userid": this.userData['empCode'],

              'EnachDuplica': dd,

            }
            console.log(insertesdata)
            this.enachService.submitenachdatainsertion(insertesdata).subscribe(res => {
              if (res['status'].code == 1 && res['status'].flag == 1) {
              
              } else {
                let notinsert = s;
                this.notinserteddata.push(notinsert)
              }

            }, error => {
              let notinsert = s;
              this.notinserteddata.push(notinsert)
            }
            )
            console.log(succcesslist)


          } else {
            let failedlist = s;
            this.failedlist.push(failedlist)
            console.log(this.failedlist)
          }
        }, error => {
          let failedlist = s;
          this.failedlist.push(failedlist)
        }
        )
    })
    this.disabled = true;

    let vard = this.phonenoList.length
    let time = vard * 1000
    let onet = time / 6
    console.log(time)
    setTimeout(() => {


      this.dialogg.open(EnachdialogReport, {
        width: "90%",
        height: "90%",
        disableClose: true,
        data: { success: this.successlist, failed: this.failedlist, notinsert: this.notinserteddata }
      })
      this.settings.loadingSpinner = false;

    }, onet);



  }

  public isAllSelected() {

    const numSelected = this.selection.selected.length;
    // console.log(numSelected)
    const numRows = this.duplicationSource.data.length;
    // console.log(numRows)
    if(!!numSelected){
      
    }

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
        this.duplicationSource.filteredData.forEach(row => this.selection.select(row));
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
  close() {
    this.dialogg.closeAll()
  }
  failedExportExcel(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload_failed' + new Date().toLocaleDateString() + ".xlsx");
  }
  succExportExcel(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload_succ' + new Date().toLocaleDateString() + ".xlsx");
  }
}


