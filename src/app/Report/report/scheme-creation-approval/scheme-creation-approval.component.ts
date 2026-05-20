import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router,Params } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/report/common.service';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-scheme-creation-approval',
  templateUrl: './scheme-creation-approval.component.html',
  styleUrls: ['./scheme-creation-approval.component.scss']
})
export class SchemeCreationApprovalComponent implements OnInit {

  schemeCreation: any=this.formbuilder.group({
    product:  [''], 
    schemeId:  ['',Validators.required],
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
    remarks:  ['',Validators.required],    
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
  dataList:any;

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
    ) {
      this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.userData=this.commonService.getCredentials()
    this.commonmasterdata()

    this.router.params.subscribe((params: Params) => {
      if (!!params && !!params['SchemeId']) {
        this.schemeCreation.patchValue({ 
          schemeId:params['SchemeId']
        })
      }
    });
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
                  if(!!this.schemeCreation.controls.schemeId.value){
                    this.search()
                  }
                }
              })
          })
      })
  }

  search(){
    this.schemeCreation.controls.product.setValue("PERSONAL LOAN");
    if(!!+this.schemeCreation.controls.schemeId.value){
    this.settings.loadingSpinner = true;
    let params = {
    "requester": this.userData["empCode"],
    "scheme_id": +this.schemeCreation.controls.schemeId.value
  }
    this.commonService.GetSchemeById(params)
      .subscribe(res => {
        this.settings.loadingSpinner = false;
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          let data=res["schemalist"][0]
          this.dataList=res["schemalist"][0]

          if(+this.userData["empCode"]!=+data["requester"].split("~")[1]){
            if(+data["status"]==1){
          this.schemeCreation.patchValue({ 
            product:data["producT_NAME"], 
            // schemeId:data["scheme_id"],
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
          })

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
        }else{
          if(+data["status"]==2){
            this.displayMessage("Scheme Id Already Approved", "Alert");
          }else{
            this.displayMessage("Scheme Id Already Rejected", "Alert");
          }
          this.clearfunc()
          }
          }else{
          this.displayMessage("Requester And Approver Cannot Be Same", "Alert");
          this.clearfunc()
          }
        }else{
          this.displayMessage(res["status"]["message"], "Alert");
          this.clearfunc()
        }
      })
    }else{
      this.displayMessage("Enter Valid Scheme Id", "Alert");
      this.clearfunc()
    }
    }



  confirm(status){
    this.settings.loadingSpinner = true;
  
    let params={
      "scheme_id": +this.schemeCreation.controls.schemeId.value,
      "schemE_NAME": "",
      "producT_NAME": "",
      "producT_ID": 69,
      "value_type": "",
      "valuE1": 0,
      "valuE2": 0,
      "loaN_AMOUNT_FROM": 0,
      "loaN_AMOUNT_TO": 0,
      "cibiL_SCORE_RANGE": 0,
      "intresT_RATE": 0,
      "processinG_FEE": 0,
      "tenurE_FROM": 0,
      "tenurE_TO": 0,
      "validitY_FROM": "",
      "validitY_TO": "",
      "status": status,
      "requester": "",
      "requesT_DATE": "",
      "approver":this.userData["employeeName"] + "~" + this.userData["empCode"],
      "approvE_DATE": this.datefunc(new Date()),
      "remarks": this.schemeCreation.controls.remarks.value
    }
  
    this.commonService.SchemeAdd(params)
    .subscribe(res => {
      this.settings.loadingSpinner = false;
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        this.displayMessage(res["message"], "Success");
        this.clearfunc()
      }else{
        this.displayMessage(res["status"]["message"], "Alert");
      }
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

  clearfunc(){
    this.schemeCreation.reset()
    this.DistrictList=[]
  }
}
