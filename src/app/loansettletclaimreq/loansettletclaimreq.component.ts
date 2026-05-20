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
  selector: 'app-loansettletclaimreq',
  templateUrl: './loansettletclaimreq.component.html',
  styleUrls: ['./loansettletclaimreq.component.scss']
})
export class LoansettletclaimreqComponent implements OnInit {
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  ext: string;
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
  paymentModeList2: any
  collectionDate: any = new Date();
  today: any = new Date();
  loan__id: any

  public settings: Settings;
  collectionvalueDate: any;
  data: any[];
  constructor(public router: Router,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommonService, public appSettings: AppSettings, private repaymentService: RepaymentService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()


    this.list()
    // this.displayLoanSearchPopup();
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] })
      .subscribe(res => {

        if (!!res && res['paymentModeList'] !== null) {
          let dd = []

          dd.push(res['paymentModeList'].find(s => s.PaymentMode == "INSURANCE"))
          this.paymentModeList = dd;
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
  list() {
    this.paymentModeList2 = []

    let params = {
      "user_Id": this.userData['empCode']
    }
    this.commonService.claimdropdown(params).subscribe(res => {
      if (res['status'].code == 1 && res['status'].flag == 1) {
        this.paymentModeList2 = res['insurancesettleList']
      } else {


      }
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
  claimchange(event) {
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
      "loan_id": this.loan__id

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
          this.settlementAmount = res['settlementval']
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
            "loan_id": this.loan__id
          }
          this.repaymentService.getclaimdoc(para).subscribe(res => {
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
              this.loanAmount = res['loan_amonut']

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

  selectchange() {
    if (this.settlementAmount == this.settlementAmount2) {

    } else {
      this.settlementAmount2 = undefined
      this.DisplayMessage('Please Go to Installment Recipet Page to Pay Amount', 'Alert');

    }
  }
  public confirm(settlementForm): void {
    if (this.settlementAmount != this.settlementAmount2) {
      this.DisplayMessage("Settlement Amount and Confirm Amount should be equal", "Alert");


    } else {

      let params = {
        "loan_id": this.loan__id,
        "loan_amount": this.loanAmount,
        "settlement_amount": this.settlementAmount,
        "requested_empcode": this.userData['empCode'],
        "requested_date": this._rptdatePipe(new Date()),
        "status": 1,
        "cliam_amount": 0,
        "document": this.FileData,
      }
      this.settings.loadingSpinner = true;
      console.log(params)
      this.repaymentService.insuranceconfirm(params).subscribe(res => {
        this.settings.loadingSpinner = false;
        if (!!res && res['status'].code == 1) {
          this.DisplayMessage(res['status'].message, 'Success');
          this.clear(settlementForm);
          this.list()


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
    this.installmentPaid = ""
    this.totalInstallment = ""
    this.unpaidInstallment = ""
    this.FileName = ""
    this.FileData = ""
    this.FileExte = ""
    this.paymentModeSearchType = ""
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

}
