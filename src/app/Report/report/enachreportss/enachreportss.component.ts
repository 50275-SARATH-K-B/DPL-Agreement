import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/report/common.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-enachreportss',
  templateUrl: './enachreportss.component.html',
  styleUrls: ['./enachreportss.component.scss']
})
export class EnachreportssComponent implements OnInit {
  filter:any
  public field: any = null;
  customerList: any[]=[];
  public settings: Settings;

  public dataSource = new MatTableDataSource([]);
  searchid: any;
  displayedColumns: any[] =['slno',"LoanID",'custid',"duedate","resubmission_category","first_submissiondate","Resubmission_date"];
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
      "fromDate":this._rptdatePipe(this.field['dueDate']),
      "toDate":this._rptdatePipe(this.field['presentationDate']),
    }
    this.commonService.enachreports(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
      this.customerList=res['dataList']
   
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
