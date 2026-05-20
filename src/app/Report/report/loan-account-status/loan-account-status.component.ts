import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { Router } from '@angular/router';
import { SoaComponent } from '../../../soa/soa.component';
import { AppSettings } from '../../../app.settings';
import { RepaymentService } from '../../../services/report/repayment.service';
import { CommonService } from '../../../services/report/common.service';
import { Settings } from '../../../app.settings.model';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';


@Component({
  selector: 'app-loan-account-status',
  templateUrl: './loan-account-status.component.html',
  styleUrls: ['./loan-account-status.component.scss']
})
export class LoanAccountStatusComponent implements OnInit {

  searchList:any;
  select:any;
  deathDate:any;
  file:any;
  base64String: any;
  filename: any;
  fileExte: any;
  legalDoc:any;
  deathCert:any;
  enterID:any;
  settlementAmount: any;
  userData: any;
  public settings: Settings;
  customerId: any;
  cust_name: any;
  loan_amnt: any;
  base64Data: any;
  filename1: any;
  fileExte1: string;
  base64String1: any;
  status: any;
  maxDate:Date;
  nominee: null;
  constructor(public dialog: MatDialog, public route: Router,public appSettings: AppSettings, 
    private commonService: CommonService,private repaymentService: RepaymentService,private datepipe:DatePipe,
    @Inject(MAT_DIALOG_DATA)private data: any,public dialogRef: MatDialogRef<LoanAccountStatusComponent>) { 
      this.settings = this.appSettings.settings;
      this.maxDate = new Date();
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.SearchById();
  }

  SearchById(){
    if(!this.enterID){
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        if (!!result) {
          this.enterID = result['loanItem']['LoanId'] ;
          this.customerId = result['loanItem']['CustID']
          this.cust_name = result['loanItem']['CustName']
          this.loan_amnt = result['loanItem']['LoanAmount']
  
          const params = {
            Product_ID: this.userData['productID'],
            LoanID: this.enterID,
            FIRM_ID: this.userData['firmID'],
            TypeID: 1
          };
          this.settings.loadingSpinner = true;
          this.repaymentService.getSettlementDetails(params)
            .subscribe(res => {
              console.log(res)
              this.settings.loadingSpinner = false;
              let loanDetailsList = res['loanDataList'];
              this.settlementAmount = loanDetailsList[0]['SettlementValue']
              console.log(this.settlementAmount)
            })
  
            if(result['loanItem']['LoanId']){
              const dialogRef = this.dialog.open(SoaComponent, {
                height: "80%",
                width: '80%',
                // disableClose:true,
                data:{LoanId:this.enterID}
              });
          
              dialogRef.afterClosed().subscribe(result => {
                this.status = this.repaymentService.loanAccntStatus
                console.log(this.status)
              })
            }
         }
      }, error => { });
    }
    
  }


  type:any;
  fileName:any;
  onSelectFile(event,id){
    
    if(id==1){
      if (event.target.files && event.target.files[0]) {
        const selectedFile = event.target.files[0];
        console.log(selectedFile)
        this.fileName = selectedFile.name
        this.type = selectedFile.type
        const reader = new FileReader();
              reader.readAsDataURL(selectedFile);
              reader.onload = () => {
                let base64Data = reader.result
                this.base64String = base64Data
                let splitResult = this.base64String.split(',');
                splitResult = splitResult[splitResult['length'] - 1];
                let splitFile = '' + splitResult;
                this.deathCert = splitFile; 
                console.log(this.deathCert)
            }   
        }
    }else{
        if (event.target.files && event.target.files[0]) {
            let selectedfile = event.target.files[0];

            let extension = selectedfile.name.split('.');
            console.log(extension)
            extension = extension[extension['length'] - 1]
            const reader = new FileReader();
            reader.readAsDataURL(selectedfile);
            reader.onload = () => {
              let base64Data = reader.result;
              this.base64String1 = base64Data;
              let splitResult = this.base64String1.split(',');
              splitResult = splitResult[splitResult['length'] - 1];
              let splitFile = '' + splitResult;
              this.legalDoc = splitFile; 
              console.log(this.legalDoc)
            };
        }
    }
     
  }

      back(){
        this.route.navigate(['/personal-report/dashboard1'])

        this.enterID = undefined ;
        this.customerId = undefined;
        this.cust_name = undefined;
        this.loan_amnt = undefined;
        this.deathDate = undefined;
        this.deathCert = undefined;
        this.legalDoc = undefined;
        this.status = undefined;

      }

      approve(){
        this.settings.loadingSpinner = true;
        let params = {
          "loanId": this.enterID != null ? this.enterID : this.enterID != undefined ? this.enterID: '',
          "customerId": this.customerId != null ? this.customerId :this.customerId != undefined ? this.customerId : '',
          "customer_name": this.cust_name != null ? this.cust_name : this.cust_name != undefined ? this.cust_name : '',
          "deathDate": this.datepipe.transform(this.deathDate,'dd/MM/yyyy'),
          "deathCertificate": this.deathCert,
          "legalCertificate": this.legalDoc,
          "loanAmount": this.loan_amnt != null ? this.loan_amnt : this.loan_amnt != undefined ? this.loan_amnt : 0,
          "settlementAmount": this.settlementAmount == null ? 0 : this.settlementAmount == undefined ? 0 : this.settlementAmount,
          "requestDate": this.datepipe.transform(new Date(),'dd/MM/yyyy'),
          "requestedEmpCode": this.userData['empCode'] != null ? this.userData['empCode'] : this.userData['empCode'] != undefined ? this.userData['empCode'] : '',
          "nomineeName": this.nominee != null ? this.nominee : this.nominee != undefined ? this.nominee : '',
          "accountStatus": this.status !=null ? this.status : this.status != undefined ? this.status : '' ,
          "status": 1
        }

        this.commonService.loanAccntStatusReq(params).subscribe(res => {

          if(res['status']['flag']==1 && res['status']['code']==1){
            this.displayMessage(res['status']['message'],'Success')
            this.settings.loadingSpinner = false;
            this.reject()
          }else{
            this.displayMessage(res['status']['message'],'Alert')
            this.settings.loadingSpinner = false;
          }

        },error => {
          this.settings.loadingSpinner = false;
        })

      }

      reject(){
        this.enterID = undefined ;
        this.customerId = undefined;
        this.cust_name = undefined;
        this.loan_amnt = undefined;
        this.deathDate = undefined;
        this.deathCert = undefined;
        this.legalDoc = undefined;
        this.status = undefined;
      }

      displayMessage(message: string, type: string) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: message, type: type },
        });
      }

}
