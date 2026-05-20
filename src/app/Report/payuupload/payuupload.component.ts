import { OnInit, Component, ElementRef } from "@angular/core";
import { LeadService } from "../../services/LOS/lead.service";
import { AlertMessageComponenent } from "../../commoncomponents/alertpopup/alertpopup.component";
import { MatDialog, MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Params } from "@angular/router";
import { CommonService } from "../../services/common/common.service";
import { AmazingTimePickerService } from "amazing-time-picker";
import { SMSVerificationComponent } from "../../common/sms-verification/sms-verification.component";
import { AssetService } from "../../services/master/asset.service";
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { RepaymentService } from '../../services/LMS/repayment.service';
import * as XLSX from 'xlsx';
import { ViewChild } from '@angular/core';
export interface eligibilityElement {
  "SlNo": any;
  "CustomerID": any;
  "CustomerName": any;
  "EligibilityAmount": any;
  "InterestRate": any;
  "CustomerCategory": any;
}
@Component({
  selector: 'app-payuupload',
  templateUrl: './payuupload.component.html',
  styleUrls: ['./payuupload.component.scss']
})
export class PayuuploadComponent implements OnInit {

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
    displayedColumns: string[] = ["SlNo", "TransactionID","Amount"];
    constructor(private leadService: LeadService, private assetService: AssetService, public appSettings: AppSettings,
      private commonService: CommonService, private atp: AmazingTimePickerService, private repaymentService: RepaymentService,
      private dialog: MatDialog,
      private smsVerification: SMSVerificationComponent,
      private route: ActivatedRoute) {
      this.settings = this.appSettings.settings;
    }
  
    ngOnInit() {
      this.userData = this.commonService.getCredentials();
      this.commonService.session2()

      }
    savedata(activityEntryDataUploadForm) {
      
      const activityEntryDataUploadFormData = {
  
        "FirmID": +this.userData['firmID'],
        "userId": this.userData['empCode'],
        "branchId": + this.userData['branchID'],
        "custdetails": this.phonenoList,
  
      }
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

          console.log('There was an error: ',error);
        })
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
           
            let phObj = {
              "customerID":   element.TransactionID,
              "customerName": "",
              "csmName": "",
              "empCode": "",
              "eligibilityAmount": element.Amount,
              "recorD_NUMBER": "",
              "interestRate": 0,
              "customerCategory":"",
              "bureauScore": 0,
              "currentEMI": 0,
              "eligibilityupdatedDate": this._rptdatePipe(new Date()),
              "estimatedIncome": 0,
              "tenure": 0,
              "customerprofile": "",
              "teamleader":"",
              "proccessingfee":0,
              "beauroname":""
            }
            
            stringArray.push(phObj);
            console.log(stringArray)
          });
          var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          this.filelist = [];
          //  console.log(this.filelist)    
          this.phonenoList = stringArray;
          this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
          this.visible = true;
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
