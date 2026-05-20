import { Component, OnInit ,inject, ElementRef, ViewChild} from '@angular/core';

import * as XLSX from 'xlsx';

import { MatDialog, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { RepaymentService } from '../../../services/LMS/repayment.service';
import { CommonService } from '../../../services/common/common.service';
import { DatePipe } from '@angular/common';
import { Settings } from 'electron';
import { EnachService } from '../../../services/report/enach.service';
import { AppSettings } from '../../../app.settings';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';

export interface enachElement {
  // "SlNo": any;
  "customerID": any;
  "customerName": any;
  "customerprofile": any;
  "eligibilityAmount": any;
 
}

@Component({
  selector: 'app-excelupload',
  templateUrl: './excelupload.component.html',
  styleUrls: ['./excelupload.component.scss']
})
export class ExceluploadComponent implements OnInit {
  @ViewChild('document')

  myInputVariable: ElementRef;

  datesdata: any = new Date();
  userData: any;
  date: any;
  value_date: Date;
  phonenoList: any;
  enachSource: any;
  file: any;
  arrayBuffer: any;
  
  filelist: any[];
  visible: boolean = false;
  public settings: Settings;
  public disabled: boolean = false;


  displayedColumns: string[] = ["customerID", "customerName","customerprofile", "eligibilityAmount"];
  successlist: any[]=[];
  failedlist: any[]=[];

  constructor(private repaymentService: RepaymentService,
    private enachService: EnachService,
    private dialog: MatDialog,
    private commonService: CommonService,
    private datepipe: DatePipe,
    public appSettings: AppSettings,) {
    // this.settings = this.appSettings.settings;

  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

  }
  exportexcel(id): void {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'Enach_Upload' + new Date().toLocaleDateString() + ".xlsx");

  }
  getDatePipe(date) {
    let fullDate = new Date(date);
    let month = fullDate.getMonth() + 1;
    return (month > 9 ? month : ('0' + month)) + '-' + fullDate.getDate() + '-' + fullDate.getFullYear();
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
    return date.getDate() + '/' + months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
 
  public clear(followupForm) {
    this.failedlist = []
    this.successlist = []
    this.disabled = false
    this.myInputVariable.nativeElement.value = "";
    followupForm.resetForm();
    this.phonenoList = [];
    this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
    this.visible = false
  }
  public deleteTableItem(data): void {
    this.phonenoList.splice(data.index, 1);
    this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
  }

  trandformDate(dateString) {
    var date = new Date(dateString);
    return new Date(date.setDate(date.getDate() + 1));
  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
  savedata(activityEntryDataUploadForm) {
    const activityEntryDataUploadFormData = {

      "FirmID": +this.userData['firmID'],
      "userId": this.userData['empCode'],
      "branchId": + this.userData['branchID'],
      "custdetails": this.phonenoList,

    }
   
    this.repaymentService.postEligibilityData(activityEntryDataUploadFormData)
      .subscribe(result => {
       ;
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
      
        this.displayMessage("Please Check the Inserted Data", "Alert");
        this.clear(activityEntryDataUploadForm);

        console.log('There was an error: ',error);
      })
  }

  addfile(event) {
    this.phonenoList = [];
    this.enachSource= new MatTableDataSource<enachElement>(this.phonenoList);
    this.file = event.target.files[0];
    let extension = this.file.name.split('.');
    extension = extension[extension['length'] - 1]
    console.log(extension)
    if (extension == 'xlsx') {
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
        var workbook = XLSX.read(bstr, { type: "binary", cellDates: true });
        var first_sheet_name = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[first_sheet_name];
        //  console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
        this.phonenoList = (XLSX.utils.sheet_to_json(worksheet, { raw: true }));
        let stringArray = [];
        var i = 1;
        console.log(this.phonenoList)
        this.phonenoList.forEach(element => {
          console.log(element);
          

          let phObj = {
           
          
            "customerID": element.Loan_ID,
            "customerName": element.Customer_Name,
            "csmName": "",
            "empCode": "",
            "eligibilityAmount": element.Amount,            
            "recorD_NUMBER": "",
            "interestRate": 0,
            "customerCategory": "",
            "bureauScore": 0,
            "currentEMI": 0,
            "eligibilityupdatedDate":this._rptdatePipe(new Date()),
            "estimatedIncome": 0,
            "tenure": 0,
            "customerprofile":  element.Description,
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
        this.enachSource = new MatTableDataSource<enachElement>(this.phonenoList);
        this.visible = true;

      }
    } else {
      this.displayMessage("Please Upload File in Excel Format", "Alert")
    }
  }


}
