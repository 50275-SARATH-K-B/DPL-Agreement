import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/report/common.service';
import { RepaymentService } from '../../../services/report/repayment.service';

@Component({
  selector: 'app-enachlink',
  templateUrl: './enachlink.component.html',
  styleUrls: ['./enachlink.component.scss']
})
export class EnachlinkComponent implements OnInit {
 
  name:any;
  father:any;
  HouseName:any;
  AddressLine2:any;
  Pincode:any;
  Active = false;
  LoanId:any;
  loandate2:any;
   userData: any;
  funID: any;
  selectedloanid:any;
  enachid: any;
  cutomerid: any;
 
 
 
  
 
   
 
 
   constructor(private repaymentService: RepaymentService,public dialog: MatDialog,public route: ActivatedRoute,private service:RepaymentService,private commonService: CommonService) { }
 
   ngOnInit() {
     this.userData = this.commonService.getCredentials();
 
    
     
     }
     keyPress(event: any) {
      const pattern = /^\d*\.?\d{0,2}$/;
    
  
      let value = event.target.value;
       let current: string = value;
        const position = event.target.selectionStart;
        const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
        if (next && !String(next).match(pattern)) {
         event.preventDefault();
        }
    }
     
     getSelectedLoanDetails(){
       this.cutomerid =this.enachid
       let params= {
        "CustID": this.cutomerid,
        "LoanAmount": 0,
        "SchemeID": 0,
        "InterestRate": 0,
        "SchemeDtls": "",
        "PaymentDtls": "",
        "TypeID": 0
      }

      this.repaymentService.getenachurl(params).subscribe(res=>{
console.log(res)
if (res['status'].flag == 1 && res['status'].code == 1){
  this.displayMessage({ type: "Success", message: 'Success' });

}
else{
  this.displayMessage({type:"Alert",message:"try again" })
}
      },error => {
        this.displayMessage({type: "Alert", message: 'Check the Customer ID again'});

      }
      )
     }
    clearDataSource(){
      
    }
    private displayMessage(params): any {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%',
        data: params
      });
    }


    

 }
  
   
     
  