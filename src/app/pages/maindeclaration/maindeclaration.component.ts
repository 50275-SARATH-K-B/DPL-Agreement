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
import { Router } from '@angular/router';

import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
(window as any).html2canvas = html2canvas;
@Component({
  selector: 'app-maindeclaration',
  templateUrl: './maindeclaration.component.html',
  styleUrls: ['./maindeclaration.component.scss']
})
export class MaindeclarationComponent implements OnInit {
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
  stateidd: number;
  cusssid: string;
  public settings: Settings;

  constructor(public appSettings: AppSettings,public dialog: MatDialog,private datePipe: DatePipe,public router: Router,
    private repaymentService: RepaymentService,public Activatedroute:ActivatedRoute,
    private commonService: CommonService,public translate: TranslateService) {
      this.settings = this.appSettings.settings
      this.settings.loadingSpinner= false;
      translate.addLangs(['en', 'fr','hi','mal','ta']);
      translate.setDefaultLang('en');
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
      
    }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData)
    this.today = new Date();
      
   
    this.Activatedroute.paramMap.subscribe(params => {
      console.log(params)
      
      // console.log(this.Activatedroute.snapshot.queryParams['custid'])
      this.custid =params['params']['custid']; 

  this.custdetailsbyid(this.custid)

      // this.custid = '01023100000520'
      // this.router.navigate(['/maindeclaration', { custid:30850007577013  }]);


  });
 
    // this.loanSearch();
    
   
  
  // console.log(this.custid)
  this.settings.loadingSpinner= false;
  }
  
  clear(){
    this.data = undefined;
    this.addressLines = [];
  }
  custdetailsbyid(custid){
    
    var params = {
      "customerid": custid
     };

    this.repaymentService.getCustDetailbyCustid(params).subscribe(res=>{
console.log(res)
      if(res['status']['code'] == 1 && res['status']['flag']==1){
   
        this.showFlag = true;
        this.data = res['customerDtlsGetList'][0];
        // this.stateid = (!!this.data['stateid'])?!!this.data['stateid'] : 'punjabi' ;
        this.stateidd = this.data['stateid']
        if(this.stateidd == 17){
          //kerala
          this.stateid = "hindi"
        }if(this.stateidd == 7){
          //kerala
          this.stateid = "hindi"
        }
       else if(this.stateidd == 18){
          //kerala
          this.stateid = "malayalam"
        }else if(this.stateidd == 6){
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
        }else  if(this.stateidd == 31){
          this.stateid = "hindi"
        }else  if(this.stateidd == 42){
          this.stateid = "telugu"
        }
        else if(this.stateidd == 12){
          this.stateid = "bengali"
        } else  if(this.stateidd == 2){
          this.stateid = "gujarati"
        } else  if(this.stateidd == 3){
          this.stateid = "gujarati"
        }else  if(this.stateidd == 4){
          this.stateid = "hindi"
        }else  if(this.stateidd == 5){
          this.stateid = "hindi"
        }else  if(this.stateidd == 8){
          this.stateid = "default"
        }else  if(this.stateidd == 9){
          this.stateid = "default"
        }else  if(this.stateidd == 10){
          this.stateid = "default"
        }else  if(this.stateidd == 11){
          this.stateid = "default"
        }else  if(this.stateidd == 23){
          this.stateid = "hindi"
        }else  if(this.stateidd == 25){
          this.stateid = "hindi"
        }else  if(this.stateidd == 26){
          this.stateid = "hindi"
        }else  if(this.stateidd == 29){
          this.stateid = "tamil"
        }else  if(this.stateidd == 33){
          this.stateid = "hindi"
        }else  if(this.stateidd == 34){
          this.stateid = "hindi"
        }else  if(this.stateidd == 35){
          this.stateid = "hindi"
        }else  if(this.stateidd == 36){
          this.stateid = "hindi"
        }else  if(this.stateidd == 37){
          this.stateid = "default"
        }else  if(this.stateidd == 39){
          this.stateid = "hindi"
        }else  if(this.stateidd == 40){
          this.stateid = "hindi"
        }else  if(this.stateidd == 31){
          this.stateid = "hindi"
        }
        else{
          this.stateid = "default"
        }
        // let id = this.stateArray.find(s => s. == );
        this.addressLines2 = this.data['locality'] ;
        console.log(this.addressLines2)
        this.addressLines3 = this.data['locality'] ;
        this.HouseName = this.data['house'] ;
        this.Name = this.data['Name'] ;
        this.fatherName= this.data['father']

      }
      else{
        this.DisplayMessage(res['status']['message'],"Alert");
      }
      
    },
    err=>{})

  }


  // public loanSearch(): void {
  //   this.clear();
  //   this.showFlag = false;
    
  //   const dialogRef = this.dialog.open(LoanSearchComponent, {
  //     height: "80%",
  //     width: '75%',
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (!!result) {
  //       this.settings.loadingSpinner = false;
        
  //       this.getSelectedLoanDetails(result.loanItem);
        
  //     }
  //   }, error => { this.settings.loadingSpinner = false; });
  // }

  // getSelectedLoanDetails(loanItem: any) {
  //   console.log(loanItem)
  //   this.loanID = loanItem.LoanId;
    
  //   var params = {
  //     "ProductId":this.userData['productID'],
  //     "FirmID": this.userData['firmID'],
  //     "LoanNo": this.loanID,
      
  //   };

  //   this.repaymentService.getCustDetail(params).subscribe(res=>{
  //     console.log(res)

  //     if(res['status']['code'] == 1 && res['status']['flag']==1){
   
  //       this.showFlag = true;
  //       // this.data = res['customerDtlsList'][0];
  //       // this.stateid = (!!this.data['stateid'])?!!this.data['stateid'] : 'punjabi' ;
  //       // this.addressLines2 = this.data['AddressLine2'] ;
  //       // console.log(this.addressLines2)
  //       // this.addressLines3 = this.data['AddressLine3'] ;
  //       // this.HouseName = this.data['HouseName'] ;
  //       // this.Name = this.data['Name'] ;
  //       // this.fatherName= this.data['father'];
  //       this.custdetailsbyid(res['customerDtlsList'][0]['CustID'])


  //     }else{
  //       this.DisplayMessage(res['status']['message'],"Alert");
  //     }
  //      var address = this.data['Address'];
  //     this.stateFlag = 'default';
  //       this.addressLines =["vadakkedath","House"];
  //   },
  //   err=>{})

  // }

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

