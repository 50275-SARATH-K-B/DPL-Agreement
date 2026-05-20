import { OnInit, Component } from "@angular/core";
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
import * as FileSaver from 'file-saver';  
export interface eligibilityElement {
  "SlNo" : any;
  "CustomerID" : any ;
  "CustomerName" : any;
  "EligibilityAmount" : any;
  "InterestRate" : any;
  "CustomerCategory" : any;
}

@Component({
  selector: 'app-enachresend',
  templateUrl: './enachresend.component.html',
  styleUrls: ['./enachresend.component.scss']
})
export class EnachresendComponent implements OnInit {
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
  roleid : any;
  employeePost: any;
  tlEmpPhoneNo: any;
  tlEmpEmailId: any;
  remarks: any;
  public settings: Settings;
  employeeName: any;
  pdtCategoryId : any ;
  productList: any;
  file: any;
  arrayBuffer: any;
  filelist: any[];
  scheduleList: any;
  scheduleDetails: any;
  scheduleActivity: any;
  phonenoList: any;
  eligibilitySource: any;
  visible : boolean = false ;
  displayedColumns: string[] = ["SlNo","CustomerID","CustomerName","EligibilityAmount","InterestRate","CustomerCategory"];
   constructor(private leadService: LeadService, private assetService: AssetService, public appSettings: AppSettings,
    private commonService: CommonService, private atp: AmazingTimePickerService,private repaymentService: RepaymentService,
    private dialog: MatDialog,
    private smsVerification: SMSVerificationComponent,
    private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.onLoad();
    this.getScheduledList();
    }


  
  onLoad(){
    // this.getAreaList();
    // this.getBranchList();
    // this.getProductList();
  }
   public getScheduledList(){
    // let params={
    //   firmid :this.userData['firmID'],
    //   FunctionID :1,
    //   ProductId : 1
    // }
    // this.leadService.getScheduledList(params).subscribe(res=>{
    //   if(!!res && res['status'].flag== 1){
    //      this.scheduleList = res['resultSet'];
    //   }
  
    // },err=>{
    //   console.log(err)
    // })
  }
  public onScheduleChange(scheduleActivity){
    // let params={
    //   firmid : this.userData['firmID'],
    //   FunctionID :1,
    //   ProductId : 1,
    //   ScheduleId : scheduleActivity
    // }
    // this.leadService.getScheduleDetails(params).subscribe(res=>{
    //   if(!!res && res['status'].flag== 1){
    //      this.scheduleDetails = res['schdetails'];
    //      console.log(this.scheduleDetails);
    //      this.areaName =  this.scheduleDetails[0].areA_ID.toString();
    //      this.branchName = this.scheduleDetails[0].brancH_ID.toString() ;
    //      this.pincode = this.scheduleDetails[0].pincode ;
    //      this.scheduleDate = this.scheduleDetails[0].schedulE_DATE;
    //      this.locality = this.scheduleDetails[0].locality;
    //      this.employeeCode = this.scheduleDetails[0].tL_EMP_CODE ;
    //      this.pdtCategoryId = this.scheduleDetails[0].producT_TYPE.toString();
    //      this.employeeName = this.scheduleDetails[0].tL_EMP_NAME ;
    //      this.tlEmpEmailId = this.scheduleDetails[0].tL_EMAIL_ID   ;
    //      this.employeePost = this.scheduleDetails[0].role ;
    //      this.tlEmpPhoneNo = this.scheduleDetails[0].tL_PHONE_NO ;

    //   }
  
    // },err=>{
    //   console.log(err)
    // })
  }

  public getAreaList() {
    let params ={
      TYPE_ID  : 3,
      TABLE_NAME  :'AREA_MASTER',
      DISPLAY_FIELD  :'AREA_NAME',
      VALUE_FIELD :'AREA_ID',
      FIRM_ID  :this.userData['firmID'],
      PRODUCT_ID  : 70,
      flag  : 1
    }
    this.commonService.getArea(params)
      .subscribe(
        result => {
          this.areaList = result['typeList'];
        },
        error =>
          console.log('There was an error: '),
      );

  }
  public getBranchList(): void {
    let params ={
      TYPE_ID  : 1,
      TABLE_NAME  :'BRANCH_MASTER',
      DISPLAY_FIELD  :'BRANCH_NAME',
      VALUE_FIELD :'BRANCH_ID',
      FIRM_ID  :this.userData['firmID'],
      PRODUCT_ID  : 70,
      flag  : 1
    }

    this.commonService.getArea(params)
    .subscribe(
      result => {
        this.branchList = result['typeList'];
      },
      error =>
        console.log('There was an error: '),
    );
  }
  public getProductList(): void {
    // let params ={
    //   FIRM_ID :this.userData['firmID'],
    //   flag  : 1
    // }

    // this.commonService.getProducts(params)
    // .subscribe(
    //   result => {
    //     this.productList = result['productList'];
    //   },
    //   error =>
    //     console.log('There was an error: '),
    // );
  }
  public getEmpDetails(empCode): void {
    // const params = {
    //   firmid: this.userData['firmID'],
    //   ProductId : 70,
    //   Empcode : empCode
    // }
    // this.leadService.getEmpDetails(params).subscribe(res => {
    //   if (!!res && res['status'].code == 1) {
    //    this.employeeName = res['schempdetails'][0].empname;
    //    this.employeePost = res['schempdetails'][0].rolename;  
    //    this.roleid =  res['schempdetails'][0].roleid;

    //   }
    // })
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
          this.displayMessage(result['status'].message, "Success");
          this.clear(activityEntryDataUploadForm);


        } else {
          this.displayMessage(result['status'].message, "Alert");
          this.clear(activityEntryDataUploadForm);
        }
      }, error => {
        this.settings.loadingSpinner = false;
        console.log('There was an error: ');
      })
  }
  addfile(event)     
  {    
  this.file= event.target.files[0];     
  let fileReader = new FileReader();    
  fileReader.readAsArrayBuffer(this.file);     
  fileReader.onload = (e) => {    
      this.arrayBuffer = fileReader.result;    
      var data = new Uint8Array(this.arrayBuffer);    
      var arr = new Array();    
      for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);    
      var bstr = arr.join("");    
      var workbook = XLSX.read(bstr, {type:"binary"});    
      var first_sheet_name = workbook.SheetNames[0];    
      var worksheet = workbook.Sheets[first_sheet_name];    
    //  console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));    
      this.phonenoList = (XLSX.utils.sheet_to_json(worksheet,{raw:true})); 
    let stringArray =[];
    var i = 1;
      this.phonenoList.forEach(element => {
      
        let phObj= {
           "customerID":element.CustomerID.toString(),
           "customerName":element.CustomerName.toString(),
           "csmName": "",
           "empCode": "",
           "eligibilityAmount":+element.EligibilityAmount.toString(),
           "recorD_NUMBER": i++,
           "interestRate": +element.InterestRate.toString(),
           "customerCategory":element.CustomerCategory.toString(),
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
      });
      console.log(stringArray);
        var arraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});     
            this.filelist = [];    
          //  console.log(this.filelist)    
          this.phonenoList= stringArray;    
          this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.phonenoList);
          this.visible = true;
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
