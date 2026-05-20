import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../../services/report/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { PopupremarkComponent } from '../../../popupremark/popupremark.component';
import { AadharmaskingComponent } from '../aadharmasking/aadharmasking.component';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-kyc-view',
  templateUrl: './kyc-view.component.html',
  styleUrls: ['./kyc-view.component.scss']
})
export class KycViewComponent implements OnInit {
  imageData:any;
  custid: any;
  panid:any;
  adharid: any;
  adharData1:any;
  adharData2:any;
  panData:any;
  data3: any;
  data4: any;
  data2: any;
  data1: any;
  userData: any;
  remarks: any;
  base64Dataaad: any;
  base64Dataaad2: any;
  base64Datpan: any;
  splitFile1: string;
  splitFile2: string;
  splitFile3: string;
  fromDate:any;
  toDate:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,private router:Router,private commonService: CommonService,
  private dialog: MatDialog ,private api: CommonService,private http: HttpClient) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData)
    this.route.params.subscribe(params => {
      // console.log(params);

      const secretKey = 'qwerty123';

      const decryptedBytes = CryptoJS.AES.decrypt(params['data'], secretKey);
      const decryptedValue = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

      this.custid=decryptedValue['custid']
      this.panid=decryptedValue['pan']
      this.adharid=decryptedValue['adhar']

      // console.log(decryptedValue)

      this.fromDate=params['fromDate']
      this.toDate=params['toDate']
      
      let para={
        "customer_id":this.custid
      }
      this.commonService.kycImageDetails(para).subscribe(res => {
        // console.log(res);

        let data=res['externalImageDetails'][0]

        this.data1=data["CustomerPhoto"]
        this.data2=data['PanPHOTO']
        this.data3=data['AadharBack']
        this.data4=data['AadharFrontBottom']
        

        this.imageData = 'data:image/png;base64,' + this.data1
        this.panData = this.data2
        this.adharData1 =this.data3
        this.adharData2 =this.data4
      })

    })
  }

  async getbase64imagefromurl(imageurl) {
    var res = await fetch(imageurl);
    var blob = await res.blob();
  
    return new Promise((resolve, reject) => {
      var reader  = new FileReader();
      reader.addEventListener("load", function () {
          resolve(reader.result);
      }, false);
  
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    })
  }


  panImage:any;
  aadharBack:any;
  aadharFront:any;
  
  download(key){
   if(key == 1){
    
   this.getbase64imagefromurl(this.data4)
    .then(result => {
      this.aadharFront = result;
        // Replace 'base64ImageData' with the base64-encoded image data
        const base64ImageData = this.aadharFront.split(',')[1]; // Your base64 image data here
        // Create a blob from the base64 data
        const byteCharacters = atob(base64ImageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        // Create an object URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Aadhar-frontside.jpg';
        // Simulate a click on the anchor element to trigger the download
        link.click();
        // Release the object URL
        URL.revokeObjectURL(blobUrl);
    })
    .catch(err => console.error(err));

  
   }else if(key == 2){
    
    this.getbase64imagefromurl(this.data3)
    .then(result =>
      {
        this.aadharBack = result;
        // Replace 'base64ImageData' with the base64-encoded image data
        const base64ImageData = this.aadharBack.split(',')[1]; // Your base64 image data here
        // Create a blob from the base64 data
        const byteCharacters = atob(base64ImageData);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        // Create an object URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Aadhar-backside.jpg';
        // Simulate a click on the anchor element to trigger the download
        link.click();
        // Release the object URL
        URL.revokeObjectURL(blobUrl);
        })
        .catch(err => console.error(err));
      
   }else if(key == 3){
    // if (window.navigator.userAgent.toLowerCase().indexOf('trident') > -1) { //For IE browser

      this.getbase64imagefromurl(this.data2)
    .then(result => {
      this.panImage = result;
      // Replace 'base64ImageData' with the base64-encoded image data
      const base64ImageData = this.panImage.split(',')[1]; // Your base64 image data here
      // Create a blob from the base64 data
      const byteCharacters = atob(base64ImageData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      // Create an object URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      // Create an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'pan-card.jpg';
      // Simulate a click on the anchor element to trigger the download
      link.click();
      // Release the object URL
      URL.revokeObjectURL(blobUrl);
      })
      .catch(err => console.error(err));

   }
 }

  back(){
    this.router.navigate(['/personal-report/kyc-verification',{fromDate:this.fromDate,toDate:this.toDate}])
  }

  approve(){

      

    let params = {
      "CustomerID": this.custid,
      "PANPhoto":this.base64Datpan,
      "CustomerPhoto":"",
      "AadharPhotoFrontTop":"",
      "AadharPhotoFrontBottom": this.base64Dataaad2,
      "AadharPhotoBack": this.base64Dataaad,
      "status_id": '1',
      "remarks":"",
      "enterBy":this.userData['empCode']
    
    }

    this.commonService.AddCustomerKycConfirm(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
        let params1 = {
          "LoginID": this.custid
    
        }
        this.commonService.disburcustom(params1).subscribe(res1=>{
          if (res1['status'].code == 1 && res1['status'].flag == 1) {
        let params2 = {
          CustId:this.custid,
          LoanAmt:res1['customerDetailsList'][0]['CustName'].split('^')[3],
          SchemeID:res1['schemeDetailsList'][0]['SchemeID'],
          InterestRate:res1['schemeDetailsList'][0]['ROI'],
          SchemeDtls:'1^'+res1['schemeDetailsList'][0]['Tenure']+'^'+1+'~',
          PaymentDtls:"99"+'^'+this.custid + '^'+this.userData['empCode'],
          TypeId:1
  
        }
        this.commonService.disbursement(params2).subscribe(res2=>{
          if (res2['status'].code == 1 && res2['status'].flag == 1) {
            this.displayMessage(res2['outputMessage'],"Success")

            this.custid = ""
            this.panData = undefined
            this.adharData1 = undefined
            this.adharData2 = undefined
            this.remarks = undefined
            this.base64Dataaad = undefined
            this.base64Dataaad2 = undefined
            this.base64Datpan = undefined
            this.router.navigate(['/personal-report/kyc-verification'])
          }else{
            this.displayMessage(res2['status']['message'],"Alert")

          }
        })
      }else{
        this.displayMessage(res1['status']['message'],"Alert")

      }
    })
       
      }else{
        this.displayMessage(res['status'].message, "Alert")
      }
      })
  
 
    
    }


  reject(){
    const aadharDiaglogRef = this.dialog.open(PopupremarkComponent, {
      width: '50%',
      data: { message: null}

    });

    aadharDiaglogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.remarks  = result['remarks']
      let params = {
      "CustomerID": this.custid,
      "PANPhoto":"",
      "CustomerPhoto":"",
      "AadharPhotoFrontTop":"",
      "AadharPhotoFrontBottom": "",
      "AadharPhotoBack": "",
      "status_id": '2',
      "remarks": this.remarks,
      "enterBy":this.userData['empCode']
      }
      console.log(params)
      this.commonService.AddCustomerKycConfirm(params).subscribe(res=>{
        if (res['status'].code == 1 && res['status'].flag == 1) {
          this.displayMessage(res['status'].message, "Success");
          this.custid = ""
          this.panData = undefined
          this.adharData1 = undefined
          this.adharData2 = undefined
          this.remarks = undefined
          this.base64Dataaad = undefined
          this.base64Dataaad2 = undefined
          this.base64Datpan = undefined
          this.router.navigate(['/personal-report/kyc-verification'])

        }else{
          this.displayMessage(res['status'].message, "Alert");

        }
      })

    })
  }

  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

  }


}
