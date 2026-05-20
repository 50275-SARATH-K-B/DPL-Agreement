import { Component, OnInit, ViewChild } from '@angular/core';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';
import { CommonService } from '../../../services/report/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { FileviewerComponent } from '../fileviewer/fileviewer.component';
import { NgForm } from '@angular/forms';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';

export interface accountElement {
  LoanID: any;
  WaiverAmount: any;
  EnteredDate: any;
  Description: any;
}
var ACCOUNT_DATA: accountElement[] = [];
@Component({
  selector: 'app-waiver-approval',
  templateUrl: './waiver-approval.component.html',
  styleUrls: ['./waiver-approval.component.scss']
})
export class WaiverApprovalComponent implements OnInit {
  public settings: Settings;
  userData: object  ;
  LoanId: any;
  reasonArray: any[];

  loanID: string;
  data: any;
  public SuccessDataSource = new MatTableDataSource<any>();

  addressLines: string[] = [];
  showFlag: boolean = false;
  date2: any;
  accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);

  funID: any;
  FileName: any;
  Reasoncode: any;

  waiverListDetail: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  branchList: any;
  customerList: any;
  applicationId: any;
  branchID: any;
  resultObj: any;
  requesteD_BY: any;
  requesteD_NAME: any;
  FileExte: any;
  FileData: any;
  FileDataType: any;
  ext: string;
  ReasonList: any[] = [];
  ApprovalList: any[] = [];
  constructor(public dialog: MatDialog, public appSettings: AppSettings, private commonService: CommonService, public route: ActivatedRoute) {this.settings = this.appSettings.settings; }

  ngOnInit() {
    this.accountSource = new MatTableDataSource<accountElement>([]);
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.onLoad();
    this.GetCommonReason();
    this.route.params.subscribe((params: Params) => {

    if (!!params && !!params['loanid']) {
      this.funID = params['funID'];
      this.applicationId = params['Application'];
      this.branchID = this.userData['branchID']
      this.applicationId = params['Application'];
      this.getWaiverDetails();
      this.getCustList();
    }
  })
  }
  onLoad() {
    this.settings.loadingSpinner = true;
    this.commonService.getBranchesList({ FIRM_ID: 1 }).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (res['status'].code == 1) {
        this.branchList = res['branchList'];
      }
    })
  }
  public getCustList() {
    this.settings.loadingSpinner = true;
    // ACCOUNT_DATA = [];
    // this.accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);
    this.customerList = undefined;
    let params = {
      FIRM_ID: 1,
      BRANCH_ID: this.userData['branchID']
    }
    this.settings.loadingSpinner = false;
    this.commonService.getCustLists(params)
      .subscribe(
        result => {
          this.settings.loadingSpinner = false;
          this.customerList = result['custList'];
          console.log(this.customerList);
        },
        error => {
          this.settings.loadingSpinner = false;
          console.log('There was an error: ');
        }
      );

  }
  public getWaiverDetails() {
    
    ACCOUNT_DATA = [];
    this.accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);
    let params = {
      FIRM_ID: 1,
      BRANCH_ID: this.userData['branchID'],
      Application_ID: this.applicationId
    }
    this.settings.loadingSpinner = true;
    this.commonService.GetWaiverDetails(params)
      .subscribe(
        result => {
          this.settings.loadingSpinner = false;
          if (result['status'].code == 1 && result['status'].flag == 1) {
            ;
            this.resultObj = result['waiveList'];
            ACCOUNT_DATA = this.resultObj;
            console.log(ACCOUNT_DATA);
            
            this.accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);
            console.log(ACCOUNT_DATA)
            this.FileName= result['waiveList'][0]["attachemenT_NAME"]
            this.requesteD_BY=result['waiveList'][0]["requesteD_BY"]
            this.requesteD_NAME=result['waiveList'][0]["requesteD_NAME"]

            this.FileExte = result["waiveList"][0]["attachemenT_EXTENSION"];
            this.FileData = result["waiveList"][0]["attachement"];
            this.FileDataType = result["waiveList"][0]["attachemenT_TYPE"];
            
            if (this.FileExte == "xlsx") {
              const byteCharacters = atob(this.FileData);
              const bstr: string = byteCharacters
              const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  
              /* grab first sheet */
              const wsname: string = wb.SheetNames[0];
              const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
              /* save data */
              this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
            }
          }
          else {
            this.displayMessage(result['status'].message, "Alert")
            this.branchID = undefined;
            this.applicationId = undefined;
          }
        });
  }
  public displayLoanSearchPopup(): void {
        const dialogRef = this.dialog.open(LoanSearchComponent, {
          height: "80%",
          width: '75%',
    
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (result.loanItem.LoanStatus == 0) {
              this.displayMessage("Loan Already Closed", "Success");
            } else {
              this.LoanId = result.loanItem.LoanId;
              this.date2 = new Date();
              this.waiverListDetail = [];
              this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);
              setTimeout(() => {
                this.SuccessDataSource.paginator = this.paginator;
              }, 250);
            }
          }
    
        });
      }
      onChangeFile(event) {

        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(event.target);
        if (target.files.length !== 1) throw new Error('Cannot use multiple files');
        reader = new FileReader();
     
    
        if (event.target.files && event.target.files[0]) {
          let temp = event.target.files[0];
          console.log('File size', event.target.files[0].size)
          this.FileName = temp.name;
          let nameArray = temp.name.split('.');
          let extension = nameArray[nameArray['length'] - 1];
          this.FileExte = extension;
          if (extension == "xlsx") {
            let pdf = event.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(pdf);
            reader.onload = (event: any) => {
              var pdf_url = event.target.result;
              console.log("Type", typeof (event.target.result))
              this.FileDataType = pdf_url.split(',')[0]
              this.FileData = pdf_url.split(',')[1];
              this.ext = "pdf"
              var pdf_name = temp.name;
              reader.onload = (e: any) => {
                /* read workbook */
                const bstr: string = e.target.result;
                const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          
                /* grab first sheet */
                const wsname: string = wb.SheetNames[0];
                const ws: XLSX.WorkSheet = wb.Sheets[wsname];
          
                /* save data */
                this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
                console.log(this.data);
              };
              reader.readAsBinaryString(target.files[0]);
            }
          }
          else if (extension == "pdf") {
            let pdf = event.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(pdf);
            reader.onload = (event: any) => {
              var pdf_url = event.target.result;
              console.log("Type", typeof (event.target.result))
              this.FileDataType = pdf_url.split(',')[0]
              this.FileData = pdf_url.split(',')[1];
              this.ext = "pdf"
              var pdf_name = temp.name;
              console.log('event', temp);
            }
          } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
            let photo = event.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(photo);
            reader.onload = (event: any) => {
              this.FileData = event.target.result;
              this.FileDataType = this.FileData.split(',')[0]
              this.FileData = this.FileData.split(',')[1];
              this.ext = "jpg"
            }
          }
        }
      }
     
      displayMessage(msg: string, type: string) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '35%',
          data: { message: msg, type: type }
        });
      }
      OpenFile(): any {
        // let element=this.resultObj[0]
        // console.log(element);
        // let file=element.attachement
        // let type=element.attachemenT_TYPE
        // let ext=element.attachemenT_EXTENSION
        
        // if (ext == "xlsx") {
        //   const byteCharacters = atob(this.FileData);
        //   const bstr: string = byteCharacters
        //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
    
        //   /* grab first sheet */
        //   const wsname: string = wb.SheetNames[0];
        //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    
        //   /* save data */
        //   this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
        // }
    
        if (!!this.FileData) {
          var data = {
            "isView": true,
            "exte": this.FileExte,
            'file': this.FileData,
            'Filetype': this.FileDataType,
            "execl": this.data
          };
          let mobilewidth = "50%";
          let mobileheight = "auto";
          if (window.innerWidth < 599) {
            mobilewidth = "95%";
            mobileheight = "75%";
          }
          const dialogRef = this.dialog.open(FileviewerComponent, {
            data: data,
            width: mobilewidth,
            height: mobileheight,
          });
        }
      }
      save(statusID, waiverEntryForm: NgForm) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          height: '30%'
        });
    
        dialogRef.afterClosed().subscribe(dialogResult => {
          console.log(dialogResult)
          if (dialogResult == true) {
            for (var i = 0; i < this.resultObj.length; i++) {
              let data = {
                WAIVE_ID: this.resultObj[i].WAIVE_ID,
                FirmID: this.userData['firmID'],
                BranchID: this.userData['branchID'],
                UserID: this.userData['empCode'].toString(),
                ApplicationID: this.resultObj[i].application_id,
                StatusID: statusID,
                ReasonCode: this.Reasoncode
              }
              this.ApprovalList.push(data)
            }
    
            let params = {
              waivedataList: this.ApprovalList
            }
            this.settings.loadingSpinner = true;
            // if(waiverEntryForm.valid){
            this.commonService.WaiverApprovals(params)
              .subscribe(
                result => {
                  this.settings.loadingSpinner = false;
                  if (!!result && result['status'].code == 1) {
                    this.displayMessage(result['status'].message, "Success");
                    ACCOUNT_DATA = [];
                    this.accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);
                    this.branchID = undefined;
                    this.applicationId = undefined;
                    this.Reasoncode = undefined;
                  }
                  else {
                    this.displayMessage(result['status'].message, "Alert")
                  }
                },
                error => {
                  this.settings.loadingSpinner = false;
                }
              )
            // }
          }
        })
    
      }
      clearForm() {
        this.branchID = undefined;
        this.applicationId = undefined;
        this.Reasoncode = undefined;
        ACCOUNT_DATA = [];
        this.accountSource = new MatTableDataSource<accountElement>(ACCOUNT_DATA);
      }
      GetCommonReason() {
        // ;
        let param = {
          FIRM_ID: this.userData['firmID'],
          PRODUCT_ID: 69,
          "ReasonId": 3
        }
        this.commonService.GetCommonReason(param).subscribe(result => {
          console.log(result);
          this.ReasonList = result['reasonlist']
        })
      }
    

}




