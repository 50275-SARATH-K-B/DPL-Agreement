import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material';
import { CommonService } from '../../../services/report/common.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { SchemeCreationViewComponent } from '../scheme-creation-view/scheme-creation-view.component';

@Component({
  selector: 'app-scheme-creation-dashboard',
  templateUrl: './scheme-creation-dashboard.component.html',
  styleUrls: ['./scheme-creation-dashboard.component.scss']
})
export class SchemeCreationDashboardComponent implements OnInit {
  displayedColumns: string[] = 
  ['scheme_id', 'schemE_NAME', 'validitY_FROM', 'validitY_TO', 'status','view'];
  dataSource = new MatTableDataSource<any>([]);
  public settings: Settings;
  

  @ViewChild('paginator') paginator1: MatPaginator;
  constructor(
    public route: Router,
    public rout: ActivatedRoute,
    private formbuilder: FormBuilder,
    public datepipe: DatePipe,
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public commonService: CommonService
    ) { 
      this.settings = this.appSettings.settings;
     }

    schemeCreation: any=this.formbuilder.group({ 
      FromDate: ['',Validators.required], 
      ToDate: ['',Validators.required], 
    })



  ngOnInit() {
    sessionStorage.removeItem('schemeData')
    this.dataSource.paginator = this.paginator1;
  }


  searchapi(){
    this.settings.loadingSpinner = true;
    this.dataSource = new MatTableDataSource([]);
    setTimeout(()=>{
      this.dataSource.paginator = this.paginator1;
    },2);
    
    let params={
      "validitY_FROM1": this.datefunc(this.schemeCreation.controls.FromDate.value),
      "validitY_FROM2": this.datefunc(this.schemeCreation.controls.ToDate.value)
    }

    this.commonService.GetSchemaDetalisdashboard(params)
    .subscribe(res => {
      this.settings.loadingSpinner = false;
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {

        let data=res["schemalist"]
        this.dataSource = new MatTableDataSource(data);
        setTimeout(()=>{
          this.dataSource.paginator = this.paginator1;
        },200);

      
      }else{
        this.displayMessage(res["status"]["message"], "Alert");
        this.clearfunc()
      }
    })

  }
  datefuncc(ele){
    return ele.split(" ")[0]
  }

  displayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

    
  datefunc(date){
    let timezoneOffset = date.getTimezoneOffset();
    let adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
    let month=+adjustedDate.getMonth()+1
    let day=adjustedDate.getDate()
    let year=adjustedDate.getFullYear()
    return day + "/" + month + "/" + year
    }

  searchid:any;
  filter:any;
  filterSource(filterValue: string) {
    
    this.searchid =this.filter
    filterValue = filterValue.trim(); 
    filterValue = filterValue.toLowerCase(); 
    this.dataSource.filter = filterValue;
  }

  search(){
    this.searchid = this.filter.trim();  
    this.searchid = this.filter.toLowerCase(); 
    this.dataSource.filter = this.searchid;
  }

  view(data){
    this.dialog.open(SchemeCreationViewComponent, {
      width: "80%",
      height:"90%",
      data: { data: data}
    });
  }

  gotoapproval(element) {
      this.route.navigate(['/personal-report/SchemeApproval', { SchemeId: element.scheme_id }]);
  }
  edit(element){
    this.route.navigate(['/personal-report/schemeCreation', { flag: 1 }]);
    sessionStorage.setItem("schemeData",JSON.stringify(element))
  }

  valuecheck(ele){
    this.settings.loadingSpinner = true;
    if(ele=="ToDate" || ele=="FromDate"){
      let val1=this.schemeCreation.controls.FromDate.value
      let val2=this.schemeCreation.controls.ToDate.value
      // let date=new Date()
    //   if(!!val1){
    //   if(date>=val2){
    //     this.displayMessage("Please Enter Valid Scheme Start Date", "Alert");
    //     this.schemeCreation.controls.FromDate.setValue(undefined);
    //   }
    // }
      if(!!val1 && !!val2){
      if(val1>=val2){
        this.displayMessage("Please Enter Valid Scheme Start Date And End Date", "Alert");
        this.schemeCreation.controls.ToDate.setValue(undefined);
        this.schemeCreation.controls.FromDate.setValue(undefined);
        }
      }
    }
    this.settings.loadingSpinner = false;
}
clearfunc(){
  this.dataSource = new MatTableDataSource([]);
  setTimeout(()=>{
    this.dataSource.paginator = this.paginator1;
  },2);
}
}
