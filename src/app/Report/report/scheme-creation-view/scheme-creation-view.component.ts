import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/report/common.service';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import {  Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-scheme-creation-view',
  templateUrl: './scheme-creation-view.component.html',
  styleUrls: ['./scheme-creation-view.component.scss']
})
export class SchemeCreationViewComponent implements OnInit {
  schemeCreation: any=this.formbuilder.group({
    product:  [''], 
    schemeId:  [''],
    schemetype:  [''], 
    val1:  [''], 
    val2:  [''], 
    loanAmount1:  [''], 
    loanAmount2:  [''], 
    cibilScore:  [''], 
    interestRate:  [''], 
    processingFee:  [''], 
    tenure1:  [''], 
    tenure2:  [''], 
    schemeName: [''], 
    FromDate: [''], 
    ToDate: [''], 
    requesterName:  [''],
    requesterId:  [''],    
    requestedDate:  [''],    
    remarks:  [''],   
    approverRejectorName:  [''], 
    approvedRejectorDate:  [''],    
    approverRejectorId:  [''],    
  })

  schemetypeData:any=[
    {name:"District",id:"1"},
    {name:"Pincode",id:"2"}
  ]
  placeholderval2:any="District"
  placeholderval1:any="State"

  DistrictList:any=[]
  StateList:any=[]
  CibilList:any=[]
  TenureList:any=[]

  userData:any;
  public settings: Settings;

  constructor(
    public route: Router,
    public rout: ActivatedRoute,
    private formbuilder: FormBuilder,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    public appSettings: AppSettings,
    public commonService: CommonService,
    private router: ActivatedRoute,
    public dialogRef: MatDialogRef<AlertMessageComponenent>,
    @Inject(MAT_DIALOG_DATA) public dataList: any) {
      dialogRef.disableClose = true; 
      this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.userData=this.commonService.getCredentials()
    this.commonmasterdata()
  }

  commonmasterdata(){
    this.settings.loadingSpinner = true;
    let params = {
      FIRM_ID : 1,
      COMMON_DATA_TYPE_ID : 1
    }
    this.commonService.getcommonmaster(params)
      .subscribe(res => {
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          this.TenureList=res["commonDataList"].sort((a, b) => +a.CommonDataName - +b.CommonDataName);
        }
         let params = {
          FIRM_ID : 1,
          COMMON_DATA_TYPE_ID : 2
        }
        this.commonService.getcommonmaster(params)
          .subscribe(res => {
            if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
              this.CibilList=res["commonDataList"].sort((a, b) => a.CommonDataID - b.CommonDataID);
            }
           let params = {
              flag : 1,
              countryID : 1
            }
            this.commonService.statedetails(params)
              .subscribe(res => {
                this.settings.loadingSpinner = false;
                if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
                  this.StateList=res["stateList"]
                  this.search()
                }
              })
          })
      })
  }
status:any;
EmpName:string;
EmpId:string;
AppRejDate:string;
  search(){
    this.schemeCreation.controls.product.setValue("PERSONAL LOAN");

          let data=this.dataList["data"]
          this.status=data["status"]

          if(+this.status==0){
            this.EmpName="Rejector Name"
            this.EmpId="Rejector Id"
            this.AppRejDate="Rejected Date"
          }else{
            this.EmpName="Approver Name"
            this.EmpId="Approver Id"
            this.AppRejDate="Approved Date"
          }

          this.schemeCreation.patchValue({ 
            product:data["producT_NAME"], 
            schemetype:data["value_type"]==1?"District":"Pincode", 
            loanAmount1:data["loaN_AMOUNT_FROM"], 
            loanAmount2:data["loaN_AMOUNT_TO"], 
            interestRate:data["intresT_RATE"] + "%", 
            processingFee:data["processinG_FEE"] + "%", 
            schemeName:data["schemE_NAME"], 
            FromDate:data["validitY_FROM"].split(" ")[0], 
            ToDate:data["validitY_TO"].split(" ")[0], 
            requesterName:data["requester"].split("~")[0],
            requesterId:data["requester"].split("~")[1], 
            requestedDate:data["requesT_DATE"].split(" ")[0],
            schemeId:data["scheme_id"],
          })
          if(!!data["approver"]){
            this.schemeCreation.patchValue({ 
              approverRejectorName:data["approver"].split("~")[0],
              approverRejectorId:data["approver"].split("~")[1],
              approvedRejectorDate:data["approvE_DATE"].split(" ")[0],
              remarks:data["remarks"],
            })
          }

          if(data["value_type"]=="1"){
            this.settings.loadingSpinner = true;
            this.placeholderval2="District"
            this.placeholderval1="State"
            let stateL=this.StateList.find(s => +s.StateID == +data["valuE1"])
            let params = {
              flag : 1,
              stateID : +data["valuE1"]
            }
            this.commonService.Districtdetails(params)
              .subscribe(res => {
                this.settings.loadingSpinner = false;
                if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
                  this.DistrictList=res["districtList"]
                  let districtL=this.DistrictList.find(s => +s.DistrictID == +data["valuE2"])
                  this.schemeCreation.patchValue({ 
                    val1:stateL["StateName"], 
                    val2:districtL["DistrictName"], 
                  })
                }
              })
          }else{
            this.placeholderval2="To Pincode"
            this.placeholderval1="From Pincode"
            this.schemeCreation.patchValue({ 
              val1:data["valuE1"], 
              val2:data["valuE2"], 
            })
          }
          let cibilLists=this.CibilList.find(s => +s.CommonDataID == +data["cibiL_SCORE_RANGE"])
          let tenure1list=this.TenureList.find(s => +s.CommonDataName == +data["tenurE_FROM"])
          let tenure2list=this.TenureList.find(s => +s.CommonDataName == +data["tenurE_TO"])
          this.schemeCreation.patchValue({ 
          cibilScore:cibilLists["CommonDataName"],
          tenure1:tenure1list["Description"], 
          tenure2:tenure2list["Description"], 
          })
        }
  
  datefunc(date){
    let timezoneOffset = date.getTimezoneOffset();
    let adjustedDate = new Date(date.getTime() - timezoneOffset * 60 * 1000);
    let month=+adjustedDate.getMonth()+1
    let day=adjustedDate.getDate()
    let year=adjustedDate.getFullYear()
    return day + "/" + month + "/" + year
    }

  private displayMessage(message: string, type: string): void {
    let deviceWidth = window.innerWidth > 600 ? '30%' : '80%';
    this.dialog.open(AlertMessageComponenent, {
      width: deviceWidth,
      data: { message: message, type: type }
    });
  }

close(){
  this.dialogRef.close();
}
}
