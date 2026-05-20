import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/report/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { FileviewComponent } from '../../../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-kycstatus',
  templateUrl: './kycstatus.component.html',
  styleUrls: ['./kycstatus.component.scss']
})
export class KycstatusComponent implements OnInit {
  filter:any
  public field: any = null;
  customerList: any[]=[];
  public settings: Settings;

  public dataSource = new MatTableDataSource([]);
  searchid: any;
  displayedColumns: any[] =['slno','custid','adharid','panId',"Aadharfront","Aadharback","Panpic","Status","verifyon","verifyby","remarks","Enterby","Enterdate"];
  selected2:any
  constructor(private commonService: CommonService,public dialog: MatDialog,public appSettings: AppSettings) { 
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.field = {
      dueDate: '',
      presentationDate: '',
    }
  }
  radioChange2(change){

  }
  AFchangeIcon(element,fileExte){

    let params = {
      "CUST_ID":element.cusT_ID
    }
    this.settings.loadingSpinner = true;

    this.commonService.kycphotos(params).subscribe(res=>{
      // setTimeout(() => {
        this.settings.loadingSpinner = false;

        let type = "AadharFront"
        let custid = element.cusT_ID
        let pic = res['kyClist'][0]['aadhaR_PHOTO1']
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
     
       
            //  }, 6000);
      
    
    })
    console.log(element)
   
  }
  ABchangeIcon(element,fileExte){
    console.log(element)
    let params = {
      "CUST_ID":element.cusT_ID
    }
    this.settings.loadingSpinner = true;

    this.commonService.kycphotos(params).subscribe(res=>{
      // setTimeout(() => {
        this.settings.loadingSpinner = false;

        let type = "AadharBack"
        let custid = element.cusT_ID
        let pic = res['kyClist'][0]['aadhaR_PHOTO2']
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
     
       
            //  }, 6000);
      
    
    })
  }
  PanchangeIcon(element,fileExte){
    console.log(element)
    let params = {
      "CUST_ID":element.cusT_ID
    }
    this.settings.loadingSpinner = true;

    this.commonService.kycphotos(params).subscribe(res=>{
      // setTimeout(() => {
        this.settings.loadingSpinner = false;

        let type = "Pan"
        let custid = element.cusT_ID
        let pic = res['kyClist'][0]['paN_PHOTO']
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
     
       
            //  }, 6000);
      
    
    })
  }
  viewDocumentImage(){

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
  getcustdaetails(){
    let params = {
      "Fromdate":this._rptdatePipe(this.field['dueDate']),
      "Todate":this._rptdatePipe(this.field['presentationDate']),
      "Status":this.selected2
    }
    this.commonService.kycstatusreport(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
      console.log(res['kyClist']);
      this.customerList=res['kyClist']
    for(let i = 0;i<=this.customerList.length-1;i++){
      this.customerList[i].aadharno = this.customerList[i].aadharno.replace(/\d(?=\d{4})/g, "*");
    }
      this.dataSource=new MatTableDataSource(this.customerList)
      console.log(this.dataSource);
      }else{
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

}
