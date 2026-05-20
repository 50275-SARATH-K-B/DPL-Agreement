import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { PopupremarkComponent } from '../../../popupremark/popupremark.component';
// import { threadId } from 'worker_threads';
import { CommonService } from '../../../services/report/common.service';
import { AadharmaskingComponent } from '../aadharmasking/aadharmasking.component';
import { saveAs} from 'file-saver';

@Component({
  selector: 'app-identityview',
  templateUrl: './identityview.component.html',
  styleUrls: ['./identityview.component.scss']
})
export class IdentityviewComponent implements OnInit {

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
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private route: ActivatedRoute,private router:Router,private commonService: CommonService,
  private dialog: MatDialog ,private api: CommonService) { }

  ngOnInit(): void {
    
    this.userData = this.commonService.getCredentials();
    console.log(this.userData)
    this.route.params.subscribe(params => {
      console.log(params);
      this.custid=params.param
      this.panid=params.param1
      this.adharid=params.param2
      
      let para={
        "customerid":this.custid
      }
      this.commonService.getcustdtalpho(para).subscribe(res=>{
        console.log(res);

        let data=res['custphotoList'][0]
        let data1=data.cust_photo

        let data2=data.pan_photo
        let data3=data.aadhar_photo1

        let data4=data.aadhar_photo2

        this.data1=data1
        this.data3=data3
        this.data4=data4
        this.data2=data2





        this.imageData = 'data:image/png;base64,' + data1
        this.panData = 'data:image/png;base64,' + data2
        this.adharData1 = 'data:image/png;base64,' + data3
        this.adharData2 = 'data:image/png;base64,' + data4
      })

    })
    
  }

  splitFile1: string;
  base64Dataaad: string;
  splitFile2: string;
  base64Dataaad2: string;
  splitFile3: string;
  base64Datpan: string;
  edit(flag){
    if(flag==1){
    const aadharDiaglogRef = this.dialog.open(AadharmaskingComponent, {
      width: '60%',

      data: this.data3
    });

    aadharDiaglogRef.afterClosed().subscribe(result => {
      console.log(result);
      
      // this.adharData1=undefined;
      this.adharData1=result['imageData']
      let splitResult = this.adharData1.split(',');
      splitResult = splitResult[splitResult['length'] - 1];
      this.splitFile1 = '' + splitResult;
      this.base64Dataaad = this.splitFile1;
      this.data3 = this.base64Dataaad
    })}
      
      
      
      
      if(flag==2){
        const aadharDiaglogRef = this.dialog.open(AadharmaskingComponent, {
          width: '60%',

          data: this.data4
        });
    
        aadharDiaglogRef.afterClosed().subscribe(result => {
          console.log(result);
          
          // this.adharData2=undefined;
          this.adharData2=result['imageData']
          let splitResult = this.adharData2.split(',');
          splitResult = splitResult[splitResult['length'] - 1];
          this.splitFile2 = '' + splitResult;
          this.base64Dataaad2 = this.splitFile2;
          this.data4 = this.base64Dataaad2
        })
      } if(flag==3){
        const aadharDiaglogRef = this.dialog.open(AadharmaskingComponent, {
          width: '60%',

          data: this.data2
        });
    
        aadharDiaglogRef.afterClosed().subscribe(result => {
          console.log(result);
          
          // this.panData=undefined;
          this.panData=result['imageData']
          let splitResult = this.panData.split(',');
          splitResult = splitResult[splitResult['length'] - 1];
          this.splitFile3 = '' + splitResult;
          this.base64Datpan = this.splitFile3;
          this.data2 = this.base64Datpan
        })
      }
    
  }
  approve(){
let params = {
  "CustomerID": this.custid,
  "PANPhoto":this.base64Datpan,
  "AadharPhoto1": this.base64Dataaad,
  "AadharPhoto2": this.base64Dataaad2,
  "STATUS": 1,
  "REMARKS":"",
  "EnterBy":this.userData['empCode']

}
this.commonService.kycupdate(params).subscribe(res=>{
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
this.router.navigate(['/personal-report/identity-verify'])

  }else{
    this.displayMessage(res['status'].message, "Alert")
  }
})

  }
  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

  }
  back(){
    this.router.navigate(['/personal-report/identity-verify'])

  }
  reject(){
    const aadharDiaglogRef = this.dialog.open(PopupremarkComponent, {
      width: '50%',
    });

    aadharDiaglogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.remarks  = result['remarks']
      let params = {
        "CustomerID": this.custid,
        "PANPhoto":"",
        "AadharPhoto1": "",
        "AadharPhoto2":"",
        "STATUS": 2,
        "REMARKS":this.remarks,
        "EnterBy":this.userData['empCode']

      }
      this.commonService.kycupdate(params).subscribe(res=>{
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
          this.router.navigate(['/personal-report/identity-verify'])

        }else{
          this.displayMessage(res['status'].message, "Alert");

        }
      })

    })
  }
// approoval(flag){

//   if(flag==1){
//   let para=
//     {
//       "CustomerID": this.custid,
//       "AadharNo": this.adharid,
//       "PANNo": this.panid,
//       "CustomerPhoto": this.data1,
//       "PANPhoto": this.data2,
//       "AadharPhoto1":this.data3 ,
//       "AadharPhoto2":this.data4 ,
//       "EnterBy":this.userData['empCode'], 
//     }
//     this.commonService.addcust(para).subscribe(res=>{
//       console.log(res);
//       // if(){

//       // }
      
//     })

//   }else{
//     let para=
//     {
//       "CustomerID": this.custid,
//       "AadharNo": this.adharid,
//       "PANNo": this.panid,
//       "CustomerPhoto": this.data1,
//       "PANPhoto": this.data2,
//       "AadharPhoto1":this.data3 ,
//       "AadharPhoto2":this.data4 ,
//       "EnterBy":this.userData['empCode'], 
//     }
//     this.commonService.addcust(para).subscribe(res=>{
//       console.log(res);
//       // if(){

//       // }
      
//     })
//   }


  
// }
downloadd(){
  if (window.navigator.userAgent.toLowerCase().indexOf('trident') > -1) { //For IE browser
    const byteCharacters = atob(this.data3);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // change the file type accordingly
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, this.custid + "Aadharfront.jpeg"); 
    }
  } else { //For other browsers
    const linkSource = 'data:image/jpeg;base64,' + this.data3;
    const downloadLink = document.createElement("a");
    const fileName = this.custid + "Aadharfront.jpeg";
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
downloadd1(){
  if (window.navigator.userAgent.toLowerCase().indexOf('trident') > -1) { //For IE browser
    const byteCharacters = atob(this.data4);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // change the file type accordingly
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, this.custid + "Aadharback.jpeg"); 
    }
  } else { //For other browsers
    const linkSource = 'data:image/jpeg;base64,' + this.data4;
    const downloadLink = document.createElement("a");
    const fileName = this.custid + "Aadharback.jpeg";
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
downloadd2(){
  if (window.navigator.userAgent.toLowerCase().indexOf('trident') > -1) { //For IE browser
    const byteCharacters = atob(this.data2);
    const byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' }); // change the file type accordingly
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
      (window.navigator as any).msSaveOrOpenBlob(blob, this.custid + "Pan.jpeg"); 
    }
  } else { //For other browsers
    const linkSource = 'data:image/jpeg;base64,' + this.data2;
    const downloadLink = document.createElement("a");
    const fileName = this.custid + "Pan.jpeg";
  
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
clear(){

}
}
