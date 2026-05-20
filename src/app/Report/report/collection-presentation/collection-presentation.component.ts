import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { CommonService } from '../../../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { EnachService } from '../../../services/report/enach.service';
import { RepaymentService } from '../../../services/report/repayment.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-collection-presentation',
  templateUrl: './collection-presentation.component.html',
  styleUrls: ['./collection-presentation.component.scss']
})
export class CollectionPresentationComponent implements OnInit {
  public userData: object;
  public customerID: string = '';
  public loanId: string = '';
  public customerName: string = '';
  public loanDate: string = '';
  public loanAmount: string = '';
  public principalOutstanding: string = '';
  public interestOnAbove: string = '';
  public totalInstallment: string = '';
  public balanceOnAccount: string = '';
  public installmentPaid: string = '';
  public overdueInterest: string = '';
  public unpaidInstallment: string = '';
  public bounceCharges: string = '';
  public settlementAmount: string = '';
  public totalAmount: string = '';
  public otherCharges: string = '';
  public tot: string = '';
  public amountFinanced: string = '';
  paymentModeList: any;
  accountList: any;
  ledgerId: any;
  PaymentModeID: any;
  paymentMode: any;
  instrumentReference: any; 
  instrumentDate: any;
  accountListType: any;
  resultStringMaster: any;
  resultObjectMaster: any;
  showPaymentMethodExtras: any;
  subledger: any;
  visible: boolean = false;
  paymentModeSearchType: any;

  collectionDate:any = new Date();
  today:any = new Date();


