import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Settings } from '../../app.settings.model';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AppSettings } from '../../app.settings';
import { MatDialog } from '@angular/material';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../services/report/common.service';
import * as jsPDF from 'jspdf';
import { RepaymentService } from '../../services/report/repayment.service';
import {TranslateService} from '@ngx-translate/core';

import html2canvas from 'html2canvas';
(window as any).html2canvas = html2canvas;


@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {
  public settings: Settings;
  userData: any;
  loanID:string;
  today:any;
  data:any;
  showFlag:boolean = false;
  display_none : boolean = false;
  state_kerala : boolean = false ;
  state_maharashtra : boolean = false ;
  state_hindi : boolean = false ;
  state_tamilnadu : boolean = false ;
  state_gujarat : boolean = false ;
  state_andhrapradesh : boolean = false ;
  state_karnataka : boolean = false ;
  state_punjab : boolean = false ;
  state_odisha : boolean = false ;
  state_bengal : boolean = false ;
  state_assam : boolean = true ;
  state_default : boolean = false ;
  stateArray : any;
  stateid  : any ;
  stateFlag : any ;

  

  addressLines:string[] = [];
  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;
  constructor(public dialog: MatDialog,private datePipe: DatePipe,
    private repaymentService: RepaymentService,
    public appSettings: AppSettings,private commonService: CommonService,public translate: TranslateService) { 
      translate.addLangs(['en', 'fr','hi','mal','ta']);
      translate.setDefaultLang('en');
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    }

  ngOnInit() {
    
    this.settings = this.appSettings.settings;
    this.userData = this.commonService.getCredentials();
    this.today = new Date();
    this.loanSearch();
    this.stateArray = {
      "0" : "default",
      "1":	"OTHERS",
      "2":	"DADRA & NAGAR HAVELI",
      "3":	"DAMAN & DIU",
      "4":	"GOA",
      "5":	"JAMMU & KASHMIR",
      "6":	"LAKSHADWEEP",
      "7":	"MANIPUR",
      "8":	"MEGHALAYA",
      "9":	"MIZORAM",
      "10":	"NAGALAND",
      "11" :	"SIKKIM",
      "12" :	"TRIPURA",
      "13" :	"UTTARANCHAL",
      "17" :	"NEW DELHI",
      "18" :	"KERALA",
      "19" :	"TAMIL NADU",
      "20" :	"KARNATAKA",
      "21" :	"MAHARASHTRA",
      "22" :	"ANDHRA PRADESH",
      "23" :	"HARYANA",
      "24" :	"PUNJAB",
      "25" :	"UTTAR PRADESH",
      "26" :	"RAJASTHAN",
      "27" :	"GUJARAT",
      "28" :	"WEST BENGAL",
      "29" :	"PONDICHERRY",
      "30" :	"MADHYA PRADESH",
      "31" :	"BIHAR",
      "32" :	"ODISHA",
      "33" :	"UTTARAKHAND",
      "34" :	"JHARKHAND",
      "35" :	"HIMACHAL PRADESH",
      "36" :	"ANDAMAN & NICOBAR",
      "37" :	"ARUNACHAL PRADESH",
      "38" :	"ASSAM",
      "39" :	"CHANDIGARH",
      "40" :	"CHHATTISGARH",
      "41" :	"TELANGANA",
      "42" :	"ISD"
     
  }

  }
  clear(){
    this.data = undefined;
    this.addressLines = [];
  }


  public loanSearch(): void {
    this.clear();
    this.showFlag = false;
    
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.settings.loadingSpinner = false;
        
        this.getSelectedLoanDetails(result.loanItem);
        
      }
    }, error => { this.settings.loadingSpinner = false; });
  }

  getSelectedLoanDetails(loanItem: any) {
    this.loanID = loanItem.LoanId;
    
    var params = {
      "ProductId":this.userData['productID'],
      "FirmID": this.userData['firmID'],
      "LoanNo": this.loanID
    };

    this.repaymentService.getArbitrationReport(params).subscribe(res=>{

      if(res['status']['code'] == 1 && res['status']['flag']==1){
        this.showFlag = true;
        this.data = res['arbitrationreportList'][0];
        this.stateid = this.data['stateid'];
        if(this.stateid == 17){
          //kerala
          this.stateFlag = "delhi"
        }
       else if(this.stateid == 18){
          //kerala
          this.stateFlag = "kerala"
        }
       else if(this.stateid == 19){
          //tamilnadu
          this.stateFlag = "tamilnadu"
        }
        else  if(this.stateid == 20){
          this.stateFlag = "karnataka"
        }
        else  if(this.stateid == 21){
          this.stateFlag = "maharashtra"
        }
        else if(this.stateid == 22){
          this.stateFlag = "andhra"
        }
        else if(this.stateid == 24){
          this.stateFlag = "punjab"
        }
        else  if(this.stateid == 27){
          this.stateFlag = "gujarat"
        }
        else if(this.stateid == '28'){
          this.stateFlag = "westbengal"
        }
        else if(this.stateid == 32){
          this.stateFlag = "odisha"
        }
        else  if(this.stateid == 38){
          this.stateFlag = "assam"
        }
        else  if(this.stateid == 41){
          this.stateFlag = "telangana"
        }
        else{
          this.stateFlag = "default"
        }
        var address = this.data['Address'];
        this.addressLines = address.split(",");
      }else{
        this.DisplayMessage(res['status']['message'],"Alert");
      }

    },
    err=>{})

  }

  printPdf(){
    const content = this.pdfTemplate.nativeElement;
    html2canvas(content).then(canvas => {        
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight; 
  
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4');
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('arbitration-report.pdf');
    });  

  }
  
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
  translateToEnglish(){
    
  }


}
