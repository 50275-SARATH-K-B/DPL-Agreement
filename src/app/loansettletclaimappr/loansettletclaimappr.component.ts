import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoanSearchComponent } from './../common/loan-search/loan-search.component';
import { CommonService } from './../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from './../app.settings';
import { Settings } from './../app.settings.model';
import { RepaymentService } from './../services/report/repayment.service';
import { AlertMessageComponenent } from './../commoncomponents/alertpopup/alertpopup.component';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-loansettletclaimappr',
  templateUrl: './loansettletclaimappr.component.html',
  styleUrls: ['./loansettletclaimappr.component.scss']
})
export class LoansettletclaimapprComponent implements OnInit {


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
  public overdueAmount: string = ''
  settlementAmount2: any
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
  accountListType2: any

  collectionDate: any = new Date();
  today: any = new Date();
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
  data: any[];

  public settings: Settings;
  collectionvalueDate: any;
  onChange: any;
  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
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
    this.commonService.getclaimsettleappr().subscribe(res => {
      this.accountList = res['insurancesettleList']
    })
    
    this.commonService.getclaimsettleappr().subscribe(res => {
      this.accountList = res['insurancesettleList']
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

  loanSearch() {

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
  onChangeAction2(event) {
    this.settlementAmount = ""
    this.principalOutstanding = ""
    this.otherCharges = ""
    this.customerID = ""
    this.customerName = ""
    this.loanDate = ""
    this.loanAmount = ""
    this.settlementAmount2 = ""
    this.installmentPaid = ""
    this.totalInstallment = ""
    this.unpaidInstallment = ""
    this.FileName = ""
    this.FileData = ""
    this.FileExte = ""
    const params = {
      "loan_id": event

    };
    this.settings.loadingSpinner = true;
    this.repaymentService.claimsettleget(params)
      .subscribe(res => {
        //   console.log(res);
        if (res['status'].code == 1) {
          this.settings.loadingSpinner = true;

          this.settings.loadingSpinner = false;
          this.settlementAmount = res['settlementval']
          this.principalOutstanding = res['loanBalance'];
          this.otherCharges = res['othercharges'];
          // this.installmentPaid = loanDetailsList[0];
          this.customerID = res['customer_id']
          this.customerName = res['customer_name']
          this.loanDate = res['loan_date']
          this.loanAmount = res['loan_amonut']
          this.settlementAmount2 = res['settlementval']
          this.paymentdropdown();
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
          })
          let para = {
            "loan_id": event
          }
          this.repaymentService.getclaimdoc1(para).subscribe(res => {
            this.FileName = "Document"
            this.FileData = res['documents']
            this.FileExte = "pdf"
          })

        } else {
          this.DisplayMessage(res['status'].message, "Alert");
          this.settings.loadingSpinner = false;
        }
      }, error => {
        this.settings.loadingSpinner = false;
      });
  }





  selectchange() {
    if (this.settlementAmount == this.settlementAmount2) {

    } else {
      this.settlementAmount2 = undefined
      this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

    }
  }
  public confirm(settlementForm): void {


    let payDtls: string = "";
    // payDtls = !!this.PaymentModeID ? this.PaymentModeID : '@';
    // payDtls = payDtls +"^"+ !!this.ledgerId ? this.ledgerId : '@';
    // payDtls = payDtls  +"^"+ !!this.subledger ? this.subledger : '@';
    // payDtls = payDtls  +"^"+ !!this.instrumentReference ? this.instrumentReference : '@';
    // payDtls = payDtls  +"^"+ !!this.instrumentDate ? this.instrumentDate: '@';
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
      "cust_id": this.customerID,
      "loanId": this.accountListType2,
      "collectionAmt": this.settlementAmount2,
      "paymentDtls": payDtls,
      "flag": 1
    }
    this.settings.loadingSpinner = true;
    console.log(params)
    this.repaymentService.loansettleclaimconfirm(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].code == 1) {
        this.DisplayMessage(res['status'].message, 'Success');
        this.clear(settlementForm);
        this.accountList = []
        this.commonService.getclaimsettleappr().subscribe(res => {
          this.accountList = res['insurancesettleList']
        })

      }
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })
  }


  public rejects(settlementForm): void {


    let payDtls: string = "";
    // payDtls = !!this.PaymentModeID ? this.PaymentModeID : '@';
    // payDtls = payDtls +"^"+ !!this.ledgerId ? this.ledgerId : '@';
    // payDtls = payDtls  +"^"+ !!this.subledger ? this.subledger : '@';
    // payDtls = payDtls  +"^"+ !!this.instrumentReference ? this.instrumentReference : '@';
    // payDtls = payDtls  +"^"+ !!this.instrumentDate ? this.instrumentDate: '@';
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
      "cust_id": this.customerID,
      "loanId": this.accountListType2,
      "collectionAmt": this.settlementAmount2,
      "paymentDtls": payDtls,

    }
    this.settings.loadingSpinner = true;
    console.log(params)
    this.repaymentService.loansettleclaimconfirm(params).subscribe(res => {
      this.settings.loadingSpinner = false;
      if (!!res && res['status'].code == 1) {
        this.DisplayMessage(res['status'].message, 'Success');
        this.clear(settlementForm);
        this.accountList = []
        this.commonService.getclaimsettleappr().subscribe(res => {
          this.accountList = res['insurancesettleList']
        })

      }
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
      }
    },
      err => {
        this.settings.loadingSpinner = false;
        this.clear(settlementForm);
      })
  }



  public clear(settlementForm): void {
    this.settlementAmount = ""
    this.principalOutstanding = ""
    this.otherCharges = ""
    this.customerID = ""
    this.customerName = ""
    this.loanDate = ""
    this.loanAmount = ""
    this.settlementAmount2 = ""
    this.paymentModeSearchType = ""
    this.installmentPaid = ""
    this.totalInstallment = ""
    this.unpaidInstallment = ""
    this.FileName = ""
    this.FileData = ""
    this.FileExte = ""
    var component = this;
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

  onChangeAction(subLederVal) { this.subledger = subLederVal; }



  paymentdropdown() {

    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] })
      .subscribe(res => {

        if (!!res && res['paymentModeList'] !== null) {
          // let dd = []

          // dd.push(res['paymentModeList'].find(s => s.PaymentMode == "INSURANCE"))
          // this.paymentModeList = dd;
          // this.paymentModeSearchType = dd[0];
          let insuranceItem = res['paymentModeList'].find(s => s.PaymentMode === "INSURANCE");

          if (insuranceItem) {            
            this.paymentModeList = [insuranceItem];
            let selectedString = `${insuranceItem.LedgerID}^${insuranceItem.PaymentModeID}^${insuranceItem.PaymentMode}`;
            this.paymentModeSearchType = selectedString;
          }
        }
      }, err => {
        this.settings.loadingSpinner = false;
      })
  }

}
