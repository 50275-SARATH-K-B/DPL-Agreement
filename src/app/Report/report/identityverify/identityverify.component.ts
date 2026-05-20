import { Component, OnInit,Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/report/common.service';
@Component({
  selector: 'app-identityverify',
  templateUrl: './identityverify.component.html',
  styleUrls: ['./identityverify.component.scss']
})
export class IdentityverifyComponent implements OnInit {
  public field: any = null;
  public dataSource1 = new MatTableDataSource([]);

  displayedColumns: any[] =
  [
    'slno',
    'custid',
    'adharid',
    'panId',
    "Status"
   
    
  ];
 

  
  public dataSource = new MatTableDataSource([]);searchid: any;
  filter: any;
;
  customerList: any[]=[];
  constructor(public dialog: MatDialog,private commonService: CommonService,private router:Router) { }

  ngOnInit(): void {
    this.field = {
      dueDate: '',
      presentationDate: '',
    }
    // this.getcustdaetails()
  }
  getInstallmentdetailsByDate(){

  }
  filterSource(filterValue: string) {
    
    this.searchid =this.filter
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  search(){
    
    this.searchid = this.filter.trim(); // Remove whitespace
    this.searchid = this.filter.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = this.searchid;
  }
  getcustdaetails(){
    let params = {
      "From_dt":this._rptdatePipe(this.field['dueDate']),
      "To_dt":this._rptdatePipe(this.field['presentationDate'])
      
    }
    this.commonService.getcustdeta(params).subscribe(res=>{
      if (res['status'].code == 1 && res['status'].flag == 1) {
      console.log(res['custList']);
      this.customerList=res['custList']
      this.dataSource=new MatTableDataSource(this.customerList)
      console.log(this.dataSource);
      }else{
        this.displayMessage(res['status'].message, "Alert");
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
  viewDocumentImage(element){
    console.log(element);

    let custid=element.CustomerID
    let pan=element.PANNo
    let adhar=element.AadharNo
    console.log(custid);
    


    this.router.navigate(['/personal-report/identity-view',{param:custid,param1:pan, param2:adhar}])

    
  }

}
