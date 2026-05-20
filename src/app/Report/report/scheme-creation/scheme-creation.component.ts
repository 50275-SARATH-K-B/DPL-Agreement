import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../../../services/report/common.service';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
@Component({
  selector: 'app-scheme-creation',
  templateUrl: './scheme-creation.component.html',
  styleUrls: ['./scheme-creation.component.scss']
})
export class SchemeCreationComponent implements OnInit {

  schemeCreation: any=this.formbuilder.group({
    product:  ['',Validators.required], 
    schemeId:  [''],
    schemetype:  ['',Validators.required], 
    val1:  ['',Validators.required], 
    val2:  ['',Validators.required], 
    loanAmount1:  ['',Validators.required], 
    loanAmount2:  ['',Validators.required], 
    cibilScore:  ['',Validators.required], 
    interestRate:  ['',Validators.required], 
    processingFee:  ['',Validators.required], 
    tenure1:  ['',Validators.required], 
    tenure2:  ['',Validators.required], 
    schemeName: ['',Validators.required], 
    FromDate: ['',Validators.required], 
    ToDate: ['',Validators.required], 
  })

  schemetypeData:any=[
    {name:"District",id:"1"},
    {name:"Pincode",id:"2"}
  ]
  DistrictList:any=[]
  StateList:any=[]
  CibilList:any=[]
  TenureList:any=[]

  userData:any;
  editflag:boolean=false;
  public settings: Settings;

  constructor(
    public route: Router,
    public rout: ActivatedRoute,
    private formbuilder: FormBuilder,
    public datepipe: DatePipe,
    public appSettings: AppSettings,
    public dialog: MatDialog,
    public commonService: CommonService
    ) { 
      this.settings = this.appSettings.settings;
     }


     flag:any;
  ngOnInit() {
    this.rout.params.subscribe((params: Params) => {
      if (!!params && !!params['flag']) {
        this.flag=1
      }
    });
    this.userData=this.commonService.getCredentials()
    this.schemeCreation.controls.product.setValue("PERSONAL LOAN");
    this.schemeCreation.controls.schemetype.setValue("1");
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
                  if(this.flag==1){
                    let data
                    try {
                      data = JSON.parse(sessionStorage.getItem("schemeData"))
                    } catch (ex) {
                      data = undefined
                    }   
                    if(!!data){
                      this.datasetting(JSON.parse(sessionStorage.getItem("schemeData")))
                    }
                  }
                }
              })
          })
      })
  }

  datasetting(data){
    this.editflag=true;

    this.schemeCreation.patchValue({ 
      product:data["producT_NAME"], 
      schemeId:data["scheme_id"],
      schemetype:data["value_type"], 
      loanAmount1:data["loaN_AMOUNT_FROM"], 
      loanAmount2:data["loaN_AMOUNT_TO"], 
      interestRate:data["intresT_RATE"], 
      processingFee:data["processinG_FEE"], 
      schemeName:data["schemE_NAME"], 
      FromDate:new Date(data["validitY_FROM"].split(" ")[0]),
      ToDate:new Date(data["validitY_TO"].split(" ")[0]),  
      cibilScore:data["cibiL_SCORE_RANGE"],
    })

    let tenure1list=this.TenureList.find(s => +s.CommonDataName == +data["tenurE_FROM"])
    let tenure2list=this.TenureList.find(s => +s.CommonDataName == +data["tenurE_TO"])
    this.schemeCreation.patchValue({ 
    tenure1:tenure1list, 
    tenure2:tenure2list, 
    })

    if(data["value_type"]=="1"){
      this.settings.loadingSpinner = true;
      let params = {
        flag : 1,
        stateID : +data["valuE1"]
      }
      this.commonService.Districtdetails(params)
        .subscribe(res => {
          this.settings.loadingSpinner = false;
          if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
            this.DistrictList=res["districtList"]
            this.schemeCreation.patchValue({ 
              val1:+data["valuE1"], 
              val2:+data["valuE2"], 
            })
          }
        })
    }else{
      this.schemeCreation.patchValue({ 
        val1:data["valuE1"], 
        val2:data["valuE2"], 
      })
    }

  }

  districtSelect(){
    let val1=this.schemeCreation.controls.val1.value
    if(!!val1){

    this.settings.loadingSpinner = true;

    let params = {
      flag : 1,
      stateID : +val1
    }
    this.commonService.Districtdetails(params)
      .subscribe(res => {
        this.settings.loadingSpinner = false;
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          this.DistrictList=res["districtList"]
        }
      })
    }

  }

  Calculation(){
    this.settings.loadingSpinner = true;
    let val1=this.schemeCreation.controls.val1.value
    let val2=this.schemeCreation.controls.val2.value
    if(!!val1 && !!val2){
      if(val1>val2){
        this.schemeCreation.patchValue({ 
          val1:undefined,
          val2:undefined
        })
        this.displayMessage("Please Enter Valid Pincode's", "Alert");
      }
    }
    this.settings.loadingSpinner = false;
  }

  valuecheck(ele){
    this.settings.loadingSpinner = true;
    if(ele=="loanAmount1"){
      let val1=+this.schemeCreation.controls.loanAmount1.value
      if(!!val1){
      if(!(5000<=val1) || !(val1<=500000)){
        this.displayMessage("Please Enter Valid Loan Amount", "Alert");
        this.schemeCreation.controls.loanAmount1.setValue(undefined);
      }}
    }else if(ele=="loanAmount2"){
      let val1=+this.schemeCreation.controls.loanAmount2.value
      if(!!val1){
      if(!(5000<=val1) || !(val1<=500000)){
        this.displayMessage("Please Enter Valid Loan Amount", "Alert");
        this.schemeCreation.controls.loanAmount2.setValue(undefined);
      }}
    }else if(ele=="interestRate"){
      let val1=+this.schemeCreation.controls.interestRate.value
      if(!!val1){
      if(!(10<=val1) || !(val1<=36)){
        this.displayMessage("Please Enter Valid Interest Rate", "Alert");
        this.schemeCreation.controls.interestRate.setValue(undefined);
      }}
    }else if(ele=="processingFee"){
      let val1=+this.schemeCreation.controls.processingFee.value
      if(!!val1){
      if(!(1<=val1) || !(val1<=10)){
        this.displayMessage("Please Enter Valid Processing Fee", "Alert");
        this.schemeCreation.controls.processingFee.setValue(undefined);
      }}
    }

    if(ele=="ToDate" || ele=="FromDate"){
      let val1=this.schemeCreation.controls.FromDate.value
      let val2=this.schemeCreation.controls.ToDate.value
      let date=new Date()
      if(!!val1){
      if(date>val1){
        this.displayMessage("Please Enter Valid Scheme Start Date", "Alert");
        this.schemeCreation.controls.FromDate.setValue(undefined);
      }
    }
      if(!!val1 && !!val2){
      if(val1>val2){
        this.displayMessage("Please Enter Valid Scheme Start Date And End Date", "Alert");
        this.schemeCreation.controls.ToDate.setValue(undefined);
        this.schemeCreation.controls.FromDate.setValue(undefined);
        }
      }
    }

    if(ele=="loanAmount1" || ele=="loanAmount2"){
      let val1=+this.schemeCreation.controls.loanAmount1.value
      let val2=+this.schemeCreation.controls.loanAmount2.value
      if(!!val1 && !!val2){
        if(!(val1<val2)){
          this.schemeCreation.controls.loanAmount1.setValue(undefined);
          this.schemeCreation.controls.loanAmount2.setValue(undefined);
          this.displayMessage("Enter Valid Loan Amounts", "Alert");
        }
      }
    }

    if(ele=="tenure1" || ele=="tenure2"){
      let val1=this.schemeCreation.controls.tenure1.value
      let val2=this.schemeCreation.controls.tenure2.value
      if(!!val1 && !!val2){
        if(!(+val1["CommonDataName"]<+val2["CommonDataName"])){
          this.schemeCreation.controls.tenure1.setValue(undefined);
          this.schemeCreation.controls.tenure2.setValue(undefined);
          this.displayMessage("Please Select Valid Tenure", "Alert");
        }
      }
    }
    this.settings.loadingSpinner = false;
}



