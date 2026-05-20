import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CommonService } from '../../../services/report/common.service';
import { RepaymentService } from '../../../services/report/repayment.service';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';

@Component({
  selector: 'app-enachtest',
  templateUrl: './enachtest.component.html',
  styleUrls: ['./enachtest.component.scss']
})
export class EnachtestComponent implements OnInit {

  
 name:any;
 father:any;
 HouseName:any;
 AddressLine2:any;
 Pincode:any;
 Active = false;
 LoanId:any;
 loandate2:any;
  userData: any;
  funID: Params;



 

  


  constructor(private repaymentService: RepaymentService,public dialog: MatDialog,public route: ActivatedRoute,private service:RepaymentService,private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();

    this.route.params.subscribe((params: Params) => {
      console.log(params['params'])
      if (!!params && !!params['params']) {
        this.funID = params['params'];
        this.displayLoanSearchPopup();

      }
    });
    this.displayLoanSearchPopup()
    
    }
    displayLoanSearchPopup(){
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
  
      });
      dialogRef.afterClosed().subscribe(result => {
        
        
        if (!!result) {
          this.getSelectedLoanDetails(result.loanItem.LoanId);
          this.LoanId = result.loanItem.LoanId;
        }    });
    }
    getSelectedLoanDetails(g){

    }
    search(){
      
    }

    
  }

    

 
  
    
 