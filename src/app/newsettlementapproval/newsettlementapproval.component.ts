import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CommonService } from '../services/report/common.service';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { FileviewviewComponent } from '../fileviewview/fileviewview.component';
import { RepaymentService } from '../services/report/repayment.service';

@Component({
  selector: 'app-newsettlementapproval',
  templateUrl: './newsettlementapproval.component.html',
  styleUrls: ['./newsettlementapproval.component.scss']
})
export class NewsettlementapprovalComponent implements OnInit {

  public userData: object;
  public customerID: string = '';
  public loanId: string = '';
  public customerName: string = '';
  public loanDate: string = '';
  public loanAmount: string = '';
  public paymode: string = '';
  public principalOutstanding: string = '';
  public interestOnAbove: string = '';
  public totalInstallment: string = '';
  public balanceOnAccount: string = '';
  public installmentPaid: string = '';
  public overdueInterest: string = '';
  public unpaidInstallment: string = '';
  public bounceCharges: string = '';
  // public settlementAmount: string = '';
  public totalAmount: string = '';
  public otherCharges: string = '';
  public tot: string = '';
  public amountFinanced: string = '';
  public overdueAmount: string = ''
  settlementAmount2: any
  settlementAmount: any;
  paymentModeList: any;
  accountList: any;
  ledgerId: any;
  PaymentModeID: any;
  paymentMode: any;
  instrumentReference: any; // not necessary
  instrumentDate: any;
  accountListType: any;
  resultStringMaster: any;
  resultObjectMaster: any;
  showPaymentMethodExtras: any;
  subledger: any;
  visible: boolean = false;
  paymentModeSearchType: any;
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  collectionDate: any = new Date();
  today: any = new Date();
  public isWaiverMode: boolean = false;