confirm(){
  this.settings.loadingSpinner = true;

  let params={
    "scheme_id": !!this.schemeCreation.controls.schemeId.value?this.schemeCreation.controls.schemeId.value:0,
    "schemE_NAME": this.schemeCreation.controls.schemeName.value,
    "producT_NAME": this.schemeCreation.controls.product.value,
    "producT_ID": 69,
    "value_type": this.schemeCreation.controls.schemetype.value,
    "valuE1": +this.schemeCreation.controls.val1.value,
    "valuE2": +this.schemeCreation.controls.val2.value,
    "loaN_AMOUNT_FROM": +this.schemeCreation.controls.loanAmount1.value,
    "loaN_AMOUNT_TO": +this.schemeCreation.controls.loanAmount2.value,
    "cibiL_SCORE_RANGE": +this.schemeCreation.controls.cibilScore.value,
    "intresT_RATE": +this.schemeCreation.controls.interestRate.value,
    "processinG_FEE": +this.schemeCreation.controls.processingFee.value,
    "tenurE_FROM": +this.schemeCreation.controls.tenure1.value["CommonDataName"],
    "tenurE_TO": +this.schemeCreation.controls.tenure2.value["CommonDataName"],
    "validitY_FROM": this.datefunc(this.schemeCreation.controls.FromDate.value),
    "validitY_TO": this.datefunc(this.schemeCreation.controls.ToDate.value),
    "status": 1,
    "requester": this.userData["employeeName"] + "~" + this.userData["empCode"],
    "requesT_DATE": this.datefunc(new Date()),
    "approver": "",
    "approvE_DATE": "",
    "remarks": ""
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

Schemetypechange(){
  this.DistrictList=[]
  // this.schemeCreation.controls['val1'] = new FormControl(this.schemeCreation.controls['val1'], Validators.required);
  // this.schemeCreation.controls['val2'] = new FormControl(this.schemeCreation.controls['val2'], Validators.required);
  this.schemeCreation.get('val1').setValidators([Validators.required])
  this.schemeCreation.get('val2').setValidators([Validators.required])
  this.schemeCreation.patchValue({ 
    val1:undefined,
    val2:undefined
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
    this.schemeCreation.controls.product.setValue("PERSONAL LOAN");
    this.schemeCreation.controls.schemetype.setValue("1");
    this.editflag=false;
    sessionStorage.removeItem("schemeData")
    this.DistrictList=[]
  }

}
