import { Component, OnInit } from '@angular/core';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { Settings } from '../app.settings.model';
import { AppSettings } from '../app.settings';
import { RepaymentService } from '../services/report/repayment.service';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-newsettlementrequest',
  templateUrl: './newsettlementrequest.component.html',
  styleUrls: ['./newsettlementrequest.component.scss']
})
export class NewsettlementrequestComponent implements OnInit {
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
  // public settlementAmount: string = '';
  public totalAmount: string = '';
  public otherCharges: string = '';
  public tot: string = '';
  public amountFinanced: string = '';
  public overdueAmount: string = ''
  settlementAmount2: any;
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
  FileData: any;
  FileExte: any;
  FileDataType: any;
  data: any[];
  ext: string;
  // isDateSelectable: any;
  isWaiverSelected: boolean = false;
  isFileUploaded: boolean = false;


  collectionDate: any = new Date();
  today: any = new Date();

  
  public settings: Settings;
  collectionvalueDate: any;
  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData);
    this.commonService.session2()

    // let params = {
    //   "user_Id":this.userData['empCode']
    // }
    // this.commonService.sessionactive(params).subscribe(res=>{
    //  if(res['message'] == 'Session is already active'){

    //  }else{
    //   this.DisplayMessage(res['message'], "Alert")

    //   this.router.navigate(['/login']);

    //  }
    // })
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

    // this.commonService.schedulejob().subscribe(res=>{
    //   if (res['status'].code == 1 && res['status'].flag == 1) {




    //   }else{
    //     const dialogRef = this.dialog.open(AlertMessageComponenent, {
    //       width: '30%',
    //       data: { message: 'Sorry, your EMI generation is in progress. Settlement is not possible right now. !', type: 'Alert' }
    //       });
    //       dialogRef.afterClosed().subscribe(result => {
    //        if(!!sessionStorage['branchuser']){
    //          this.router.navigateByUrl('/branchboard/dashboard2')

    //        }else if(!!sessionStorage['currentUser']){
    //          this.router.navigateByUrl('/personal-report/dashboard1')

    //        }

    //       });
    //   }
    // })
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
  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
        this.visible = true;
      }
    });
  }
  private getSelectedLoanDetails(e): void {
    if (!!e) {
      // console.log(e);
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

      this.isWaiverSelected = this.paymentMode.toLowerCase() === 'waiver';
      this.isFileUploaded = !this.isWaiverSelected;

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

  isDateSelectable = (date: Date | null): boolean => {
    if (!date) return false;
    let today = new Date();
    
    today.setHours(0, 0, 0, 0);

    let selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);  

    // if (this.paymentMode === 'Waiver') {
    //   return selectedDate < today;
    // } else {
    return selectedDate.getTime() === today.getTime();
    // }
  };




  selectchange() {
    if (!!sessionStorage['branchuser']) {
      if (this.settlementAmount == this.settlementAmount2) {
        if (+this.settlementAmount2 > 175000) {
          this.DisplayMessage('Maximum cash limit  up to Rs. 175000/-only. Please pay online.', "Alert");
          this.settlementAmount2 = undefined;
        }
      } else {
        this.settlementAmount2 = undefined
        this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

      }
    } else if (!!sessionStorage['currentUser']) {
      if (this.settlementAmount == this.settlementAmount2) {

      } else {
        this.settlementAmount2 = undefined
        this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

      }

    }
  }

    cashlimit(){
    let date = new Date(this.collectionDate);
    let month = date.getMonth();
    switch(month){
      case 0:
        return 59999;
      case 1:
        return 39999;
      case 2:
        return 19999;
      default:
        return 19999;
    }
  }

  public confirm(settlementForm): void {

    let monthlimit = this.cashlimit();

    if(this.userData['empCode'] == 21723){
      this.DisplayMessage('You are not authorized to do Settlement Request', 'Alert');
      return;
    }else {

      if(this.settlementAmount > 0 && this.paymentMode.toLowerCase() === 'refund'){
        this.DisplayMessage("Refund Option can't be selected for posive settlement amount!!","Alert");
        return;
      }
    
    if (+this.settlementAmount2 > monthlimit) {
      this.DisplayMessage('Maximum cash limit  up to Rs. ' + monthlimit + '/-only. Please pay online.', "Alert");
      this.settlementAmount2 = undefined;
      return;
    }

    var isRefundSelected = this.paymentMode && this.paymentMode.toLowerCase() === 'refund';

    if (!isRefundSelected && Math.abs(this.settlementAmount) != this.settlementAmount2) {
      this.DisplayMessage("Please Go to Installment Recipet Page to Pay Amount", "Alert");
      this.settlementAmount2 = undefined;
      return;
    }



    if (isRefundSelected && this.settlementAmount !== this.settlementAmount2) {
      const absSettlementAmount = Math.abs(this.settlementAmount);
      const absConfirmAmount = Math.abs(this.settlementAmount2);
      if (absSettlementAmount === absConfirmAmount) {

      } else {
        this.DisplayMessage("Please Go to Installment Recipet Page to Pay Amount", "Alert");
        this.settlementAmount2 = undefined;
        return;
      }

      // return;
    }

    var component = this;
    if (this.showPaymentMethodExtras == false) {
      this.instrumentReference = "0";
      this.subledger = 0;
      var now = new Date();
      this.instrumentDate = this._rptdatePipe(now);
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
    payDtls = payDtls + "req"+ "*" + this.userData['empCode'] + "^";
    console.log("Payment Details", payDtls);

    let params1 = {
      CustID: this.customerID,
      LoanID: this.loanId,
      CollectionAmt: this.settlementAmount2,
      PaymentDtls: payDtls,
      payment_mode: this.paymentMode
    }
    this.settings.loadingSpinner = true;
    console.log(params1)
    this.repaymentService.collection1(params1).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (res['status'].flag == 1 && res['status'].code == 1) {
          if(res['outputMessage']=="Already Added^1^"){
          this.DisplayMessage("Already Added", 'Alert');
          this.settings.loadingSpinner = false;
          this.clear(settlementForm);
        }
        else{
        this.DisplayMessage('Saved Successfully', 'Success');

        let param = {
          "loan_id": this.loanId,
          "collection_date": this._rptdatePipe(this.collectionDate),
          "attachment": this.FileData,
          "user_id": this.userData['productID'],
          "attachementName": this.FileName,
          "attachement_Ext": this.FileExte,
          "attachement_type": this.FileDataType,
          'amount': this.settlementAmount2,
          'emp_name': this.userData['empCode']
        }
        this.commonService.docupload1(param).subscribe(res => {
          if (!!res && res['status'].code == 1) {
            // this.DisplayMessage('Document Uploaded Successfully', 'Success');
            this.settings.loadingSpinner = false;
          } else {
            // this.DisplayMessage(res['message'], 'Alert');
            this.settings.loadingSpinner = false;

          }
        })

        this.clear(settlementForm);
        setTimeout(() => {
          component.collectionDate = new Date();
        }, 2);
      }
      }
      else {
        this.settings.loadingSpinner = false;
        this.DisplayMessage(res['status'].message, 'Alert');
      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })

  }
  }

  public clear(settlementForm): void {
    var component = this;
    settlementForm.resetForm();
    setTimeout(() => {
      //component.collectionDate = new Date();
    }, 2);
  }

    public clearr(settlementForm): void {
    var component = this;
    settlementForm.resetForm();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/new-settlement-request', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
    setTimeout(() => {
      //component.collectionDate = new Date();
    }, 2);
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }

  onChangeAction(subLederVal) { this.subledger = subLederVal; }


  OpenFile(): any {
    if (!!this.FileData) {
      var data = {
        "isView": true,
        "exte": this.FileExte,
        'file': this.FileData,
        'Filetype': this.FileDataType,
        "execl": this.data
      };
      let mobilewidth = "50%";
      let mobileheight = "auto";
      if (window.innerWidth < 599) {
        mobilewidth = "95%";
        mobileheight = "75%";
      }
      const dialogRef = this.dialog.open(FileviewComponent, {
        data: data,
        width: mobilewidth,
        height: mobileheight,
      });
    }
  }

  // onChangeFile(event) {

  //   /* wire up file reader */
  //   const target: DataTransfer = <DataTransfer>(event.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   reader = new FileReader();


  //   if (event.target.files && event.target.files[0]) {
  //     let temp = event.target.files[0];
  //     console.log('File size', event.target.files[0].size)
  //     this.FileName = temp.name;
  //     let nameArray = temp.name.split('.');
  //     let extension = nameArray[nameArray['length'] - 1];
  //     this.FileExte = extension;
  //     if (extension == "xlsx" || extension == "pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
  //       this.isFileUploaded = true;
  //       if (extension == "xlsx") {
  //         let pdf = event.target.files[0];
  //         var reader = new FileReader();
  //         reader.readAsDataURL(pdf);
  //         reader.onload = (event: any) => {
  //           var pdf_url = event.target.result;
  //           console.log("Type", typeof (event.target.result))
  //           this.FileDataType = pdf_url.split(',')[0]
  //           this.FileData = pdf_url.split(',')[1];
  //           this.ext = "pdf"
  //           var pdf_name = temp.name;
  //           reader.onload = (e: any) => {
  //             /* read workbook */
  //             const bstr: string = e.target.result;
  //             const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

  //             /* grab first sheet */
  //             const wsname: string = wb.SheetNames[0];
  //             const ws: XLSX.WorkSheet = wb.Sheets[wsname];

  //             /* save data */
  //             this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
  //             console.log(this.data);
  //           };
  //           reader.readAsBinaryString(target.files[0]);
  //         }
  //       }
  //       else if (extension == "pdf") {
  //         let pdf = event.target.files[0];
  //         var reader = new FileReader();
  //         reader.readAsDataURL(pdf);
  //         reader.onload = (event: any) => {
  //           var pdf_url = event.target.result;
  //           console.log("Type", typeof (event.target.result))
  //           this.FileDataType = pdf_url.split(',')[0]
  //           this.FileData = pdf_url.split(',')[1];
  //           this.ext = "pdf"
  //           var pdf_name = temp.name;
  //           console.log('event', temp);
  //         }
  //       } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
  //         let photo = event.target.files[0];
  //         var reader = new FileReader();
  //         reader.readAsDataURL(photo);
  //         reader.onload = (event: any) => {
  //           this.FileData = event.target.result;
  //           this.FileDataType = this.FileData.split(',')[0]
  //           this.FileData = this.FileData.split(',')[1];
  //           this.ext = "jpg"
  //         }
  //       }
  //     }
  //     else {
  //       this.DisplayMessage("Invalid File", "Alert");
  //       this.FileName = undefined;
  //       this.isFileUploaded = false;
  //     }
  //   }
  // }

  onChangeFile(event) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    reader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size);
      this.FileName = temp.name;

      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1].toLowerCase(); // normalize case
      this.FileExte = extension;

      //  Only allow PDF
      if (extension === "pdf") {
        this.isFileUploaded = true;
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result));
          this.FileDataType = pdf_url.split(',')[0];
          this.FileData = pdf_url.split(',')[1];
          this.ext = "pdf";
          var pdf_name = temp.name;
          console.log('event', temp);
        };
      } else {
        //  Reject non-PDF files
        this.DisplayMessage("Only PDF files are allowed", "Alert");
        this.FileName = undefined;
        this.isFileUploaded = false;
      }
    }
  }


}


