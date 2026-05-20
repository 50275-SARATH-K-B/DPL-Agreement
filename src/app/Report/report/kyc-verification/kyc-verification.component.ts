import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/report/common.service';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';


@Component({
  selector: 'app-kyc-verification',
  templateUrl: './kyc-verification.component.html',
  styleUrls: ['./kyc-verification.component.scss']
})
export class KycVerificationComponent implements OnInit {
  kycdetails: any[]=[];
  dueDate:any;
  presentationDate:any;
  public dataSource = new MatTableDataSource([]);
  displayedColumns: any[] =['slno','custid','adharid','panId'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private commonService: CommonService,public dialog: MatDialog,private router:Router,public datePipe:DatePipe,
    private route: ActivatedRoute) { 

      this.route.params.subscribe(params => {
        console.log(params)
        if(params){
            this.dueDate= new Date(this.datePipe.transform(params ? params['fromDate'] : '','MM/dd/yyyy'))
            this.presentationDate=new Date(this.datePipe.transform(params ? params['toDate'] : '','MM/dd/yyyy'))
            // if(this.dueDate || this.presentationDate){
            
            // }
        }
        
        if(Object.keys(params).length == 0){
         this.dueDate = undefined
         this.presentationDate = undefined
         this.kycdetails=[]
         this.dataSource=new MatTableDataSource(this.kycdetails)
         this.dataSource.paginator = this.paginator;
        }
      })
  }

  ngOnInit() {
    this.getKycdetails()
  }

  getKycdetails(){

    let params = {
      fromdate: this.datePipe.transform(this.dueDate,'dd/MM/yyyy'),
      todate: this.datePipe.transform(this.presentationDate,'dd/MM/yyyy')
    }

    console.log(params)

    this.commonService.kycDetails(params).subscribe(res => {
    this.kycdetails = res['externalDetails']

    // for(let i = 0;i<=this.kycdetails.length-1;i++){
    //   this.kycdetails[i].AadharNumber = this.kycdetails[i].AadharNumber.replace(/\d(?=\d{4})/g, "*");
    // }
    if(res['externalDetails']){
      this.dataSource=new MatTableDataSource(this.kycdetails)
      this.dataSource.paginator = this.paginator;
    }
  
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  viewDocumentImage(element){
    console.log(element);

    // let custid=element['CustomerID']
    // let pan=element['PANNO']
    // let adhar=element['AadharNumber']

    let data = {
      custid:element['CustomerID'],
      pan:element['PANNO'],
      adhar:element['AadharNumber']
    }
    // console.log(data)

    const secretKey = 'qwerty123'; // Replace with your actual secret key

    const encryptedvalue = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    console.log(encryptedvalue)

    this.router.navigate(['/personal-report/kyc-view',{data:encryptedvalue,
      fromDate:this.datePipe.transform(this.dueDate,'MM/dd/yyyy'),toDate:this.datePipe.transform(this.presentationDate,'MM/dd/yyyy')}])
  }
}


