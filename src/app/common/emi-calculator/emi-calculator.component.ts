import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../services/common/common.service';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent implements OnInit {

  @ViewChild('selectDuration') selectDuration;
  @ViewChild('selectInterestType') selectInterestType;
  @ViewChild('selectLoanTypes') selectLoanTypes;
  @ViewChild('selectCollectionTypes') selectCollectionTypes;

  //#region  Declarations
  commonDataList: any;
  public userData: object
  durationTypeList: any;
  interestTypeList: any;
  loanTypeList: any;
  collectionTypeList: any;

  jsonToString: any;
  jsonToArray: any;

  loanAmount: string;
  tenure: string;
  roi: string;
  durationTypes: string;
  interestTypes: string;
  loanTypes: string;
  collectionTypes: string;

  resultStringMaster: any;
  resultObjectMaster: any;


  //isSubmitted:any=false;

  //#endregion

  constructor(private commonService: CommonService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();

    //#region Duration drop down binding

    const durationParms =
    {
      "COMMON_DATA_TYPE_ID": 16,
      "FIRM_ID": this.userData['firmID'],
    };


    this.commonService.getCommonItems(durationParms)
      .subscribe(
        result => {
          //alert("success1")
          this.jsonToString = JSON.stringify(result);
          this.jsonToArray = JSON.parse(this.jsonToString);

          this.commonDataList = this.jsonToArray.commonDataList;
          this.durationTypeList = this.commonDataList;

        },
        error =>

          console.log('There was an error: '),
        //alert("error1")
      );

    //#endregion


    //#region Interest type dropdown binding

    const interestTypeParms =
    {
      "COMMON_DATA_TYPE_ID": 17,
      "FIRM_ID": this.userData['firmID'],
    };


    this.commonService.getCommonItems(interestTypeParms)
      .subscribe(
        result => {
          //  alert("success2")
          this.jsonToString = JSON.stringify(result);
          this.jsonToArray = JSON.parse(this.jsonToString);

          this.commonDataList = this.jsonToArray.commonDataList;
          this.interestTypeList = this.commonDataList;

        },
        error =>

          console.log('There was an error: ')
        // alert("error2")
      );

    //#endregion


    const loanTypeParms = {
      "COMMON_DATA_TYPE_ID": 18,
      "FIRM_ID": this.userData['firmID'],
    };
    this.commonService.getCommonItems(loanTypeParms)
      .subscribe(result => {
        this.jsonToString = JSON.stringify(result);
        this.jsonToArray = JSON.parse(this.jsonToString);
        this.commonDataList = this.jsonToArray.commonDataList;
        this.loanTypeList = this.commonDataList;

      }, error => console.log('There was an error: '));

    const collectiomTypeParms = { "COMMON_DATA_TYPE_ID": 19, "FIRM_ID": this.userData['firmID'], };
    this.commonService.getCommonItems(collectiomTypeParms)
      .subscribe(result => {
        this.jsonToString = JSON.stringify(result);
        this.jsonToArray = JSON.parse(this.jsonToString);
        this.commonDataList = this.jsonToArray.commonDataList;
        this.collectionTypeList = this.commonDataList;
      }, error => console.log('There was an error: '));
  }


  EMIAmount: any;
  public Calculate() {
    if (+this.roi > 100) {
      this.DisplayMessage("Enter Valid Rate of Interest", "Alert");
      return;
    }
    const emiParams = {
      "LOAN_AMOUNT": +this.loanAmount,
      "TENURE": +this.tenure,
      "DURATION": +this.durationTypes,
      "ROI": parseFloat(this.roi),
      "INTTYPE": +this.interestTypes,
      "LOANTYPE": +this.loanTypes,
      "COLLECTTYPE": +this.collectionTypes,
    };
    this.commonService.Calculate(emiParams)
      .subscribe(result => {
        if (!!result && result['status'].code == 1) {
          this.resultObjectMaster = result;
          this.EMIAmount = this.resultObjectMaster.EMIAMOUNT;
        } else {
          this.DisplayMessage(result['status'].message, "Alert");
          this.EMIAmount = undefined;
        }
      }, error => {
        this.DisplayMessage("Error Occured", "Error");
      });
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  Clear(EMICalculatorForm) {
    EMICalculatorForm.resetForm();
    this.EMIAmount = undefined;
    this.selectCollectionTypes['_keyManager']['_activeItem'] = undefined;
    this.selectCollectionTypes['_keyManager']['_activeItemIndex'] = -1;
    this.selectDuration['_keyManager']['_activeItem'] = undefined;
    this.selectDuration['_keyManager']['_activeItemIndex'] = -1;
    this.selectInterestType['_keyManager']['_activeItem'] = undefined;
    this.selectInterestType['_keyManager']['_activeItemIndex'] = -1;
    this.selectLoanTypes['_keyManager']['_activeItem'] = undefined;
    this.selectLoanTypes['_keyManager']['_activeItemIndex'] = -1;
  }
}
