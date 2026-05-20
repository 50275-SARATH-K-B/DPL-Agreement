import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { CommonService } from '../../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { FileviewComponent } from '../../../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-loan-account-approval',
  templateUrl: './loan-account-approval.component.html',
  styleUrls: ['./loan-account-approval.component.scss']
})
export class LoanAccountApprovalComponent implements OnInit {
  public settings: Settings;
  fromDate:any;
  toDate:any;
  death_date:any;
  deathCert:any="Death Certificate";
  legalCert:any="Legal Document";
  public deathsource = new MatTableDataSource([]);
  displayedColumns: any[] =['slno','custid','custname','loanId','deathdate','deathDoc','legalDoc','view'];
  requestedData: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(public commonService:CommonService,public datePipe:DatePipe,public dialog: MatDialog,
    private router: Router,public route:ActivatedRoute,public appSettings: AppSettings) {

      this.settings = this.appSettings.settings;

      this.route.params.subscribe(x =>{
        console.log(x)

        if(!!x['fromDate'] && !!x['toDate']){
            // Convert the date string to a Date object
        const toDate =  x['toDate'].split('/');
        const formattedDate = new Date(Number(toDate[2]), Number(toDate[1]) - 1, Number(toDate[0]));


        const frmDate = x['fromDate'].split('/')
        const formattedDate1 = new Date(Number(frmDate[2]), Number(frmDate[1]) - 1, Number(frmDate[0]));
        
          this.fromDate = formattedDate1
          console.log(this.fromDate)
          this.toDate = formattedDate

          console.log(this.toDate)
          this.getRequestedAccounts()
        }else {
          return;
        }

        if(Object.keys(x).length === 0){
          this.fromDate = null
          this.toDate = null
          this.deathsource=new MatTableDataSource([])
          this.deathsource.paginator = this.paginator;
         }

       })
       
     }

  ngOnInit() {
    this.commonService.session2()

  }
  ngAfterViewInit() {
    this.deathsource.paginator = this.paginator;
  }

  getRequestedAccounts(){
    this.settings.loadingSpinner = true;
    let params = {
      "fromDATE": this.datePipe.transform(this.fromDate,'dd/MM/yyyy'),
      "toDate": this.datePipe.transform(this.toDate,'dd/MM/yyyy')
    }
    console.log(params)
    this.commonService.getLoanAccountUpdReq(params).subscribe(res=> {
      console.log(res)
      if(res['status']['flag'] == 1 && res['status']['code'] == 1){
        this.settings.loadingSpinner = false;
        this.requestedData = res['loanlist']
        this.deathsource = new MatTableDataSource(this.requestedData)
        this.deathsource.paginator = this.paginator;
      }else{
        this.displayMessage('No data Found','Alert')
      }
    })
  }

  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });
  }

  viewDocumentImage1(data){
    console.log(data)
    let exten = data['deathCertificate'].substring(0, 3)
    let dataI = {
      file: data.deathCertificate,
      exte: exten == 'JVB' ? 'pdf' : exten == '/9j' ? 'jpg' : exten == 'iVB' ? 'png' : 'jpeg',
      isView: true,
      id:1,
      file_name:data.customer_name
    };
    let mobilewidth = "50%";
    let mobileheight = "50%";
    
    const dialogRef = this.dialog.open(FileviewComponent, {
      data:dataI,
      width: mobilewidth,
      height: mobileheight,
    });
   
      
  }

  viewDocumentImage2(data){
    let exten = data['legalCertificate'].substring(0, 3)
      let dataI = {
        file: data.legalCertificate,
        exte: exten == 'JVB' ? 'pdf' : exten == '/9j' ? 'jpg' : exten == 'iVB' ? 'png' : 'jpeg',
        isView: true,
        id:2,
        file_name:data.customer_name

      };
      let mobilewidth = "50%";
      let mobileheight = "50%";
      
      const dialogRef = this.dialog.open(FileviewComponent, {
        data:dataI,
        width: mobilewidth,
        height: mobileheight,
      });
  }

  view(element){
    this.commonService.setSelectedRow(element);
    this.router.navigate(['/personal-report/req-view',{fromDate:this.datePipe.transform(this.fromDate,'dd/MM/yyyy'),
      toDate:this.datePipe.transform(this.toDate,'dd/MM/yyyy')}])
  }

}
