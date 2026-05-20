import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-deathreport',
  templateUrl: './deathreport.component.html',
  styleUrls: ['./deathreport.component.scss']
})
export class DeathreportComponent implements OnInit {
  dueDate: any;
  presentationDate: any;
  kycdetails: any[]=[];
  public dataSource = new MatTableDataSource([]);
  displayedColumns: any[] =['slno','loanid','cusnames','deathdates',"nominname","nominaddre","claimsaddr","claimamt","insurenumb","claimstatusdte","remarkss1","remarkss"];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private commonService: CommonService,public dialog: MatDialog,public datePipe:DatePipe) { }

  ngOnInit() {
    this.commonService.session2()

  }
  getKycdetails(){


    let params = {
      start_Date: this._rptdatePipe(this.dueDate),
      end_Date: this._rptdatePipe(this.presentationDate),
    }
    this.commonService.deathreport(params).subscribe(res => {
  console.log(res)
  
   this.kycdetails = res['report']

   if(this.kycdetails != null){

      this.dataSource=new MatTableDataSource(this.kycdetails)
      console.log(this.dataSource)
      this.dataSource.paginator = this.paginator;
   }else{
      this.displayMessage('No Data Found','Alert')
   }
   
    })
  }
  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

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
}
