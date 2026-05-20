import { Component, OnInit, Inject, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CommonService } from '../../services/common/common.service';
import { LoanApplicationService } from '../../services/LOS/loan-application.service';
import { DatePipe } from '@angular/common';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-credit-shield-insurance',
  templateUrl: './credit-shield-insurance.component.html',
  styleUrls: ['./credit-shield-insurance.component.scss']
})
export class CreditShieldInsuranceComponent implements OnInit {
  @Input() dataInput: any;
  applicationID: any;
  userData: Object;
  customerName: String;
  gender: any;
  MaddressLine1: any;
  Locality: any;
  StreetName: any;
  City: any;
  PostOffice: any;
  District: any;
  PinCode: any;
  State: any;
  Country: any;
  nomineeName: any;
  nomineeGender: any;
  nomineeBDate: Date;
  nomineeRelationShip: any;
  gaurdianName: any;
  GaurdianBDate: any;
  GaurdianRelationShip: any;
  GaurdianMobileNo: any;
  amount: any;
  tenure: any;
  agency: any;
  premiumAmount: any;
  custId: any;
  mobileNo: any;
  guardianFlag: boolean;
  genderParam: any;
  custDOB: any;
  resultObj: Object;
  RelationShipList: any;
  AgencyList: any;
  insuranceAmount: any;
  AgencyId: any;
  Agencyname: any;
  firmId: any;
  applicationId: any;
  @Output() creditEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input() applicantData: object;

  constructor(public dialog: MatDialog, private commonService: CommonService,
    private loanApplicationService: LoanApplicationService, private datepipe: DatePipe) {
    this.userData = this.commonService.getCredentials();
  }

  ngOnInit() {
    // this.userData = this.commonService.getCredentials();
    if (!!this.applicantData && !!this.applicantData['ApplicationID'] && this.applicantData['ApplicationID'] != null) {
      this.applicationID = this.applicantData['ApplicationID'];
      this.ValidateAppId();
    }

    this.commonService.getCommonItems({ FIRM_ID: this.userData['firmID'], COMMON_DATA_TYPE_ID: 28 })
      .subscribe(res => {
        this.resultObj = res;
        this.RelationShipList = this.resultObj['commonDataList'];
      });

    this.loanApplicationService.getInsuraneagencyListByAppliationID({ productID: this.userData['productID'], firmId: this.userData['firmID'] })
      .subscribe(res => {
        this.resultObj = res;
        this.AgencyList = this.resultObj['agency'];


      });
  }