  public settings: Settings;
  disabled: boolean;
  selectedDatas: any[];
  selection: any;
  paymentModeID: string;
  mandatcode: any;
  constructor(private dialog: MatDialog,private enachService: EnachService,   private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.displayLoanSearchPopup();
    this.getPaymentModes();
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] })
      .subscribe(res => {
        if (!!res && res['paymentModeList'] !== null) {
          this.paymentModeList = res['paymentModeList'];
        }
      }, err => {
        this.settings.loadingSpinner = false;
      })
      


  }
  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        console.log(result)
        this.getSelectedLoanDetails(result.loanItem);
        this.visible = true;
        this.mandatecode()
      }
    });
  }
  private getSelectedLoanDetails(e): void {
    if (!!e) {
      this.loanId = e.LoanId;
      this.customerName = e.CustName;
      this.loanAmount = e.LoanAmount;
      this.customerID = e.CustID;
      this.loanDate = e.LoanDate;
      const params = {
        Product_ID: this.userData['productID'],
        LoanID: this.loanId,
        FIRM_ID: this.userData['firmID'],
        TypeID: 1
      };
      this.settings.loadingSpinner = true;
      this.repaymentService.getSettlementDetails(params)
        .subscribe(res => {
          this.getCustDetails();
          if (res['status'].code == 1) {
            if (res['loanDataList']) {
              this.settings.loadingSpinner = false;
              let loanDetailsList = res['loanDataList'];
              this.settlementAmount = loanDetailsList[0]['SettlementValue'];
              this.interestOnAbove = loanDetailsList[0]['TotalInterest'];
              this.principalOutstanding = loanDetailsList[0]['TotalPrinciple'];
              this.otherCharges = loanDetailsList[0]['TotalOtherCharges'];
              this.overdueInterest = loanDetailsList[0]['TotalOverDue'];
              this.balanceOnAccount = loanDetailsList[0]['TotalOutstanding'];
              this.installmentPaid = loanDetailsList[0]['NextInstallment'];


            } else {
              alert('list null');
              this.DisplayMessage(res['status'].message, "Alert");
              this.settings.loadingSpinner = false;
            }

          }
        }, error => {
          this.settings.loadingSpinner = false;
        });
    }
  }
  private getCustDetails() {
    this.settings.loadingSpinner = true;
    let param=   {
      "LoginID": this.customerID
    }
    this.repaymentService.getCustomerDetails(param).subscribe(res => {
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.settings.loadingSpinner = false;
        let custDtls = res['customerDetailsList'][0];
        let custDtlsStr = custDtls['CustName'];
        let custDtlsStrVal = custDtlsStr.split('^');
        this.installmentPaid = custDtlsStrVal[4];
        this.totalInstallment = custDtlsStrVal[5];
        this.unpaidInstallment = custDtlsStrVal[6];
      }
      else { this.settings.loadingSpinner = false; }
    },
      err => {
        this.settings.loadingSpinner = false;
        console.log('error')
      })
  }

  onChange(paymentModeSearchText) {
    if (!!paymentModeSearchText && paymentModeSearchText != null) {
      let splitted = paymentModeSearchText.split("^", 3);
      this.ledgerId = splitted[0];
      this.PaymentModeID = splitted[1];
      this.paymentMode = splitted[2];
      if (this.PaymentModeID == 1) {
        this.instrumentReference = ''
        this.instrumentDate = ''
        this.accountListType = ''
      }
      if (this.userData['branchID'] != 0) {
        const subAccountParms = {
          AccountNo: this.ledgerId,
          Branch_ID: this.userData['branchID'],
          Firm_ID: this.userData['firmID'],
        };
        this.repaymentService.getSubAccountDetails(subAccountParms)
          .subscribe(result => {
            this.resultStringMaster = JSON.stringify(result);
            this.resultObjectMaster = JSON.parse(this.resultStringMaster);
            this.accountList = this.resultObjectMaster.accountList;
            if (this.accountList == "" || this.accountList == null) {
              this.showPaymentMethodExtras = false;
            } else {
              this.showPaymentMethodExtras = true;
            }
          }, error => {
            console.log('There was an error: ')
          });
      } else {
        let ledgerItem = this.paymentModeList.find(s => s.PaymentModeID == +this.PaymentModeID);
        this.showPaymentMethodExtras = false;
      }
    }
  }
  mandatecode(){
    const params = {
      "LoanNo": this.loanId

    }
    this.enachService.mandatecodeget(params).subscribe(res=>{
      console.log(res)
      this.mandatcode = res['mandateList'][0]['mandateId']
console.log(res['mandateList'][0]['mandateId'])
    })
  }


  public confirm(data, presentationForm): void {
    this.disabled = true;
    console.log(data)
    console.log(data['MandateCode'])
    
    const params = {
      amount: data['value']['settlementAmount'] * 100,
      // mandate: 'MD00146HQE1NRH'
      mandate: this.mandatcode
    }
console.log(data.value.settlementAmount)
sessionStorage.setItem('isENACH', '1');
    this.enachService.submitNachPresentationExternal(params)
      .subscribe(res => {
        if (!!res && res['status'] == 'SUCCESS') {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: "NACH presented successfully for Loan ID: " + data['LOAN_ID'], type: "Success" }
          });
          dialogRef.afterClosed().subscribe(res => {
          presentationForm.reset()
            
          
          })
          } else {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: res['errorList'][0]['errorMessage'], type: "Alert" }
          });
        }
      }, error => {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presentation failed for Loan ID: " + data.value.loanId, type: "Alert" }
        });
      })
  }
  private _rptdatePipe(DateValue) {
    let date = new Date(DateValue);
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
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
  public saveInternalData(data, res, presentationDate, presentationForm): void {
    console.log(res)
    let payDtls: string = "";
    let instrumentReference = "0";
    let subledger = 0;
    let instrumentDate = this._rptdatePipe(data['DUE_DATE']);
    if (!!this.PaymentModeID) { payDtls = payDtls + this.paymentModeID + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.paymentModeList['LedgerID']) { payDtls = payDtls + this.paymentModeList['LedgerID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!subledger) { payDtls = payDtls + subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.mandatcode) { payDtls = payDtls + this.mandatcode + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!instrumentReference) { payDtls = payDtls + instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!instrumentDate) { payDtls = payDtls + instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['firmID']) { payDtls = payDtls + this.userData['firmID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    const params = {
      CustID: data.value.customerID,
      LoanID: data.value.loadid,
      CollectionAmt: data.value.settlementAmount,
      PaymentDtls: payDtls,
      presented_id: res['id'],
      presented_date: this._rptdatePipe(new Date(res['created'] * 1000)),
      enter_by: this.userData['empCode'],
      sponser_bank: res['nach_sponsor_bank'],
      utility_code: res["nach_utility_code"],
      due_date: this._rptdatePipe(new Date(this.collectionDate)),
    }
    this.enachService.submitNachPresentationInternal(params).subscribe(res => {
      if ((res['status'] == "SUCCESS")) {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presented successfully for Loan ID: " + this.loanId, type: "Success" }
        });
        dialogRef.afterClosed().subscribe(res => {
          if (this.selectedDatas.length !== 0) {
          } else {
            this.selection.clear();
            this.selectedDatas = [];

            this.disabled = false;
          }
        })
      } else {
        const dialogRef = this.dialog.open(AlertMessageComponenent, {
          width: '30%',
          data: { message: "NACH presentation failed for Loan ID: " + this.loanId + ". Please try again", type: "Alert", presentationData: params }
        });
        dialogRef.afterClosed().subscribe(res => {
          const dialogRef = this.dialog.open(AlertMessageComponenent, {
            width: '30%',
            data: { message: "NACH presented successfully for Loan ID: " + this.loanId, type: "Success" }
          });
          dialogRef.afterClosed().subscribe(res => {
           
          })
        })
      }
    })
  }
  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type },
    });

  
  }
  
  public clear(settlementForm): void {
    let component =  this;
    settlementForm.resetForm();
    setTimeout(() => {
      component.collectionDate = new Date();
    }, 2);
   }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

    private getPaymentModes(): void {
    this.paymentModeList = [];
    const params = {
      FIRM_ID: this.userData['firmID'],
      PRODUCT_ID: this.userData['productID'],
      flag: 2,

    }
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(res => {
      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
        console.log(this.paymentModeList)
      }
    })

  }
  onChangeAction(subLederVal) { 
    this.subledger = subLederVal; 
  }

}
