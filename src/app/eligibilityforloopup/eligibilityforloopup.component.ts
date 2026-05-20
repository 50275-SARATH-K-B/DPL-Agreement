import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { MatDialog, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { RepaymentService } from '../services/LMS/repayment.service';
import { CommonService } from '../services/common/common.service';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { EnachService } from '../services/report/enach.service';
export interface eligibilityElement {
  "SlNo": any;
  "CustomerID": any;
  "CustomerName": any;
  "EligibilityAmount": any;
  "InterestRate": any;
  "CustomerCategory": any;
}
@Component({
  selector: 'app-eligibilityforloopup',
  templateUrl: './eligibilityforloopup.component.html',
  styleUrls: ['./eligibilityforloopup.component.scss']
})
export class EligibilityforloopupComponent implements OnInit {
  userData: any;
  public settings: Settings;
  phonenoList: any;
  file: any;

  @ViewChild('document')
myInputVariable: ElementRef;
eligibilitySource: any;
visible: boolean = false;
arrayBuffer: any;

displayedColumns: string[] = ["SlNo", "CustomerID", "CustomerName", "EligibilityAmount", "InterestRate", "CustomerCategory"];
  filelist: any[];
  constructor(private datePipe: DatePipe,  public appSettings: AppSettings,
    private commonService: CommonService, private repaymentService: RepaymentService,
    private dialog: MatDialog,
   
    ) {    this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();

  }
  addfile(event) {
    
    this.phonenoList= [];
    this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
    this.file = event.target.files[0];
    let extension = this.file.name.split('.');
    extension = extension[extension['length'] - 1]
    console.log(extension)
    if(extension == 'xlsx'){
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(this.file);
      fileReader.onload = (e) => {
        this.arrayBuffer = fileReader.result;
        let data = new Uint8Array(this.arrayBuffer);
        let arr = new Array();
        for (let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        let bstr = arr.join("");
        console.log(bstr)
        console.log(arr)
        let workbook = XLSX.read(bstr, { type: "binary",cellDates: true  });
        let first_sheet_name = workbook.SheetNames[0];
        let worksheet = workbook.Sheets[first_sheet_name]; 
        this.phonenoList = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        let stringArray = [];
        let i = 1;
        console.log(this.phonenoList)
        this.phonenoList.forEach(element => {
         console.log(element.EligibilityupdatedDate)
         
          let phObj = {
            "customerID":  element.CUSTOMERID.toString(),
            "customerName": element.CUSTNAME.toString(),
            "csmName": element.CSMNAME.toString(),
            "empCode": element.EMPCODE.toString(),
            "eligibilityAmount":  +element.ELIGIBILITY.toString(),
            "recorD_NUMBER": i++,
            "interestRate": +element.INTERESTRATE.toString(),
            "customerCategory": element['Category(Normal/ Prompt-DPL/Prpmpt-Others)'].toString(),
            "bureauScore": element.BureauScore.toString(),
            "currentEMI": element.CurrentEMI.toString(),
            "eligibilityupdatedDate": this._rptdatePipe(this.trandformDate(element.EligibilityupdatedDate)),
            "estimatedIncome": element.EstimatedIncome.toString(),
            "tenure": element.TENURE.toString(),
            "customerprofile": element.CUSTOMERPROFILE.toString()
          }
          
          stringArray.push(phObj);
          console.log(stringArray)
        });
        let arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        this.filelist = [];
        this.phonenoList = stringArray;
        this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
        this.visible = true;
    } 
    }else{
      this.displayMessage("Please Upload File in Excel Format","Alert")
    }
  }
  savedata(activityEntryDataUploadForm) {
for(let i=0;i<this.phonenoList.length - 1;i++){
  let data = []
  data[0] = this.phonenoList[i]
  const activityEntryDataUploadFormData = {

    "FirmID": +this.userData['firmID'],
    "userId": this.userData['empCode'],
    "branchId": + this.userData['branchID'],
    "custdetails": data,

  }
  this.settings.loadingSpinner = true;
  this.repaymentService.postEligibilityData(activityEntryDataUploadFormData)
    .subscribe(result => {

      this.settings.loadingSpinner = false;
      if (result['status'].flag == 1 && result['status'].code == 1) {
        this.displayMessage(result['status'].message +" " + data[0]['customerID']
        , "Success");
        data = []

      } else {
        const activityEntryDataUploadFormData = {

          "FirmID": +this.userData['firmID'],
          "userId": this.userData['empCode'],
          "branchId": + this.userData['branchID'],
          "custdetails": data,
      
        }
        this.settings.loadingSpinner = true;
        this.repaymentService.postEligibilityData(activityEntryDataUploadFormData)
          .subscribe(result => {
      
            this.settings.loadingSpinner = false;
            if (result['status'].flag == 1 && result['status'].code == 1) {
              this.displayMessage(result['status'].message +" " + data[0]['customerID']
              , "Success");
              data = []

            } else {
              if(result['status'].message){
                this.displayMessage("Please upload again" +" " + data[0]['customerID'], "Alert");
                data = []
                
              }
              data = []

            }
          }, error => {
            this.settings.loadingSpinner = false;
            this.displayMessage("Please upload again" +" " + data[0]['customerID'], "Alert");
            data = []
          })
          
      }
    }, error => {
      const activityEntryDataUploadFormData = {

        "FirmID": +this.userData['firmID'],
        "userId": this.userData['empCode'],
        "branchId": + this.userData['branchID'],
        "custdetails": data,
    
      }
      this.settings.loadingSpinner = true;
      this.repaymentService.postEligibilityData(activityEntryDataUploadFormData)
        .subscribe(result => {
    
          this.settings.loadingSpinner = false;
          if (result['status'].flag == 1 && result['status'].code == 1) {
            this.displayMessage(result['status'].message +" " + data[0]['customerID']
            , "Success");
            data = []

    
    
          } else {
           
              this.displayMessage("Please upload again" +" " + data[0]['customerID'], "Alert");
              data = []

          }
        }, error => {
          this.settings.loadingSpinner = false;
          this.displayMessage("Please upload again" +" " + data[0]['customerID'], "Alert");
          data = []
        })
        
    })
    
}
 
  }
  public clear(followupForm) {
    this.myInputVariable.nativeElement.value = "";
    followupForm.resetForm();
    this.phonenoList = [];
    this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
    this.visible = false
  }
   trandformDate(dateString){ 
    let date = new Date(dateString);
    return new Date(date.setDate(date.getDate() + 1));
}
private _rptdatePipe(DateValue) {
  let date = new Date(DateValue);
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

 return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
}
displayMessage(message: string, type: string): any {
  const dialogRef = this.dialog.open(AlertMessageComponenent, {
    width: '30%',
    data: { message: message, type: type }
  });
}
}