  customerObject: any;
  bureauAgencyName: any;
  ngOnChanges() {
    if (!!this.dataInput && this.dataInput['flag'] == 2) {
      this.ValidateAppId();
      if (this.dataInput['bureauAgency'] == 1) {
        this.bureauAgencyName = "CIBILE";
      } else if (this.dataInput['bureauAgency'] == 2) {
        this.bureauAgencyName = "EQUIFAX";
      } else {
        this.bureauAgencyName = "EXPERIAN";
      }
      if (!!this.dataInput['customer']) {
        this.commonService.searchCustomerDetails({ optionId: 1, searchValue: this.dataInput['customer'].custId })
          .subscribe(result => {
            let addressItem = result['customerAddressList'].find(s => s.isPrimaryAddress == 'Y');
            this.gender = result['customerDataList'][0].gender;
            this.customerObject = {
              customerID: this.dataInput['customer'].custId,
              gender: (result['customerDataList'][0].gender == 'M') ? ('Male') : (result['customerDataList'][0].gender == 'F' ? 'Female' : 'Others'),
              houseName: addressItem['houseName'],
              locality: addressItem['addressLine2'],
              streetName: addressItem['addressLine3'],
              city: addressItem['addressLine4'],
              districtName: addressItem['districtName'],
              countryName: addressItem['countryName'],
              stateName: addressItem['stateName'],
              postOffice: addressItem['postOffice'],
              pincode: addressItem['pincode'],
              mobilePhone: this.dataInput['customer'].mobilePhone,
              dob: this.getDatePipe(this.dataInput['customer'].dob),
            }
          })
      }
    }

    !!this.dataInput && this.dataInput['reset'] ? this.resetForm() : "";
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
  creditShieldSubmit(insuranceForm, type) {
    if (type == 1) {
      if (insuranceForm.valid && this.dataInput['flag'] == 2) {
        this.nomineeBDate.setHours(this.nomineeBDate.getHours() + 6);
        let nomineeBirthDay = this.nomineeBDate.toISOString().split("T");
        let gday;

        if (this.GaurdianBDate != undefined) {
          this.GaurdianBDate.setHours(this.GaurdianBDate.getHours() + 6);
          gday = this.GaurdianBDate.toISOString().split("T");
        }

        const param = {
          productID: this.userData['productID'],
          applicationId: this.dataInput['proposalID'],
          CustomerID: this.dataInput['customer'].custId,
          Gender: this.gender,
          HouseName: this.customerObject['houseName'],
          Address1: this.customerObject['locality'],
          Address2: this.customerObject['streetName'],
          Address3: this.customerObject['city'] == null ? "" : this.customerObject['city'],
          PinCode: this.customerObject['pincode'],
          MobileNo: this.customerObject['mobilePhone'],
          DOB: this._rptdatePipe(this.dataInput['customer'].dob),
          NomineeName: this.nomineeName,
          NomineeGender: this.nomineeGender,
          NomineeDOB: this._rptdatePipe(nomineeBirthDay[0]),
          ApplicantRelation: this.nomineeRelationShip,
          GuardianName: this.gaurdianName,
          GuardianDOB: gday,
          GuardianRelation: this.GaurdianRelationShip,
          GuardianMob: this.GaurdianMobileNo,
          SumAssuredAmt: this.dataInput['loanamount'],
          SumAssuredTenure: this.dataInput['tenure'],
          InsuranceAgency: +this.agency,
          InsuranceAmount: this.premiumAmount,
          UserID: this.userData['empCode'],
          flag: 2
        }
        this.loanApplicationService.postCreditShield(param)
          .subscribe(result => {
            if (result['status'].code == 1) {
              this.DisplayMessage("Credit shield submitted successfully", "Success");
              let item = {
                quotationID: this.dataInput['proposalID'],
                eventID: 2,
                isNext: +type == 1 ? true : false
              }
              this.creditEmitter.emit(item);
            }
            else {
              this.DisplayMessage(result['status'].message, "Alert")
            }
          }, error => {
            this.DisplayMessage("Error Occured", "Error")
          }
          )
      }
    } else {
      let item = {
        quotationID: this.dataInput['proposalID'],
        eventID: 2,
        isNext: +type == 1 ? true : false
      }
      this.creditEmitter.emit(item);
    }
  }


  getDatePipe(date) {
    let fullDate = new Date(date);
    let month = fullDate.getMonth() + 1;
    return fullDate.getDate() + '-' + (month > 9 ? month : ('0' + month)) + '-' + fullDate.getFullYear();
  }

  ValidateAppId() {
    if (!!this.dataInput) {
      const params = {
        ProductID: +this.userData['productID'],
        ApplicationID: this.dataInput['flag'] == 2 ? this.dataInput['proposalID'] : +this.applicationID,
        flag: this.dataInput['flag'],
      }
      this.loanApplicationService.getCreditShieldDetailsByApplicationID(params)
        .subscribe(result => {
          if (result['details'] != null) {
            let custList = result['details'][0]
            this.nomineeName = custList.nomineeName;
            this.nomineeGender = custList.nomineeGender;
            this.nomineeBDate = new Date(custList.nomineeDOB);
            this.nomineeRelationShip = custList.applicantRelation;
            this.gaurdianName = custList.guardianName;
            this.GaurdianBDate = new Date(custList.guardianDOB);
            this.GaurdianRelationShip = custList.guardianRelation;
            this.GaurdianMobileNo = custList.guardianMob;
            this.agency = custList.insuranceAgencyID.toString();
            this.premiumAmount = custList.insuranceAmount;
            this.insuranceAmount = custList.insuranceAmount;
          } else {

          }
        }
        )
    }
  }


  resetForm() {
    this.nomineeName = this.nomineeGender = this.nomineeBDate = undefined;
    this.nomineeRelationShip = this.gaurdianName = this.GaurdianBDate = undefined;
    this.GaurdianRelationShip = this.GaurdianMobileNo = this.agency = undefined;
    this.premiumAmount = this.insuranceAmount = undefined;
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });

  }

  getAgeOfominee() {
    this.guardianFlag = false;
    let date = new Date();
    let dob = new Date(this.nomineeBDate);
    let diffDate = date.valueOf() - this.nomineeBDate.valueOf();
    let Months = (diffDate / (1000 * 3600 * 24 * 30.5));
    Months += 1;
    let year: number = 0;
    while (Months > 12) {
      year += Months / 12;
      Months = Months % 12;
    }
    this.guardianFlag = year < 18 ? true : false;
  }

  save(form) {
    this.nomineeBDate.setHours(this.nomineeBDate.getHours() + 6);
    let nomineeBirthDay = this.nomineeBDate.toISOString().split("T");
    let gday;

    if (this.GaurdianBDate != undefined) {
      this.GaurdianBDate.setHours(this.GaurdianBDate.getHours() + 6);
      gday = this.GaurdianBDate.toISOString().split("T");
    }

    const param = {
      productID: this.userData['productID'],
      applicationId: this.applicationID,
      CustomerID: this.custId,
      Gender: this.genderParam,
      HouseName: this.MaddressLine1,
      Address1: this.Locality,
      Address2: this.StreetName,
      Address3: this.District,
      PinCode: this.PinCode,
      MobileNo: this.mobileNo,
      DOB: this._rptdatePipe(this.custDOB),
      NomineeName: this.nomineeName,
      NomineeGender: this.nomineeGender,
      NomineeDOB: this._rptdatePipe(nomineeBirthDay[0]),
      ApplicantRelation: this.nomineeRelationShip,
      GuardianName: this.gaurdianName,
      GuardianDOB: gday,
      GuardianRelation: this.GaurdianRelationShip,
      GuardianMob: this.GaurdianMobileNo,
      SumAssuredAmt: this.amount,
      SumAssuredTenure: this.tenure,
      InsuranceAgency: this.agency,
      InsuranceAmount: this.premiumAmount,
      UserID: this.userData['empCode']
    }
    this.loanApplicationService.postCreditShield(param)
      .subscribe(
        result => {
          if (result['status'].code == 1) {
            this.DisplayMessage("Credit Shield added Successfully", "Success");
          }
          else {
            this.DisplayMessage(result['status'].message, "Alert")
          }
        }, error => {
          this.DisplayMessage("Error Occured", "Error")
        }
      )
  }
  validatePremiumAmount() {
    if (this.amount > this.premiumAmount) {
      this.DisplayMessage("Premium Amount Should not be Greater than Assured Amount", "ALert");
      this.premiumAmount = undefined;
    }
    else if (!!this.insuranceAmount && this.premiumAmount != this.insuranceAmount) {
      const dialogRef = this.dialog.open(insuranceComponent, {
        data: {
          oldAmount: this.premiumAmount,
          newAmount: this.premiumAmount
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result = 1) {
          this.insuranceAmount = this.premiumAmount;
        }
        else {
          this.premiumAmount = undefined;
        }
      });
    }
  }


}

export class insuranceComponent {
  constructor(public dialogRef: MatDialogRef<insuranceComponent>, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any) { }
  newAmount: any;
  oldAmount: any;


  ngOnInit() {
    console.log("this data is : " + JSON.stringify(this.data));
    this.newAmount = this.data.newAmount;
    this.oldAmount = this.data.oldAmount;
  }

  sendresponse(value) {
    this.dialogRef.close(value);
  }
}