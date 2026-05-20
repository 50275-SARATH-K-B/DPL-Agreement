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
  selector: 'app-eligibility-approval',
  templateUrl: './eligibility-approval.component.html',
  styleUrls: ['./eligibility-approval.component.scss']
})
export class EligibilityApprovalComponent implements OnInit {
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
  // displayedColumns: string[] = ["SlNo","CustomerID","CustomerName","EligibilityAmount","InterestRate","CustomerCategory"];
  displayedColumns: string[] = ["SlNo","CustomerID","CustomerName","CustomerCategory","EligibilityAmount","InterestRate"];
  searchTypeList: any[];
  LoanSearchType: any;
   constructor(private leadService: LeadService, private assetService: AssetService, public appSettings: AppSettings,
    private commonService: CommonService, private atp: AmazingTimePickerService,private repaymentService: RepaymentService,
    private dialog: MatDialog,
    private smsVerification: SMSVerificationComponent,
    private route: ActivatedRoute) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData)
    this.onLoad();
    this.getScheduledList();
    }


  
  onLoad(){
    this.searchTypeList = [];
    let params= 
    {
      "FirmID": +this.userData['firmID'],
      "branchId": this.userData['branchID']
    }

  this.commonService.getLiveEligibilityData(params)
    .subscribe(result => {
      if (result['status'].code == 1)
        this.searchTypeList = result['custloanProperties'];
    },
      error => {
        console.log('There was an error: ')
      });
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
  loanSearch(){
    let params={
      "ExcelId": this.LoanSearchType
    }
    this.commonService.getEligibilityDetailsByID(params).subscribe(res=>{
      if(!!res && res['status'].code == 1){
      this.filelist =res['custloanProperties']    
      this.eligibilitySource = new MatTableDataSource<eligibilityElement>(this.filelist);
      this.visible = true;
      }
  

    },err=>{

    })
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
    const activityEntryDataUploadFormData ={
    
      "userId":  this.userData['empCode'],
      "FirmID": +this.userData['firmID'],
      "branchId": this.userData['branchID'],
      "ExcelId": +this.LoanSearchType
    }
    this.settings.loadingSpinner = true;
    this.repaymentService.postEligibilityDataApproval(activityEntryDataUploadFormData)
      .subscribe(result => {
        this.settings.loadingSpinner = false;
        if (result['status'].flag == 1 && result['status'].code == 1) {
          this.displayMessage(result['status'].message, "Success");
          this.clear(activityEntryDataUploadForm);
          this.onLoad();



        } else {
          this.displayMessage(result['status'].message, "Alert");
          this.clear(activityEntryDataUploadForm);
        }
      }, error => {
        this.settings.loadingSpinner = false;
        console.log('There was an error: ');
      })
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
