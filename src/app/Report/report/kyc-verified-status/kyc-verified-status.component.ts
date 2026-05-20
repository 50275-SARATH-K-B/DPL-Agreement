import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/report/common.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { FileviewComponent } from '../../../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-kyc-verified-status',
  templateUrl: './kyc-verified-status.component.html',
  styleUrls: ['./kyc-verified-status.component.scss']
})
export class KycVerifiedStatusComponent implements OnInit {
  kycdetails: any[]=[];
  dueDate:any;
  presentationDate:any;
  selected2:any;
  public dataSource = new MatTableDataSource([]);
  customerID:any
  displayedColumns: any[] =['slno','custid','adharid','panId',"customerPhoto","Aadharfront","Aadharback","Panpic"];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private commonService: CommonService,public dialog: MatDialog,public datePipe:DatePipe) { }
  
  ngOnInit() {
    // this.getKycdetails()
    this.commonService.session2()

  }

  getKycdetails(){


    let params = {
      fromdate: this.datePipe.transform(this.dueDate,'dd/MM/yyyy'),
      todate: this.datePipe.transform(this.presentationDate,'dd/MM/yyyy'),
      Status: this.selected2
    }
    this.commonService.kycUpdatedVerification(params).subscribe(res => {
  console.log(res)
   this.kycdetails = res['externalReport']

   if(this.kycdetails != null){
      for(let i = 0;i<=this.kycdetails.length-1;i++){
        if(!!this.kycdetails[i].aadharno){
          this.kycdetails[i].aadharno = this.kycdetails[i].aadharno.replace(/\d(?=\d{4})/g, "*");

        }else{
          this.kycdetails[i].aadharno = this.kycdetails[i].aadharno

        }
      }
      this.dataSource=new MatTableDataSource(this.kycdetails)
      console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
   }else{
      this.displayMessage('No Data Found','Alert')
   }
   
    })
  }
  getcustdetails(){
    let params = {
      cust_id:this.customerID,
      Status: this.selected2

    }
    this.commonService.getkycdetailsbycustid(params).subscribe(res => {
  console.log(res)
   this.kycdetails = res['externalReport']

   if(this.kycdetails != null){
      for(let i = 0;i<=this.kycdetails.length-1;i++){
        if(!!this.kycdetails[i].aadharno){
          this.kycdetails[i].aadharno = this.kycdetails[i].aadharno.replace(/\d(?=\d{4})/g, "*");

        }else{
          this.kycdetails[i].aadharno = this.kycdetails[i].aadharno

        }
      }
      this.dataSource=new MatTableDataSource(this.kycdetails)
      console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
   }else{
      this.displayMessage('No Data Found','Alert')
   }
   
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  aadharFront:any;
  aadharBack:any;
  pan:any;
  changeIcon(ele,exte,id){
  debugger
    let params = {
      customer_id : ele['cusT_ID']
    }
    this.commonService.kycImageDetails(params).subscribe(res => {
      // console.log(res)
      if(id == 1){
        let type = "Customer"
        let custid =  ele['cusT_ID']
        let pic = res['externalImageDetails'][0]['CustomerPhoto']
        let d = pic
        let dataI = {
          type:type,
          custid:custid,
          file: d,
          exte: ".jpg",
          isView: true
        };
        let mobilewidth = "50%";
        let mobileheight = "63%";
        if (window.innerWidth < 599) {
          mobilewidth = "95%";
          mobileheight = "75%";
        }
        const dialogRef = this.dialog.open(FileviewComponent, {
          data:dataI,
          width: mobilewidth,
          height: mobileheight,
        });
   
      }else if(id == 2){
        let type = "Aadhar Front"
        let custid =  ele['cusT_ID']
        let pic = res['externalImageDetails'][0]['AadharFrontBottom']
        let d = pic
        // console.log(d)

        this.getbase64imagefromurl(d).then(result => {
          // console.log(result)

          this.aadharFront = result;
          // console.log(this.aadharFront)

          let dataI = {
            type:type,
            custid:custid,
            file: this.aadharFront.split(',')[1],
            exte: ".jpg",
            isView: true
          };
          let mobilewidth = "50%";
          let mobileheight = "63%";
          if (window.innerWidth < 599) {
            mobilewidth = "95%";
            mobileheight = "75%";
          }
          const dialogRef = this.dialog.open(FileviewComponent, {
            data:dataI,
            width: mobilewidth,
            height: mobileheight,
          });
        })
        
   
      }else if(id == 3){
        let type = "Aadhar Back"
        let custid =  ele['cusT_ID']
        let pic = res['externalImageDetails'][0]['AadharBack']
        let d = pic

        this.getbase64imagefromurl(d).then(result => {
          // console.log(result)
          this.aadharBack = result;
          // console.log(this.aadharBack)

        let dataI = {
          type:type,
          custid:custid,
          file: this.aadharBack.split(',')[1],
          exte: ".jpg",
          isView: true
        };
        let mobilewidth = "50%";
        let mobileheight = "63%";
        if (window.innerWidth < 599) {
          mobilewidth = "95%";
          mobileheight = "75%";
        }
        const dialogRef = this.dialog.open(FileviewComponent, {
          data:dataI,
          width: mobilewidth,
          height: mobileheight,
        });
      })
      }else if(id == 4){
        let type = "pan"
        let custid =  ele['cusT_ID']
        let pic = res['externalImageDetails'][0]['PanPHOTO'] 
        let d = pic

        this.getbase64imagefromurl(d).then(result => {
          // console.log(result)
          this.pan = result;

        let dataI = {
          type:type,
          custid:custid,
          file: this.pan.split(',')[1],
          exte: ".jpg",
          isView: true
        };
        let mobilewidth = "50%";
        let mobileheight = "63%";
        if (window.innerWidth < 599) {
          mobilewidth = "95%";
          mobileheight = "75%";
        }
        const dialogRef = this.dialog.open(FileviewComponent, {
          data:dataI,
          width: mobilewidth,
          height: mobileheight,
        });
      })
      }
    })
  }

  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

  }



}
