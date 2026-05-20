import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { NOCComponent } from '../Report/report/noc/noc.component';
import { DatePipe } from '@angular/common';
import { WelcomeLetterComponent } from '../welcome-letter/welcome-letter.component';
import { WelcomedownloadComponent } from '../welcomedownload/welcomedownload.component';
@Component({
  selector: 'app-welcome-letter-report',
  templateUrl: './welcome-letter-report.component.html',
  styleUrls: ['./welcome-letter-report.component.scss']
})
export class WelcomeLetterReportComponent implements OnInit {

  filter:any
  public field: any = null;
  customerList: any[]=[];
  public settings: Settings;

  public dataSource = new MatTableDataSource([]);
  searchid: any;
  displayedColumns: any[] =['slno',"LoanID","custid","custname","distdte","view"];
  selected2:any
  customerList2: any[]=[];
  constructor(private datePipe: DatePipe,private commonService: CommonService,public dialog: MatDialog,public appSettings: AppSettings, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.settings = this.appSettings.settings;
   }

  ngOnInit() {
    this.commonService.session2()

    this.field = {
      dueDate: '',
      presentationDate: '',
  }
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
    this.customerList= []
      this.customerList2= []
      this.dataSource=new MatTableDataSource(this.customerList)

    let params = {
      "Start_Date":this.datePipe.transform(this.field['dueDate'],'dd-MM-yyyy'),
      "End_Date":this.datePipe.transform(this.field['presentationDate'],'dd-MM-yyyy'),
      "flag":2
    }
    this.settings.loadingSpinner = true;

    this.commonService.nocreports(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;


      this.customerList=res['welcomelist']
      this.customerList2=res['welcomelist']

      this.dataSource=new MatTableDataSource(this.customerList)
      console.log(this.dataSource);
      }else{
        this.settings.loadingSpinner = false;

        this.displayMessage(res['status'].message, "Alert");
      }
      
    })
  }
  downloadall(customerList2){
      const dialogRef = this.dialog.open(WelcomedownloadComponent, {
        height: "80%",
        width: '80%',
        data: { funid: customerList2.loaN_ID}
      });
      dialogRef.afterClosed().subscribe(result => {
        if (this.customerList2.length !== 0) {
          this.downloadall(this.customerList2.shift())
        } else {
   
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
  changeIcon(element){

    const dialogRef = this.dialog.open(WelcomeLetterComponent, {
      height: "80%",
      width: '80%',
      data: { funid: element.loaN_ID}
    });
    dialogRef.afterClosed().subscribe(result => {

    })

  }


}
