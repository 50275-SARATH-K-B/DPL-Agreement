import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { CommonService } from '../../../services/report/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { Settings } from '../../../app.settings.model';
import { RepaymentService } from '../../../services/report/repayment.service';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import htmlDocx from 'html-docx-js/dist/html-docx';
(window as any).html2canvas = html2canvas;
@Component({
  selector: 'app-noc',
  templateUrl: './noc.component.html',
  styleUrls: ['./noc.component.scss']
})
export class NOCComponent implements OnInit {
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





  constructor( public Activatedroute:ActivatedRoute,@Inject(MAT_DIALOG_DATA) public data: any,public dialog: MatDialog,private commonService: CommonService,public route: ActivatedRoute,public service:RepaymentService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

 let res2 ="05/27/2019 00:00:00"
 let datee = this._rptdatePipe(res2)
 console.log(datee)
    this.date2 = new Date();
    if(!!this.data['funid']){
      this.getSelectedLoanDetails(this.data['funid']);

    }
    this.Activatedroute.paramMap.subscribe(params => {
      console.log(params)
      console.log(this.Activatedroute.snapshot.queryParams['custid'])
      this.custid =this.Activatedroute.snapshot.params['custid']; 


  this.getloanid(this.custid)

      // this.custid = '01023100000520'
      // this.router.navigate(['/maindeclaration', { custid:30850007577013  }]);


  });
 
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
    const params = {
      FirmID: 1,
      LoanNo: LoanId
    }
    this.service.getCustDetail(params).subscribe(res =>{
      console.log(res)
      if(!!res['customerDtlsList'][0]){
        this.Active = true;
        this.loanamount = res['customerDtlsList'][0]["LoanAmount"]
        this.name = res['customerDtlsList'][0]['Name'];
        this.father = res['customerDtlsList'][0]['father'];
        this.HouseName = res['customerDtlsList'][0]['HouseName'];
        this.AddressLine2 = res['customerDtlsList'][0]['AddressLine2'];
        this.Pincode = res['customerDtlsList'][0]['Pincode'];
      }
     
      
    }
      )
       
  }
  getSelectedLoanDetails(LoanId:any ){

    const params1 = {
      "LOAN_ID":LoanId
      }

this.service.nocdate(params1).subscribe(res =>{
if(!!res['value_dt']){

  this.loandate2 = this._rptdatePipe(res['value_dt'])
  this.customerdata(LoanId)
}else if(res['value_dt']==null){
  this.displayMessage("Please Enter a Settled Loan", "Alert");
this.clear()
this.Active = false;

}
})
   
      

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
    popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(printContents);
    popupWin.print();
    popupWin.document.close();
    this.downloadconfirm()
  }
  downloadconfirm(){
    let params = {
      "loan_id": this.data['funid'],
      "user_id": this.userData['empCode'],
      "downloaded_date": this._rptdatePipe(new Date())
    }
    this.commonService.nocdownload(params).subscribe(result=>{
      if (result['status'].code == 1 && result['status'].flag == 1) {

      }
    })
  }
  printword(letter){
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
    "xmlns:w='urn:schemas-microsoft-com:office:word' "+
    "xmlns='http://www.w3.org/TR/REC-html40'>"+
    "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
var footer = "</body></html>";
var sourceHTML = header+document.getElementById("letter2").innerHTML+footer;

var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
var fileDownload = document.createElement("a");
document.body.appendChild(fileDownload);
fileDownload.href = source;
fileDownload.download = this.LoanId + "_"+this.name+'.doc';
fileDownload.click();
document.body.removeChild(fileDownload);
this.downloadconfirm()

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
    this.Active = false;
    this.LosLettterActive = false;
    this.resetDataProperty();
    this.LoanId = undefined;
    this.loandate2 = undefined
  }
  resetDataProperty(){

  }



}
