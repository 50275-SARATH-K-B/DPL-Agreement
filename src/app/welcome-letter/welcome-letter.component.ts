import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LoanSearchComponent } from './../common/loan-search/loan-search.component';
import { CommonService } from './../services/report/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertMessageComponenent } from './../commoncomponents/alertpopup/alertpopup.component';
import { Settings } from './../app.settings.model';
import { RepaymentService } from './../services/report/repayment.service';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { ReportService } from '../services/report/report.service';

(window as any).html2canvas = html2canvas;
@Component({
  selector: 'app-welcome-letter',
  templateUrl: './welcome-letter.component.html',
  styleUrls: ['./welcome-letter.component.scss']
})
export class WelcomeLetterComponent implements OnInit {
  public settings: Settings;
  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;

  userData: any;
  date2: Date;
  funID: any;
  LoanId: any;
  waiverListDetail: any[];
  Active = false;
  LosLettterActive: boolean;
  name: any;
  addressline1: any;
  today = new Date()
  father: any;
  HouseName: any;
  AddressLine2: any;
  Pincode: any;
  loandate2:any;
  loanamount: any;
  custid: any;
  loandate3: any;
  interest: any;
  tenure: any;
  emiamt: any;
  emidate: any;
  prcosfee: any;
  firstemidate: any;
  phone: any;
  AddressLine1: any;
  AddressLine3: any;
  AddressLine4: any;
  post: any;
  pin: any;
  state: any;
  loandmark: any;
  popup:boolean = true




