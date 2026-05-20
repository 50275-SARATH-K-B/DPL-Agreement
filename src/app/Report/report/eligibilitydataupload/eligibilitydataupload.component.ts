import { OnInit, Component, ElementRef } from "@angular/core";
import { LeadService } from "../../../services/LOS/lead.service";
import { AlertMessageComponenent } from "../../../commoncomponents/alertpopup/alertpopup.component";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Params } from "@angular/router";
import { CommonService } from "../../../services/common/common.service";
import { AmazingTimePickerService } from "amazing-time-picker";
import { SMSVerificationComponent } from "../../../common/sms-verification/sms-verification.component";
import { AssetService } from "../../../services/master/asset.service";
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { RepaymentService } from '../../../services/LMS/repayment.service';
import * as XLSX from 'xlsx';
import { ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';

import * as FileSaver from 'file-saver';
import { DatePipe } from "@angular/common";
import { ConditionalExpr } from "@angular/compiler";
import { Console } from "console";
export interface eligibilityElement {
  "SlNo": any;
  "CustomerID": any;
  "CustomerName": any;
  "EligibilityAmount": any;
  "InterestRate": any;
  "CustomerCategory": any;
}
@Component({
  selector: 'app-eligibilitydataupload',
  templateUrl: './eligibilitydataupload.component.html',
  styleUrls: ['./eligibilitydataupload.component.scss']
})
export class EligibilitydatauploadComponent implements OnInit {

  @ViewChild('document')
  myInputVariable: ElementRef;
    public userData: object;
    resultObj: Object;
    areaList: any;
    branchList: any[];
    areaName: any;
    activityName: any;
    branchName: any;
    pincode: any;
    scheduleDate: any;
    locality: any;
    employeeCode: any;
    roleid: any;
    employeePost: any;
    tlEmpPhoneNo: any;
    tlEmpEmailId: any;
    remarks: any;
    public settings: Settings;
    employeeName: any;
    pdtCategoryId: any;
    productList: any;
    file: any;
    arrayBuffer: any;
    filelist: any[];
    scheduleList: any;
    scheduleDetails: any;
    scheduleActivity: any;
    phonenoList: any;
    eligibilitySource: any;
    visible: boolean = false;
    displayedColumns: string[] = ["SlNo", "CUSTOMERID", "STATE", "LANGUAGE"];
    upload: boolean = false;
    constructor(private leadService: LeadService, private datePipe: DatePipe, private assetService: AssetService, public appSettings: AppSettings,
      private commonService: CommonService, private atp: AmazingTimePickerService, private repaymentService: RepaymentService,
      private dialog: MatDialog,
      private smsVerification: SMSVerificationComponent,
      private route: ActivatedRoute) {
      this.settings = this.appSettings.settings;
    }
  
    ngOnInit() {
      this.userData = this.commonService.getCredentials();
      console.log(this.userData);
      
      }
      exportexcel(id): void {
        /* table id is passed over here */
        let element = document.getElementById(id);
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
        /* save to file */
        XLSX.writeFile(wb, 'ELEGIBLE_DATA' + new Date().toLocaleDateString() + ".xlsx");
    
      }
    savedata(activityEntryDataUploadForm) {
      
      const activityEntryDataUploadFormData = {
  
        "FirmID": 1,
        "userId": this.userData['empCode'],
        "branchId": + this.userData['branchID'],
        "custdetails": this.phonenoList,
  
      }
      console.log(activityEntryDataUploadFormData)
      this.settings.loadingSpinner = true;
      this.repaymentService.postEligibilityData(activityEntryDataUploadFormData)
        .subscribe(result => {
          this.settings.loadingSpinner = false;
          if (result['status'].flag == 1 && result['status'].code == 1) {
            this.displayMessage(result['status'].message
            , "Success");
            this.clear(activityEntryDataUploadForm);
  
  
          } else {
            if(result['status'].message){
              this.displayMessage(result['status'].message, "Alert");
            }else{
              this.displayMessage("Please Check the Inserted Data", "Alert");
  
            }  
             this.clear(activityEntryDataUploadForm);
          }
        }, error => {
          this.settings.loadingSpinner = false;
          this.displayMessage("Please Check the Inserted Data", "Alert");
          this.clear(activityEntryDataUploadForm);
        })
    }
     trandformDate(dateString){ 
      var date = new Date(dateString);
      return new Date(date.setDate(date.getDate() + 1));
  }
    addfile(event) {
      
      this.settings.loadingSpinner = true;
  
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
          var data = new Uint8Array(this.arrayBuffer);
          var arr = new Array();
          for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
          var bstr = arr.join("");
          console.log(bstr)
          console.log(arr)
          var workbook = XLSX.read(bstr, { type: "binary",cellDates: true  });
          var first_sheet_name = workbook.SheetNames[0];
          var worksheet = workbook.Sheets[first_sheet_name];
          //  console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
          this.phonenoList = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
          let stringArray = [];
          var i = 1;
  
          console.log(this.phonenoList)
  
          this.phonenoList.forEach(element => {
          //  const date = new Date(+element.EligibilityupdatedDate);
          //  const offset = date.getTimezoneOffset();
          //  if (offset < 0) {
          //      date.setHours(12,0,0);
          //      console.log(true)
          //  }
          //  element.EligibilityupdatedDate instanceof Date
           var date = new Date()
  
            let phObj = {
              "customerID": element.CUSTOMERID.toString() ,
              "customerName":"",
              "csmName": "",
              "empCode": "",
              "eligibilityAmount":element.MAXAMOUNT.toString(),
              "recorD_NUMBER": i++,
              "interestRate": Math.round(element.INTERESTRATE),
              "customerCategory": "eligibledata",
              "bureauScore": 0,
              "currentEMI": 0,
              "eligibilityupdatedDate": this._rptdatePipe(this.trandformDate(element.UPDATEDDATE)),
              "estimatedIncome": 0,
              "tenure": 0,
              "customerprofile": "",
              "teamleader":"",
              "proccessingfee":0,
              "beauroname":""
            }
            stringArray.push(phObj);

            if(this.phonenoList.length == stringArray.length){
              this.upload = true
            }
          });

          this.settings.loadingSpinner = false;
          console.log(stringArray)
          var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          this.filelist = [];
          //  console.log(this.filelist)    
          this.phonenoList = stringArray;
          // this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
          // this.visible = true;
      } 
      }else{
        this.displayMessage("Please Upload File in Excel Format","Alert")
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
  
  
    public clear(followupForm) {
      this.myInputVariable.nativeElement.value = "";
      followupForm.resetForm();
      this.phonenoList = [];
      this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
      this.visible = false
    }
    public deleteTableItem(data): void {
      this.phonenoList.splice(data.index, 1);
      this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
    }
  
    displayMessage(message: string, type: string): any {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%',
        data: { message: message, type: type }
      });
    }

}