  public settings: Settings;
  data: any[];
  EmpCode: any;
  amounted: any;
  Name: any;
  Value_Date: string;
  collectionvalueDate: any;
  constructor(private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.displayLoanSearchPopup();
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] })
      .subscribe(res => {
        if (!!res && res['paymentModeList'] !== null) {
          if (!!sessionStorage['branchuser']) {
            let dd = []

            dd.push(res['paymentModeList'].find(s => s.PaymentMode == "CASH"))



            this.paymentModeList = dd;

          } else if (!!sessionStorage['currentUser']) {
            let dd = []

            dd.push(res['paymentModeList'].find(s => s.PaymentMode == "CASH"))
            dd.push(res['paymentModeList'].find(s => s.PaymentMode == "Refund"))
            dd.push(res['paymentModeList'].find(s => s.PaymentMode == "Waiver"))


            this.paymentModeList = dd;

          }

        }
      }, err => {
        this.settings.loadingSpinner = false;
      })


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


  private approvaldata(loanItem) {
    const paymode = loanItem.paymode;
    const id = loanItem.LoanId;
    this.isWaiverMode = paymode === 'Waiver';
    this.amounted = ""
    this.Value_Date = ""
    this.EmpCode = ""
    this.Name = ""
    this.FileData = ""
    this.FileExte = ""
    this.FileName = ""
    this.FileDataType = ""

    //  if (result.loanItem.paymode == Waiver) {}
    if (this.isWaiverMode) {

      let param = {
        "loan_id": this.loanId
      }


      this.commonService.downloaddoc1(param).subscribe(res => {
        this.FileData = res['settlementList'][0]['attachment']
        this.FileExte = res['settlementList'][0]['attachement_Ext']
        this.EmpCode = res['settlementList'][0]['userid']
        this.FileName = res['settlementList'][0]["attachementName"],
          this.FileDataType = res['settlementList'][0]['attachement_type'],
          this.amounted = res['settlementList'][0]['amount'],
          this.Name = res['settlementList'][0]['emp_name']
        this.Value_Date = this._rptdatePipe(res['settlementList'][0]['collection_date'])

      })
    }
    this.settlementAmount = ""
    this.interestOnAbove = ""
    this.principalOutstanding = ""
    this.otherCharges = ""
    this.overdueInterest = ""
    this.balanceOnAccount = ""
    this.installmentPaid = ""


    // let b = this._rptdatePipe(this.Value_Date)
    const params = {
      Product_ID: this.userData['productID'],
      LoanID: this.loanId,
      FIRM_ID: this.userData['firmID'],
      TypeID: 1
    };
    this.settings.loadingSpinner = true;
    this.repaymentService.getSettlementDetails(params)
      .subscribe(res => {
        //   console.log(res);
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
            this.balanceOnAccount = loanDetailsList[0]['TotalPayable'];
            this.installmentPaid = loanDetailsList[0]['NextInstallment'];
            this.settlementAmount2 = loanDetailsList[0]['SettlementValue'];


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

  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
      data: { funid: 5 }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
        this.approvaldata(result.loanItem)
      }
    });
  }

  collectionchange() {
    this.settlementAmount = ""
    this.interestOnAbove = ""
    this.principalOutstanding = ""
    this.otherCharges = ""
    this.overdueInterest = ""
    this.balanceOnAccount = ""
    this.installmentPaid = ""


    let b = this._rptdatePipe(this.Value_Date)
    const params = {
      Product_ID: this.userData['productID'],
      LoanID: this.loanId + '^' + b,
      FIRM_ID: this.userData['firmID'],
      TypeID: 1
    };
    this.settings.loadingSpinner = true;
    this.repaymentService.getSettlementDetails(params)
      .subscribe(res => {
        //   console.log(res);
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
            this.balanceOnAccount = loanDetailsList[0]['TotalPayable'];
            this.installmentPaid = loanDetailsList[0]['NextInstallment'];
            this.settlementAmount2 = loanDetailsList[0]['SettlementValue'];


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
  private getSelectedLoanDetails(e): void {
    if (!!e) {
      // console.log(e);
      this.loanId = e.LoanId;
      this.customerName = e.CustName;
      this.loanAmount = e.LoanAmount;
      this.paymode = e.paymode;
      this.customerID = e.CustID;
      this.loanDate = e.LoanDate;

    }
  }
  private getCustDetails() {
    this.settings.loadingSpinner = true;
    let param = {
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
      var splitted = paymentModeSearchText.split("^", 3);
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
        // if (ledgerItem['LedgerID'] != 33000)
        // this.DisplayMessage("Account can't find. Please select other payment mode", "Alert")
      }
    }
  }
  OpenFile(): any {
    if (!!this.FileData) {
      let dataI = {
        file: this.FileData,
        exte: this.FileExte,
        isView: true
      };
      let mobilewidth = "50%";
      let mobileheight = "63%";
      if (window.innerWidth < 599) {
        mobilewidth = "95%";
        mobileheight = "75%";
      }
      const dialogRef = this.dialog.open(FileviewviewComponent, {
        data: dataI,
        width: mobilewidth,
        height: mobileheight,
      });
    }


  }
  onChangeFile(event) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.FileName = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if (extension == "xlsx" || extension == "pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
        if (extension == "xlsx") {
          let pdf = event.target.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(pdf);
          reader.onload = (event: any) => {
            var pdf_url = event.target.result;
            console.log("Type", typeof (event.target.result))
            this.FileDataType = pdf_url.split(',')[0]
            this.FileData = pdf_url.split(',')[1];
            this.ext = "pdf"
            var pdf_name = temp.name;
            reader.onload = (e: any) => {
              /* read workbook */
              const bstr: string = e.target.result;
              const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

              /* grab first sheet */
              const wsname: string = wb.SheetNames[0];
              const ws: XLSX.WorkSheet = wb.Sheets[wsname];

              /* save data */
              this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
              console.log(this.data);
            };
            reader.readAsBinaryString(target.files[0]);
          }
        }
        else if (extension == "pdf") {
          let pdf = event.target.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(pdf);
          reader.onload = (event: any) => {
            var pdf_url = event.target.result;
            console.log("Type", typeof (event.target.result))
            this.FileDataType = pdf_url.split(',')[0]
            this.FileData = pdf_url.split(',')[1];
            this.ext = "pdf"
            var pdf_name = temp.name;
            console.log('event', temp);
          }
        } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
          let photo = event.target.files[0];
          var reader = new FileReader();
          reader.readAsDataURL(photo);
          reader.onload = (event: any) => {
            this.FileData = event.target.result;
            this.FileDataType = this.FileData.split(',')[0]
            this.FileData = this.FileData.split(',')[1];
            this.ext = "jpg"
          }
        }
      }
      else {
        this.DisplayMessage("Invalid File", "Alert");
        this.FileName = undefined;
      }
    }
  }
  selectchange() {
    if (this.settlementAmount == this.settlementAmount2) {

    } else {
      this.settlementAmount2 = undefined
      this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

    }
  }

  public confirm(settlementForm): void {

    // if (+this.settlementAmount2 > 175000) {
    //   this.DisplayMessage('Maximum cash limit  up to Rs. 175000/-only. Please pay online.', "Alert");
    //   this.settlementAmount2 = undefined;
    //   return;
    // }

    // var isRefundSelected = this.paymentMode && this.paymentMode.toLowerCase() === 'refund';

    // if (!isRefundSelected && Math.abs(this.settlementAmount) != this.settlementAmount2) {
    //   this.DisplayMessage("Please Go to Installment Recipet Page to Pay Amount", "Alert");
    //   this.settlementAmount2 = undefined;
    //   return;
    // }



    // if (isRefundSelected && this.settlementAmount !== this.settlementAmount2) {
    //   const absSettlementAmount = Math.abs(this.settlementAmount);
    //   const absConfirmAmount = Math.abs(this.settlementAmount2);
    //   if (absSettlementAmount === absConfirmAmount) {

    //   } else {
    //     this.DisplayMessage("Please Go to Installment Recipet Page to Pay Amount", "Alert");
    //     this.settlementAmount2 = undefined;
    //     return;
    //   }

    // }


    var component = this;
    if (this.showPaymentMethodExtras == false) {
      this.instrumentReference = "0";
      this.subledger = 0;
      var now = new Date();
      this.instrumentDate = this._rptdatePipe(this.Value_Date);
    }
    else {
      this.instrumentDate = this._rptdatePipe(this.loanDate);
    }
    let payDtls: string = "";
    if (!!this.PaymentModeID) { payDtls = payDtls + this.PaymentModeID + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.ledgerId) { payDtls = payDtls + this.ledgerId + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.subledger) { payDtls = payDtls + this.subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentReference) { payDtls = payDtls + this.instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentDate) { payDtls = payDtls + this.instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionDate) { payDtls = payDtls + this._rptdatePipe(this.collectionDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionvalueDate) { payDtls = payDtls + this._rptdatePipe(this.collectionvalueDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    let params = {
      CustID: this.customerID,
      LoanID: this.loanId,
      CollectionAmt: Math.abs(this.settlementAmount),
      PaymentDtls: payDtls,
      "Valuedt": this._rptdatePipe(this.Value_Date)
    }
    this.settings.loadingSpinner = true;
    console.log(params)
    this.repaymentService.collection1(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].code == 1) {
        if(res['outputMessage']=="Not Allowed to Approve^2^"){
          this.DisplayMessage("Not Allowed to Approve", 'Alert');
          this.settings.loadingSpinner = false;
          this.clear(settlementForm);
        }
        else{
        this.DisplayMessage('Saved Successfully', 'Success');
        this.clear(settlementForm);
        }

        // setTimeout(() => {
        //   component.collectionDate = new Date();
        // }, 2);
      }
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
        this.settings.loadingSpinner = false;

      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })


  }

  public reject(settlementForm): void {

     if(this.userData['empCode'] == 21721){
      this.DisplayMessage('You have no permission to Reject', 'Alert');
      return;
    }else {

    var component = this;
    if (this.showPaymentMethodExtras == false) {
      this.instrumentReference = "0";
      this.subledger = 0;
      var now = new Date();
      this.instrumentDate = this._rptdatePipe(this.Value_Date);
    }
    else {
      this.instrumentDate = this._rptdatePipe(this.loanDate);
    }
    let payDtls: string = "";
    if (!!this.PaymentModeID) { payDtls = payDtls + this.PaymentModeID + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.ledgerId) { payDtls = payDtls + this.ledgerId + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.subledger) { payDtls = payDtls + this.subledger + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentReference) { payDtls = payDtls + this.instrumentReference + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.instrumentDate) { payDtls = payDtls + this.instrumentDate + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['branchID']) { payDtls = payDtls + this.userData['branchID'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.userData['empCode']) { payDtls = payDtls + this.userData['empCode'] + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionDate) { payDtls = payDtls + this._rptdatePipe(this.collectionDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    if (!!this.collectionvalueDate) { payDtls = payDtls + this._rptdatePipe(this.collectionvalueDate) + "^"; } else { payDtls = payDtls + 0 + "^"; }
    let params = {
      "loan_id": this.loanId,
      "paymode": this.paymode
    }
    this.settings.loadingSpinner = true;
    console.log(params)
    this.repaymentService.reject1(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].code == 1) {
        this.DisplayMessage('Rejected Successfully', 'Success');
        this.clear(settlementForm);

        // setTimeout(() => {
        //   component.collectionDate = new Date();
        // }, 2);
      }
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
        this.settings.loadingSpinner = false;

      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })

    }
  }


  public clear(settlementForm): void {
    this.FileName = ""
    this.FileExte = ""
    this.FileDataType = ""
    this.FileData = ""
    this.ext = ""
    var component = this;
    settlementForm.resetForm();
    // setTimeout(() => {
    //   component.collectionDate = new Date();
    // }, 2);
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

  onChangeAction(subLederVal) { this.subledger = subLederVal; }


}