  constructor( private _reportsService: ReportService,private repaymentService: RepaymentService,public Activatedroute:ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,private commonService: CommonService,public route: ActivatedRoute,public service:RepaymentService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
 let res2 ="05/27/2019 00:00:00"
 let datee = this._rptdatePipe(res2)
 console.log(datee)
    this.date2 = new Date();
    if(!!this.data['funid']){
      this.LoanId = this.data['funid']
      this.popup = false
      this.getSelectedLoanDetails(this.data['funid']);

    }else{
    this.popup = true
    }
   
 
    // this.displayLoanSearchPopup();
  }
  getloanid(custid){

  }
  loandetailssearch(){
    this.getSelectedLoanDetails(this.LoanId);
    

  }
  // displayLoanSearchPopup(){
  //   this.clearDataSource()
  //   const dialogRef = this.dialog.open(LoanSearchComponent, {
  //     height: "80%",
  //     width: '75%',
  //     // data: { settled: true,dataKey:"",loanID:""}
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!!result) {
  //       this.LoanId = result.loanItem.LoanId;
  //     }    });
  // }
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
  customerdata(LoanId){
    this.prcosfee = ""
    this.name = ""
    this.father = ""
    this.HouseName = ""
    this.AddressLine1 = ""
    this.AddressLine2 = ""
    this.loanamount = ""
    this.AddressLine3 = ""
    this.Pincode = ""
    this.loandate3 = ""
    this.interest = ""
    this.tenure = ""
    this.emiamt =""
    this.emidate = ""
    this.firstemidate = ""
    this.AddressLine4 = ""
    this.phone = ""
    this.post = ""
    this.state = ""
    this.pin = ""
    this.loandmark = ""
    const params = {
      FirmID: 1,
      LoanNo: LoanId
    }
    this.service.getCustDetail(params).subscribe(res =>{
      console.log(res)
      if(!!res['customerDtlsList'][0]){
        this.Active = true;
        this.loanamount = res['customerDtlsList'][0]["LoanAmount"]
        let d  = this.loanamount * 4 /100
        let k = (this.loanamount * 4 /100)* 18 /100
        this.name = res['customerDtlsList'][0]['Name'];
        this.father = res['customerDtlsList'][0]['father'];
        this.HouseName = res['customerDtlsList'][0]['HouseName'];
        this.AddressLine2 = res['customerDtlsList'][0]['AddressLine2'];
        this.Pincode = res['customerDtlsList'][0]['Pincode'];
        this.loandate3 = this._rptdatePipe(res['customerDtlsList'][0]['LoanDate'])
        this.interest = res['customerDtlsList'][0]['InterestRate']
        this.tenure = res['customerDtlsList'][0]['Tenure']

        let param = {
          "LoanID": LoanId,
          "TypeID": 1
        }

        this.service.getLoanDetailsCollection(param).subscribe(res=>{
        this.emiamt = res['loanDetailsList'][0]['NextInstallment']
        this.emidate = res['loanDetailsList'][0]['DueDate']
        })

        const params = {
          FirmID: 1,
          LoanNo: LoanId,
          AccountNo: 37220,
          FromDt: this._rptdatePipe(this.loandate3),
          ToDt: this._rptdatePipe(new Date()),
        }
    
        this._reportsService.getAccountStatement(params)
          .subscribe((res) => {
            if (!!res && res['status'].code == 1) {
              if(!!res['accountStmtList'][1]){
                this.firstemidate = res['accountStmtList'][1]['Tradt']

              }
            } else {
            }
          })
 
      }
      let params = {
        "LoanID" : LoanId
        } 
        
        this.commonService.Camreport(params).subscribe((result:any)=>{
          this.AddressLine1 = result['addressList'][0]['Address'].split(',')[0]
          this.AddressLine2 = result['addressList'][0]['HouseName']
          this.AddressLine3 = result['addressList'][0]['District']
          this.prcosfee = result['loanList'][0]['ProcessFee']+ (result['loanList'][0]['ProcessFee'])* 18 /100

          this.loandmark = result['addressList'][0]['Landmark']
          this.post = result['addressList'][0]['PostOffice']
          this.pin = result['addressList'][0]['Pincode']
          this.state =result['addressList'][0]['State'] 
          this.phone = !!result['addressList'][0]['Mobile']?result['addressList'][0]['Mobile']:result['addressList'][0]['Alternateno']
        })

      
    }
      )
       
  }
  getSelectedLoanDetails(LoanId:any ){

  this.customerdata(LoanId)

   
      

  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
  clearDataSource(){
    
  }
  printLetter(letter): void {
    let printContents, popupWin;
    printContents = document.getElementById(letter).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(printContents);
    popupWin.print();
    popupWin.document.close();
  }
  printletter2(loanid){
    const content = this.pdfTemplate.nativeElement;
    html2canvas(content,).then(canvas => {        
      var imgWidth = 200;   
      var pageHeight = 250;    
      var imgHeight = 250
      var heightLeft = imgHeight; 
  
      const contentDataURL = canvas.toDataURL("image/png", 3.0);
      let pdf = new jsPDF('p', 'mm');
      var position = 5;  
      pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
      pdf.save(this.LoanId + "_"+this.name+ '.pdf');
    }); 
  }
//   printLetter(){
//     const content = this.pdfTemplate.nativeElement;
//     html2canvas(content).then(canvas => {        
//       var imgWidth = 250;   
//       var pageHeight = 250;    
//       var imgHeight = canvas.height * imgWidth / canvas.width;
//       var heightLeft = imgHeight; 
  
//       const contentDataURL = canvas.toDataURL('image/PNG');
//       let pdf = new jsPDF('p', 'mm', 'a4');
//       var position = 0;  
//       pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
//       pdf.save('strreports.pdf');
//     });  
// //     let doc = new jsPDF();

// //     doc.setFontSize(100); 

// // // Create your table here (The dynamic table needs to be converted to canvas).
// // const element = this.pdfTemplate.nativeElement;

// // html2canvas(element)
// // .then((canvas: any) => {
// // doc.addImage(canvas.toDataURL("image/jpeg"), "JPEG", 5, 80, 
// // doc.internal.pageSize.width, element.offsetHeight / 3 );
// // doc.save(`Report-${Date.now()}.pdf`);
// // })
//   }
  
  clear() {
    this.loanamount = ""
    this.Active = false;
    this.LosLettterActive = false;
    this.resetDataProperty();
    this.LoanId = undefined;
    this.loandate2 = undefined
    this.loandate3 = undefined
    this.interest = undefined
    this.tenure = undefined
    this.emidate = undefined
    this.prcosfee = ""
    this.name = ""
    this.father = ""
    this.HouseName = ""
    this.AddressLine1 = ""
    this.AddressLine2 = ""

    this.AddressLine3 = ""
    this.Pincode = ""
    this.loandate3 = ""
    this.interest = ""
    this.tenure = ""
    this.emiamt =""
    this.emidate = ""
    this.firstemidate = ""
    this.AddressLine4 = ""
    this.phone = ""
    this.post = ""
    this.state = ""
    this.pin = ""
    this.loandmark = ""
  }
  resetDataProperty(){

  }

}
