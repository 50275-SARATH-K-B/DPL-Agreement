import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { CommonService } from '../../../services/report/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { Settings } from '../../../app.settings.model';
import { RepaymentService } from '../../../services/report/repayment.service';
import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;
import * as jspdf from 'jspdf';
import { AppSettings } from '../../../app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-sanctionletter',
  templateUrl: './sanctionletter.component.html',
  styleUrls: ['./sanctionletter.component.scss']
})
export class SanctionletterComponent implements OnInit {

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
  loandtlsList: any;
  branchid: any;
  branchname: any;
  sanctiond: any;
  loandate: any;





  constructor(public appSettings: AppSettings,private repaymentService: RepaymentService,public dialog: MatDialog,private commonService: CommonService,public route: ActivatedRoute,public service:RepaymentService,private httpClient: HttpClient) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

 let res2 ="05/27/2019 00:00:00"
 let datee = this._rptdatePipe(res2)
 console.log(datee)
    this.date2 = new Date();
    this.route.params.subscribe((params: Params) => {
      console.log(params['params'])
      // if (!!params && !!params['params']) {
      //   this.funID = params['params'];
      //   this.displayLoanSearchPopup();

      // }
    });
    // this.displayLoanSearchPopup();
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
      if(!!res['data']){

        let d = res['data'][0]['details'].replace("#","")
        // window.location.assign()  

      }else{

      }

      // this.downloadpdf(res['data'][0]['details'])
      // if(!!res['customerDtlsList'][0]){
      //   this.Active = true;
      //   this.loanamount = res['customerDtlsList'][0]["LoanAmount"]
      //   this.name = res['customerDtlsList'][0]['Name'];
      //   this.father = res['customerDtlsList'][0]['father'];
      //   this.HouseName = res['customerDtlsList'][0]['HouseName'];
      //   this.AddressLine2 = res['customerDtlsList'][0]['AddressLine2'];
      //   this.Pincode = res['customerDtlsList'][0]['Pincode'];
      // }
     
      
    }
      )
       
  }
  // downloadpdf(element){
  //   debugger
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Accept', 'application/pdf');
  //   return this.httpClient.get(element['Sanction Letter URL'], { headers: headers, responseType: 'blob' });
  // }
  getSelectedLoanDetails(LoanId:any ){
    if (!!this.LoanId) {
      const params = {
        "loan_id": this.LoanId

      }
      this.settings.loadingSpinner = true;
      this.repaymentService.sanctionletter(params).subscribe(res => {
        // if (!!res && res['status'].code == 1) {
        //   this.loandtlsList = res['data'];
        //   let headers =this.loandtlsList[0]['details'].split('||');
        //   this.branchid = headers[0]
        //   this.branchname = headers[1]
        //   this.sanctiond = headers[2]
        //   this.loandate

         
        // }
        if(!!res['data'] && res['data'].length>0){
          this.settings.loadingSpinner = false;
        
          let  d= res['data'][0]['details'].split("#").join("")
//  window.location.assign(
           
          window.location.assign(d)  
  
        }else{
          this.settings.loadingSpinner = false;

          this.displayMessage("No Data Found", "Alert");

        }
      })
    }

  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
  clearDataSource(){
    
  }
  print(letter): void {
    console.log("printSectionId >>>>>>>>>",letter)
    var data = document.getElementById(letter);
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      console.log('dataaaaaa',data)
      console.log("canvas >>>>>>>>> ",canvas)
      var imgWidth = 250;
      var pageHeight = 600;
      var imgHeight = 260;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
     
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 15;
      pdf.addImage(contentDataURL, 'PNG', -14, position, imgWidth, imgHeight)
      //pdf.autoPrint();
     
      pdf.save('MYPdf.pdf'); // Generated PDF  
      // this.onNoClick(); 

    });
  
  }
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
