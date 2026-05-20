import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { DeathpopupComponent } from '../deathpopup/deathpopup.component';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';
import { PopupremarkComponent } from '../popupremark/popupremark.component';

@Component({
  selector: 'app-deathstatusappr',
  templateUrl: './deathstatusappr.component.html',
  styleUrls: ['./deathstatusappr.component.scss']
})
export class DeathstatusapprComponent implements OnInit {
  public settings: Settings;
  customerList: any[]=[];
  public dataSource = new MatTableDataSource([]);
  searchid: any;
  filter:any

  displayedColumns: any[] =['slno',"LoanID","custnmee","deathdte","nominenme","nomineaddre","claimamt","insurenum","deathcertificate","Nomineeadhaar","nominPanpic","Nominebankdet","reject","ViewReport"];
  remarks: any;
  constructor(private commonService: CommonService,public appSettings: AppSettings,public dialog: MatDialog) {
    this.settings = this.appSettings.settings;

   }

  ngOnInit() {
    this.commonService.session2()

    this.customerList = []
    let d = new Date('19-FEB-2024')
    console.log(this.datediff(new Date(),new Date('19-FEB-2024')))

    this.commonService.getdeathlist().subscribe(res=>{
      this.customerList = res['data']
      this.dataSource=new MatTableDataSource(this.customerList)

    })
   
  }
  datediff(first, second) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
 }
  getcustdaetails(){

    let params = {
      "loan_id": "string"

    }
    this.commonService.getdeathdata(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;


    
      this.dataSource=new MatTableDataSource(this.customerList)
      console.log(this.dataSource);
      }else{
        this.settings.loadingSpinner = false;

        this.displayMessage(res['status'].message, "Alert");
      }
      
    })
  }
  filterSource(filterValue: string) {
    
    this.searchid =this.filter
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

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
  private _rptdatePipe(DateValue) {
    var date = new Date(DateValue);
    const months = {
      1: 'JAN',
      2: 'FEB',
      3: 'MAR',
      4: 'APR',
      5: 'MAY',
      6: 'JUN',
      7: 'JUL',
      8: 'AUG',
      9: 'SEP',
      10: 'OCT',
      11: 'NOV',
      12: 'DEC'
    }
  //  return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }

  rejectrep(element){
    const aadharDiaglogRef = this.dialog.open(PopupremarkComponent, {
      width: '50%',
    });

    aadharDiaglogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.remarks  = result['remarks']
      let params = {
        "loan_id": element.loan_id,
        "reject_remark": this.remarks,
        "reject_date": this._rptdatePipe(new Date)

      }
      this.commonService.rejectdeath(params).subscribe(res=>{
        if (res['status'].code == 1 && res['status'].flag == 1) {
          this.displayMessage(res['status'].message, "Success");
          this.ngOnInit()

        }else{
          this.displayMessage(res['status'].message, "Alert");

        }
      })

    })
  }
  changeIcon(ele,exte,id){
  
    let params = {
      loan_id : ele['loan_id']
    }
    this.settings.loadingSpinner = true;

    this.commonService.getdeathdata(params).subscribe(res => {
      // console.log(res)
      this.settings.loadingSpinner = false;

      
      if(id == 1){
        let type = "death_certificate"
        let custid =  ""
        let pic = res['uploadeddata'][0]['death_certificate']
        let d = pic
        let dataI = {
          type:type,
          custid:custid,
          file: d,
          exte: res['uploadeddata'][0]['death_certificate_extention'],
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
        let type = "Aadhar"
        let custid =  ""
        let pic = res['uploadeddata'][0]['nominee_adhar']
        let d = pic
        // console.log(d)

        // this.getbase64imagefromurl(d).then(result => {
          // console.log(result)

          // this.aadharFront = result;
          // console.log(this.aadharFront)

          let dataI = {
            type:type,
            custid:custid,
            file: d,
            exte: res['uploadeddata'][0]['nominee_adhar_extention'],
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
        // })
        
   
      }else if(id == 3){
        let type = "nominPanpic"
        let custid =  ""
        let pic = res['uploadeddata'][0]['nominee_pan']
        let d = pic

        // this.getbase64imagefromurl(d).then(result => {
          // console.log(result)
          // this.aadharBack = result;
          // console.log(this.aadharBack)

        let dataI = {
          type:type,
          custid:custid,
          file: d,
          exte: res['uploadeddata'][0]['nominee_pan_extention'],
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
        // });
      })
      }else if(id == 4){
        let type = "Nominebankdet"
        let custid =  ""
        let pic = res['uploadeddata'][0]['nominee_bank_details'] 
        let d = pic

        // this.getbase64imagefromurl(d).then(result => {
          // console.log(result)
          // this.pan = result;

        let dataI = {
          type:type,
          custid:custid,
          file: d,
          exte: res['uploadeddata'][0]['nominee_bank_details_extention'] ,
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
      // })
      }
    })
  }

  viewreport(element,i){
    let mobilewidth = "50%";
    let mobileheight = "63%";
    if (window.innerWidth < 599) {
      mobilewidth = "95%";
      mobileheight = "75%";
    }
    const dialogRef = this.dialog.open(DeathpopupComponent, {
      data:element,
      width: mobilewidth,
      height: mobileheight,
    });

  }
}
