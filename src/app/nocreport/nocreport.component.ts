import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { NOCComponent } from '../Report/report/noc/noc.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-nocreport',
  templateUrl: './nocreport.component.html',
  styleUrls: ['./nocreport.component.scss']
})
export class NocreportComponent implements OnInit {
  filter:any
  public field: any = null;
  customerList: any[]=[];
  public settings: Settings;

  public dataSource = new MatTableDataSource([]);
  searchid: any;
  displayedColumns: any[] =['slno',"LoanID","settleddate","view"];
  selected2:any
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
    let params = {
      "Start_Date":this.datePipe.transform(this.field['dueDate'],'dd/MM/yyyy'),
      "End_Date":this.datePipe.transform(this.field['presentationDate'],'dd/MM/yyyy'),
      "flag":1

    }
    this.settings.loadingSpinner = true;

    this.commonService.nocreports(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;


      this.customerList=res['closedloan']
   
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
  changeIcon(element){

    const dialogRef = this.dialog.open(NOCComponent, {
      height: "90%",
      width: '90%',
      data: { funid: element.loan_no}
    });
    dialogRef.afterClosed().subscribe(result => {

    })

  }

}
