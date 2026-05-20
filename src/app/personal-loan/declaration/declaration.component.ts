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
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss']
})
export class DeclarationComponent implements OnInit {
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
  addressLines2: any;
  addressLines3: any;
  HouseName: any;
  Name: any;
  fatherName: any;
  custid: any;
  stateidd: any;
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
    this.commonService.session2()

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
      "LoanNo": this.loanID,
      
    };

    this.repaymentService.getCustDetail(params).subscribe(res=>{

      if(res['status']['code'] == 1 && res['status']['flag']==1){
   console.log(res)
        this.showFlag = true;
        this.data = res['customerDtlsList'][0];
        this.stateidd = this.data['stateid']
      //   if(this.stateidd == 13){
      //     //kerala
      //     this.stateid = "hindi"
      //   }
      //  else if(this.stateidd == 18){
      //     //kerala
      //     this.stateid = "default"
      //   }
      //  else if(this.stateidd == 19){
      //     //tamilnadu
      //     this.stateid = "tamil"
      //   }
      //   else  if(this.stateidd == 20){
      //     this.stateid = "kannada"
      //   }
      //   else  if(this.stateidd == 21){
      //     this.stateid = "marathi"
      //   }
      //   else if(this.stateidd == 22){
      //     this.stateid = "andhra"
      //   }
      //   else if(this.stateidd == 24){
      //     this.stateid = "punjabi"
      //   }
      //   else  if(this.stateidd == 27){
      //     this.stateid = "gujarati"
      //   }
      //   else if(this.stateidd == 28){
      //     this.stateid = "bengali"
      //   }
      //   else if(this.stateidd == 32){
      //     this.stateid = "odia"
      //   }
      //   else  if(this.stateidd == 38){
      //     this.stateid = "assameese"
      //   }
      //   else  if(this.stateidd == 41){
      //     this.stateid = "telugu"
      //   }
      //   else{
      //     this.stateid = "default"
      //   }

        if(this.stateidd == 17){
          //kerala
          this.stateid = "hindi"
        }
       else if(this.stateidd == 18){
          //kerala
          this.stateid = "malayalam"
        }
       else if(this.stateidd == 19){
          //tamilnadu
          this.stateid = "tamil"
        }
        else  if(this.stateidd == 20){
          this.stateid = "kannada"
        }
        else  if(this.stateidd == 21){
          this.stateid = "marathi"
        }
        else if(this.stateidd == 22){
          this.stateid = "telugu"
        }
        else if(this.stateidd == 24){
          this.stateid = "punjabi"
        }
        else  if(this.stateidd == 27){
          this.stateid = "gujarati"
        }
        else if(this.stateidd == 28){
          this.stateid = "bengali"
        }
        else if(this.stateidd == 32){
          this.stateid = "odia"
        }
        else  if(this.stateidd == 38){
          this.stateid = "assameese"
        }
        else  if(this.stateidd == 41){
          this.stateid = "telugu"
        }else  if(this.stateidd == 30){
          this.stateid = "hindi"
        }
        else  if(this.stateidd == 31){
          this.stateid = "hindi"
        }else  if(this.stateidd == 42){
          this.stateid = "telugu"
        } else if(this.stateidd == 12){
          this.stateid = "bengali"
        }
        else{
          this.stateid = "default"
        }
        console.log(this.stateid)
        this.addressLines2 = this.data['AddressLine2'] ;
        console.log(this.addressLines2)
        this.addressLines3 = this.data['AddressLine3'] ;
        this.HouseName = this.data['HouseName'] ;
        this.Name = this.data['Name'] ;
        this.fatherName= this.data['father'];


console.log(this.stateid)
      }else{
        this.DisplayMessage(res['status']['message'],"Alert");
      }
       var address = this.data['Address'];
      this.stateFlag = 'default';
        this.addressLines =["vadakkedath","House"];
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
      pdf.save('declaration.pdf');
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
