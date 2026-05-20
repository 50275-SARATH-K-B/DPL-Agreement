import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from '../services/report/common.service';
import { RepaymentService } from '../services/report/repayment.service';
import { environment } from '../../environments/environment';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import * as XLSX from 'xlsx';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { ReasonsearchComponent } from '../reasonsearch/reasonsearch.component';
import { DigioesignComponent } from './digioesign/digioesign.component';
import { DOCUMENT } from '@angular/common';
declare var Digio: any;
import './Digio.js';
import { FileviewComponent } from '../commoncomponents/fileview/fileview.component';

@Component({
  selector: 'app-due-date-change',
  templateUrl: './due-date-change.component.html',
  styleUrls: ['./due-date-change.component.scss']
})
export class DueDateChangeComponent implements OnInit {
  datesdata: any = new Date();
  LoanDate: any;
  LoanAmount: any;
  loanID: any;
  userData: any;
  paymentModeList: any;
  customerName: any;
  customerID: any;
  PaymentModeID: any;
  ledgerId: any;
  date: any;
  InstallmentPaid: any;
  TotalInstallment: any;
  UnpaidInstallment: any;
  TotalInterest: any;
  paymentModeSearchType: any;
  paymentMode: any;
  instrumentReference: string;
  instrumentDate: string;
  accountListType: string;
  accountList: any;
  showPaymentMethodExtras: boolean;
  NextInstallment: string;
  LateFee: string;
  OtherCharge: string;
  CurrentDue: any;
  AmountToBePaid: number;
  DueDate: string;
  subledger: any;
  ChequeBounce: any;
  futurePrinciple: any;
  AmountRcvd: any;
  loandtlsList: any;
  changedDate: any;
  Comments: any;
  DueDayList: any;
  DueDayID: any;
  isDisabled: any;
  applicationId: any;
  date1: any;
  funID: any;
  Nextdue: any;
  Gap: any;
  InstallmentAmt: any;
  TreatmentDeatlsList: any;
  TreatmentDetails: any;
  Effective: any;
  Transaction: any;
  Additional: number;
  GapAmount: any;
  FileName: any;
  Reason: any;
  FileData: any;
  FileExte: any;
  FileDataType: any;
  data: any;
  ext: string;
  readonly: boolean;
  flagvalue: number;
  name: string;
  due_date_change_id: any;
  TreatmentDetail: any;
  TreatmentDeatlList: any;
  GapDate: any = [];
  today = new Date();
  year :any
  month: any
  day:any
  maxeffectivedate:any
  address: any;
  customerDetailsList: any[]=[];
  schemeDetailsList: any[]=[];
  phone: any;
  proccessingf: any;
  bouncechrg: any;
  ovrdueamt: any;
  ApprovedAmount: any;
  enterAmnt: any;
  ROI: any;
  upfrontch: any;
  otherch: any;
  netdisb: any;
  apr: any;
  nofrepay: any;
  netrec: any;
  proce: any;
  totalintrchr: any;
  amttobep: any;
  gst: any;
  emiamount: any;
  totintcharge: any;
  totalamtpad: any;
  insuranceamt: any;
  branch: any;
  ifsccode: any;
  banknme: any;
  branchnme: any;
  aacntnum: any;
  schedulelist: any[]=[];
  custname: any;
  schemeid: any;
  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe,
    private router: Router,private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document 
  ) { }
  ngOnInit() {

    this.date = new Date();
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.loanSearch()
    this.getValue()
    this.treatmentDeails()
    this.treatmentDeail()
    this.getValue()
    this.repaymentService.GetPaymentModeDetails({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(result1 => {
     
      if (!!result1 && result1['paymentModeList'] !== null) {
        this.paymentModeList = result1['paymentModeList'];
      }
    }, error => { 
     

      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })

    this.route.params.subscribe((params: Params) => {
      if (!!params && !!params['LoanId']) {
        this.loanID = params['LoanId'];
        this.GetLoanDetails();
      }
      else if (params['params'] == "20") {
        this.name = "Due date Change";
        this.readonly = false
        this.flagvalue = 1
        this.funID = params['params'];
        this.loanSearch();
      } else if (params['params'] == "68") {
        this.name = "Due date Change Cancel";
        this.readonly = true
        this.flagvalue = 4
        this.funID = params['params'];
        this.dueSearch();
      }
    });
    // this.duedate()

  }

  duedate() {
    const params = {
      "LoanId":this.loanID,
      "DueDate":this.Nextdue,
      "DUE_DAY":this.DueDayID
    }
    
    this.repaymentService.getdueData(params).subscribe(result1 => {
     

      if (result1['status'].code == 1 && result1['status'].flag == 1) {
       
        this.GapDate = result1['dateList'];
          let date1=(this.GapDate[0].duedate).split("/")
          let date2=(this.GapDate[1].duedate).split("/")
          let max
        if(date1[2]==date2[2]){
          if(date1[1]>date2[1]){
            max=this.GapDate[0].duedate
          }else{
            max=this.GapDate[1].duedate
          }
        }else if(date1[2]>date2[2]){
          max=this.GapDate[0].duedate
        }else{
          max=this.GapDate[1].duedate
        }

        let day31=["01","03","05","07","08","10","12"]
        let day=[]
        day=max.split("/")
        let days
        if(day[1]=="02"){
          days=28}
        else if(day31.find(obj => obj == day[1])){
          days=31}
        else{
          days=30}

       let month=day[1]
       let year=day[2]
       if(Number(month)==12){
        year=Number(year)+1
       }
       let temp2=+month.toString()+"/"+days.toString()+"/"+year.toString()
       this.maxeffectivedate=new Date(temp2)
      } else {
       
        this.DisplayMessage(result1['status'].message, 'Alert')
      }

    }, error => {
      
      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })

    let params3 = {
      "LOAN_AMT":this.LoanAmount,
      "TENURE":this.TotalInstallment,
      "ROI":this.ROI,
      "customerid":this.customerID
    }
    this.commonService.agrrementdetails(params3).subscribe(res=>{
    this.upfrontch = res['upfrontchg']
    this.otherch = res['otherschg']
    this.netdisb = res['netdisbamt']
    this.apr = res['apr']
    this.nofrepay = res['noofrepay']
    this.proce = res['processfeert']
    this.netrec = res['netdisbamt']
    this.totalintrchr = res['totintchg']
    this.amttobep = res['totamttobepaid']
    this.proccessingf = res['processfeert']

    })
    let par = {
      "LoanAmt": this.enterAmnt,
      "CustomerID": this.customerID,
      "Tenure": this.TotalInstallment,
      "DOB": new Date()
            }

   this.commonService.insuranceamt(par).subscribe(res=>{
   this.insuranceamt = res['insuranceAmt']
            })

            let tenure_dtls:any

                           if(this.TotalInstallment == 12){
                            tenure_dtls = "1^12^1~"
                        
                           }else{
                            tenure_dtls = 1+"^"+this.TotalInstallment+"^"+1+"~"
                           }
            
                let params6 = {
                  'ROI':this.ROI,
                  'LOAN_AMT':this.LoanAmount,
                  'SCHEME_ID':this.schemeid,
                  'TENURE_DTLS':tenure_dtls,
                  'TENURE':this.TotalInstallment
                }
                this.commonService.agreementsched(params6).subscribe(result=>{
                 this.schedulelist = result['instScheduleList']
                })         
  }
  submitflag:boolean=false
  duedateinterest(){
   const params = {
      "LoanId":this.loanID,
      "DueDate":this.Nextdue,
      "DUE_DAY":this.DueDayID
    }
    
    this.repaymentService.getdueDatainterest(params).subscribe(result1 => {
      

      if (result1['status'].flag == 1 && result1['status'].flag == 1) {
       
        this.Gap = result1['gap_Days']
        this.GapAmount = result1['gap_Days_Interest']
      } else {
       
        this.DisplayMessage(result1['status'].message, 'Alert')
      }

    }, error => { 
     
      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })

  }
  public GetLoanDetails() {
    const params = {
      loanid:this.loanID,
      firmid:this.userData['firmID'],
      productid:this.userData['productID'],
    }
    
    this.repaymentService.getInstLoanData(params).subscribe(result1 => {
    

      if (result1['status'].code == 1 && result1['status'].flag == 1) {
       
        this.getSelectedLoanDetails(result1['loanDataList'][0]);
      } else {
       
        this.DisplayMessage(result1['status'].message, 'Alert')
      }

    }, error => { 
     
      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })

  }

  public loanSearch(): void {
    this.loanID
      = this.customerID
      = this.customerName
      = this.LoanDate
      = this.LoanAmount
      = this.InstallmentPaid
      = this.CurrentDue
      = this.DueDate
      = this.DueDayID
      = this.Gap
      = this.Nextdue
      = this.GapAmount
      = this.Additional
      = this.Transaction
      = this.Effective
      = this.TreatmentDetails
      = this.InstallmentAmt
      = this.FileName
      = this.Reason
      = this.Comments
      = this.TreatmentDetail = undefined
    if (this.funID == 61) {
      this.dueSearch()
    } else {
      const dialogRef = this.dialog.open(LoanSearchComponent, {
        height: "80%",
        width: '75%',
      });
      dialogRef.afterClosed().subscribe(result => {
        if (!!result) {
          if (result.loanItem.LoanStatus == 0) {
            this.DisplayMessage("Loan Already Closed", "Alert");
          } else {
           
            this.Transaction = new Date();
            this.applicationId = result.loanItem.ApplId;
            this.getSelectedLoanDetails(result.loanItem);
          }
          this.loanID = result.loanItem.LoanId;
        }
      });
    }
  }

  dueSearch() {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        if (result.loanItem.LoanStatus == 0) {
          this.DisplayMessage("Loan Already Closed", "Alert");
        } else {
         
          this.applicationId = result.loanItem.ApplicationId;
          this.getdueDate(result.loanItem)
        }
        this.loanID = result.loanItem.LoanId;
      }
    });
  }
  Clear() {
    this.AmountToBePaid = this.CurrentDue = this.DueDate = this.NextInstallment = this.LateFee = this.OtherCharge = undefined;
  }

  treatmentDeails() {
    this.commonService.getCommonItemList(this.userData['firmID'],(211), this.userData['productID'])
      .subscribe(result1 => {
        

        if (result1['status'].flag == 1 && result1['status'].code == 1) {
          this.TreatmentDeatlsList = result1['commonDataList'];
        }
      }, error => { 
       

        if(error.includes('401') || error.includes('440')){
          this.router.navigate(['/page-not-found']);
        }
      })

  }

  treatmentDeail() {
    this.commonService.getCommonItemList(this.userData['firmID'],(207),this.userData['productID'])
      .subscribe(result1 => {
        

        if (result1['status'].flag == 1 && result1['status'].code == 1) {
          this.TreatmentDeatlList = result1['commonDataList'];
        }
      }, error => { 
       

        if(error.includes('401') || error.includes('440')){
          this.router.navigate(['/page-not-found']);
        }
      })

  }

  keyPress(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/;
    let value = event.target.value;
     let current: string = value;
      const position = event.target.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(pattern)) {
       event.preventDefault();
      }
  }


  // OnRepaymentSchedule() {
  //   let date = new Date();
  //   const dialogRef = this.dialog.open(RepaymentScheduleComponent, {
  //     width: '75%',
  //     height: '90%',
  //     data: {
  //       ApplicationID: this.applicationId,
  //       isRepayment: true,
  //       insStartDate: date,
  //       loanid: this.loanID
  //         + "^" + this.customerID
  //         + "^" + this.customerName
  //         + "^" + this.LoanDate
  //         + "^" + this.LoanAmount
  //         + "^" + this.InstallmentPaid
  //         + "^" + this.CurrentDue
  //         + "^" + this.DueDate
  //         + "^" + this.DueDayID
  //         + "^" + this.Gap
  //         + "^" + this.Nextdue
  //         + "^" + this.GapAmount
  //         + "^" + this.Additional
  //         + "^" + this.datePipe.transform(this.Transaction, 'dd/MM/yyyy')
  //         + "^" + this.datePipe.transform(this.Effective, 'dd/MM/yyyy')
  //         + "^" + this.TreatmentDetails
  //         + "^" + this.InstallmentAmt
  //         + "^" + this.FileName
  //         + "^" + this.Reason
  //         + "^" + this.Comments
  //         + "^" + this.TreatmentDetail,
  //       funid: this.funID
  //     }
      
  //   });
  // }

  // SOA(MenuId) {
  //   const dialogRef = this.dialog.open(DetailedStatementAccountComponent, {
  //     height: "95%",
  //     width: '100%',
      
  //     data: { value: MenuId }
  //   });
  // }

  getdueDate(loanItem) {
    this.Clear();
    this.loanID = loanItem.LoanId;
    const params = {
      firm_id:this.userData['firmID'],
      product_id:this.userData['productID'],
      loan_id:this.loanID,
      branch_id:this.userData['branchID'],
      User_id:this.userData['empCode']
    }
    
    this.repaymentService.getduecancelCollection(params).subscribe(result1 => {
     
     

      if (result1['status'].code == 1 && result1['status'].flag == 1) {
        if (result1['dueDateChangeGetApprovalList']) {

          var intal = result1['dueDateChangeGetApprovalList'][0].transaction_date.split("/")
          var intalDate = intal[1] + "/" + intal[0] + "/" + intal[2]

          var effect = result1['dueDateChangeGetApprovalList'][0].rescheduling_effective_date.split("/")
          var effectDate = effect[1] + "/" + effect[0] + "/" + effect[2]

          this.loanID = result1['dueDateChangeGetApprovalList'][0].loan_id
          this.customerID = result1['dueDateChangeGetApprovalList'][0].customer_id
          this.customerName = result1['dueDateChangeGetApprovalList'][0].customer_name
          this.LoanDate = result1['dueDateChangeGetApprovalList'][0].loan_date
        
          this.LoanAmount = result1['dueDateChangeGetApprovalList'][0].loan_amount
          this.InstallmentPaid = result1['dueDateChangeGetApprovalList'][0].installment_paid
          this.CurrentDue = result1['dueDateChangeGetApprovalList'][0].current_due
          this.DueDate = result1['dueDateChangeGetApprovalList'][0].due_date
          this.DueDayID = result1['dueDateChangeGetApprovalList'][0].due_day
          this.Gap = result1['dueDateChangeGetApprovalList'][0].gap_days_interest
          this.duedate()
          this.Nextdue = result1['dueDateChangeGetApprovalList'][0].next_due_date
          this.GapAmount = result1['dueDateChangeGetApprovalList'][0].gap_days_interest_ampunt
          this.Additional = result1['dueDateChangeGetApprovalList'][0].additional_charges
          this.Transaction = new Date(intalDate)
          this.Effective = new Date(effectDate)
          this.TreatmentDetails = result1['dueDateChangeGetApprovalList'][0].gaP_DAYS_INTEREST_TREATMENT
          this.TreatmentDetail = result1['dueDateChangeGetApprovalList'][0].treatment_details
          this.InstallmentAmt = result1['dueDateChangeGetApprovalList'][0].installment_amount
          this.FileName = result1['dueDateChangeGetApprovalList'][0].attachementName
          this.Reason = result1['dueDateChangeGetApprovalList'][0].reason
          this.Comments = result1['dueDateChangeGetApprovalList'][0].comments
          this.FileExte = result1['dueDateChangeGetApprovalList'][0].attachement_Ext;
          this.FileData = result1['dueDateChangeGetApprovalList'][0].attachement;
          this.FileDataType = result1['dueDateChangeGetApprovalList'][0].attachement_type;
          this.due_date_change_id = result1['dueDateChangeGetApprovalList'][0].due_date_change_id

          if (this.FileExte == "xlsx") {
            const byteCharacters = atob(this.FileData);
            const bstr: string = byteCharacters
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
          }
        }
      } else {
        this.displayMessage(result1['status'].message, "Alert")
      }

    }, error => { 
     
      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })
  }

  getSelectedLoanDetails(loanItem: any) {
    this.Clear();
    this.loanID = loanItem.LoanId;
    this.LoanDate = this.datePipe.transform(loanItem.LoanDate, 'dd/MM/yyyy');
    this.LoanAmount = loanItem.LoanAmount;
    this.customerName = loanItem.CustName;
    this.customerID = loanItem.CustID;
    this.applicationId = loanItem.ApplId
    this.schemeid = ""
    this.ROI = ""
    let params = {
      "LoginID": this.customerID
    }

    this.commonService.getLoandata(params).subscribe(res=>{
      // console.log(res)
    
      this.customerDetailsList = res['customerDetailsList'][0]
      this.schemeDetailsList= res['schemeDetailsList'][0]
      this.phone = res['customerDetailsList'][0]['CustomerPhone']
      this.bouncechrg = res['customerDetailsList'][0]['BounceCharge']
      this.ovrdueamt = res['customerDetailsList'][0]['OverDueInt']
      if(!!this.customerDetailsList) { 
               
        this.ApprovedAmount = this.customerDetailsList['ApprovedAmt']
        this.enterAmnt = this.customerDetailsList['ApprovedAmt']
      }
      const para = {
        'LOAN_ID':this.loanID
      }

      this.commonService.GetSchemeid(para).subscribe(res=>{
        if (!!res && res['status'].code == 1) {
          this.schemeid = res['schemalist'][0]['schemE_ID']
          this.ROI = res['schemalist'][0]['roi']
        }
        let params4 = {
          "SchemeDtls": "1^12^1~",
          "AmountReq": this.LoanAmount,
          "InterestRate": this.ROI,
          "SchemeID": this.schemeid,
          "CustID": this.customerID
        }
        
        this.commonService.applicationdetails(params4).subscribe(res=>{
          this.gst = res['applicationDataList'][0]['GSTAmt']
          this.emiamount = res['applicationDataList'][0]['EMIAmt']
          this.totintcharge = res['applicationDataList'][0]['InterestAmount']
          this.totalamtpad = res['applicationDataList'][0]['TotalPayable']
    
        })
      })
      const params2 = {
        LoginID: this.customerID
      }
      this.repaymentService.getCollectionDtls(params2).subscribe(res => {
        if (!!res && res['status'].code == 1) {
          let custDtls = res['customerDetailsList'][0];
          let custDtlsStr = custDtls['CustName'];
          this.custname = custDtls['CustName']

          let custDtlsStrVal = custDtlsStr.split('^');
          // this.InstallmentPaid = custDtlsStrVal[4];
          // this.TotalInstallment = custDtlsStrVal[5];
          // this.UnpaidInstallment = custDtlsStrVal[6];
        }
        else {  }
      }, error => {  })
      
    })
    this.commonService.getagreementdetails({"firmId": 1,"customerID":this.customerID}).subscribe(res=>{
      this.address = res['agreementDetails'].split('~')[0]
      })

      this.commonService.getbankdetails({"custID":this.customerID}).subscribe(res=>{
                this.branch = res['bankList'][0]['branch_id']
                this.ifsccode = res['bankList'][0]['ifsccode']
                this.banknme = res['bankList'][0]['beneficiary_bank']
                this.branchnme = res['bankList'][0]['branch_name']
                this.aacntnum = res['bankList'][0]['beneficiaryAccount']
               })
             
    this.emiDay();
    if (!!this.loanID) {
      const params = {
        FIRM_ID: this.userData['firmID'],
        Product_ID:this.userData['productID'],
        LOAN_ID:this.loanID,
        TYPE_ID:(1),
        valueDt:this._rptdatePipe(this.date),
      }
      
      this.repaymentService.getLoanDetailsCollections(params).subscribe(result1 => {
       

        if (result1['status'].code == 1 && result1['status'].flag == 1) {
          this.loandtlsList = result1['loanDetailsList'];
          this.DueDate = this.loandtlsList[0].duE_DATE;
          this.NextInstallment = this.loandtlsList[0].NextInstallment;
          this.LateFee = this.loandtlsList[0].LateFee;
          this.OtherCharge = this.loandtlsList[0].OtherCharges;
          this.CurrentDue = this.loandtlsList[0].CurrentDue;
          this.AmountToBePaid = this.loandtlsList[0].AmtToBePaid;
          this.TotalInterest = this.loandtlsList[0].AccInterest
          this.InstallmentAmt = this.loandtlsList[0].InstallmentAmount
          if (!!this.loanID) {
            const params = {
              LOGIN_ID: this.loanID
            }
            this.repaymentService.getCollectionDtlss(params).subscribe(result1 => {
              
              // if (!!result1 && result1['status'].code == 1) {
                let custDtls = result1['instDetailsList'][0];
                this.InstallmentPaid = custDtls['mxinst'];
                this.TotalInstallment = custDtls['mxTenure'];
                this.UnpaidInstallment = custDtls['balance'];
              // }
              // else { }
            }, error => { 
             
              if(error.includes('401') || error.includes('440')){
                this.router.navigate(['/page-not-found']);
              }
            })
  
          }
          let AmtToBePaid;
          if (!!this.CurrentDue) {
            if (+this.CurrentDue >= 0) {
              AmtToBePaid = (+this.CurrentDue) + (+this.LateFee);
            } else if (+this.CurrentDue < 0) {
              AmtToBePaid = (+this.CurrentDue) + (+this.NextInstallment);
            }
            if (AmtToBePaid < 0) {
              this.AmountToBePaid = 0;
            } else {
              this.AmountToBePaid = AmtToBePaid.toFixed(2);
            }
          }
         
        } else { }
      }, error => { 
       
        if(error.includes('401') || error.includes('440')){
          this.router.navigate(['/page-not-found']);
        }
      })


    }
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
      if (this.userData['branchID'] != null) {
        const subAccountParms = {
          "Account_No":this.ledgerId,
          "Branch_ID":this.userData['branchID'],
          "Firm_ID":this.userData['firmID'],
        };
        this.repaymentService.getSubAccountDetails(subAccountParms)
          .subscribe(result1 => {
           
           
            this.accountList = result1['accountList'];
            this.showPaymentMethodExtras = (this.accountList == "" || this.accountList == null) ? false : true;
          }, error => { 
           
            if(error.includes('401') || error.includes('440')){
              this.router.navigate(['/page-not-found']);
            }
          })

      } else {
        let ledgerItem = this.paymentModeList.find(s => s.PaymentModeID == +this.PaymentModeID);
        this.showPaymentMethodExtras = false;
        if (ledgerItem['LedgerID'] != 33000)
          this.DisplayMessage("Account can't find. Please select other payment mode", "Alert");
       
      }
    }
  }
  onChangeAction(subLederVal) {
    this.subledger = subLederVal;
  }

  DisplayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
    if (type == 'Success') {
      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
  clear(InstallmentForm) {
    InstallmentForm.resetForm();
    this.loanID = undefined;
  }

  additionalchargecharacter(){
    let value=this.Additional
      if(this.Additional){
        if(value.toString().length==1&&value==0){}
        else{
        if(!(value/2)){
        this.displayMessage("Enter valid Additional Charge", "Alert");
        this.Additional=undefined
      }}}
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


  esigndoc(InstallmentForm){
    


          this.submitflag=true
          let customerstring = '';
          if (InstallmentForm.invalid) {
            return
          }
          else {

                if (this.Additional == undefined) {
                  this.Additional = 0
                } else {
                  this.Additional = this.Additional
                }
      
                customerstring =
                  customerstring + +1 + "^" + this.loanID
                  + "^" + this.userData['productID']
                  + "^" + this.userData['branchID']
                  + "^" + this.customerID
                  + "^" + this.customerName
                  + "^" + this.LoanDate
                  + "^" + this.LoanAmount
                  + "^" + this.InstallmentPaid
                  + "^" + this.CurrentDue
                  + "^" + this.DueDate
                  + "^" + this.DueDayID
                  + "^" + this.Gap
                  + "^" + this.Nextdue
                  + "^" + this.GapAmount
                  + "^" + this.Additional
                  + "^" + this._rptdatePipe(this.Transaction)
                  + "^" + this._rptdatePipe(this.Effective)
                  + "^" + this.TreatmentDetails
                  + "^" + this.InstallmentAmt
                  + "^" + this.Reason
                  + "^" + (this.Comments ? this.Comments: "")
                  + "^" + this.TreatmentDetail
                  + "^" + (this.due_date_change_id ? this.due_date_change_id:"")
                  + "^"
      
                let params = {
                  loan_id: this.loanID,
                  product_id: this.userData['productID'],
                  firm_id: this.userData['firmID'],
                  branch_id: this.userData['branchID'],
                  input_data: customerstring,
                  user_id: this.userData['empCode'],
                  attachement: "",
                  attachementName: "",
                  attachement_Ext: "",
                  attachement_type: "",
                  flag:0
                }
                ;
                this.commonService.updateDuedateChange(params).subscribe(result1 => {
                 
      
                 ;
                  if (result1['status'].flag == 1 && result1['status'].code == 1) {
                    this.displayMessage(result1['status']['message'], 'Success');
                    this.clear(InstallmentForm);
                    this.submitflag=false
                  }
                  else {
                    this.displayMessage(result1['status']['message'], 'Alert');
                    this.submitflag=false
                  }
                }, error => { 
                  this.submitflag=false
                 
                  if(error.includes('401') || error.includes('440')){
                    this.router.navigate(['/page-not-found']);
                  }
                })
   
      
          }        


       

       
  }
  esigndocum(id){
    let params = {
      'loanId':this.loanID,
      'documentId':id,
      'ip_address':"",
      'agreementType':"E"
    }
    this.commonService.savedocumentdet(params).subscribe(res=>{
    if(res['status']['message']== 'Success'){
      let param = {
      'documentId':id,
      'loanId':this.loanID,  
      }
      this.commonService.esigndocsave(param).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage('Signing Completed Successfully', 'Success');

      }
      })
    }
    })
  }
  
  duedatechange(InstallmentForm) {
    this.submitflag=true
    let customerstring = '';
    if (InstallmentForm.invalid) {
      return
    }
    else {
      // const dialogRef = this.dialog.open(AlertMessageComponenent, {
      //   width: '30%',
      //   height: '30%'
      // });
      // dialogRef.afterClosed().subscribe(dialogResult => {
        // if (dialogResult == true) {
          if (this.Additional == undefined) {
            this.Additional = 0
          } else {
            this.Additional = this.Additional
          }

          customerstring =
            customerstring + +1 + "^" + this.loanID
            + "^" + this.userData['productID']
            + "^" + this.userData['branchID']
            + "^" + this.customerID
            + "^" + this.customerName
            + "^" + this.LoanDate
            + "^" + this.LoanAmount
            + "^" + this.InstallmentPaid
            + "^" + this.CurrentDue
            + "^" + this.DueDate
            + "^" + this.DueDayID
            + "^" + this.Gap
            + "^" + this.Nextdue
            + "^" + this.GapAmount
            + "^" + this.Additional
            + "^" + this._rptdatePipe(this.Transaction)
            + "^" + this._rptdatePipe(this.Effective)
            + "^" + this.TreatmentDetails
            + "^" + this.InstallmentAmt
            + "^" + this.Reason
            + "^" + (this.Comments ? this.Comments: "")
            + "^" + this.TreatmentDetail
            + "^" + (this.due_date_change_id ? this.due_date_change_id:"")
            + "^"

          let params = {
            loan_id: this.loanID,
            product_id: this.userData['productID'],
            firm_id: this.userData['firmID'],
            branch_id: this.userData['branchID'],
            input_data: customerstring,
            user_id: this.userData['empCode'],
            attachement: "",
            attachementName: "",
            attachement_Ext: "",
            attachement_type: "",
            flag:0
          }
          ;
          this.commonService.updateDuedateChange(params).subscribe(result1 => {
           

           
            if (result1['status'].flag == 1 && result1['status'].code == 1) {
              this.displayMessage(result1['status']['message'], 'Success');
              this.clear(InstallmentForm);
              this.submitflag=false
            }
            else {
              this.displayMessage(result1['status']['message'], 'Alert');
              this.submitflag=false
            }
          }, error => { 
            this.submitflag=false
           
            if(error.includes('401') || error.includes('440')){
              this.router.navigate(['/page-not-found']);
            }
          })

        // }
      // },error => { 
      //   this.submitflag=false
       

      //   if(error.includes('401') || error.includes('440')){
      //     this.router.navigate(['/page-not-found']);
      //   }
      // })

    }
  }

  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: type }
    });
  }
  getValue(): void {
    this.commonService.getCommonItems({ FIRM_ID: this.userData['firmID'],
     COMMON_DATA_TYPE_ID:(162),
     PRODUCT_ID:this.userData['productID'] })
      .subscribe(result1 => {
      
        this.DueDayList = result1['commonDataList']
      }, error => { 
       

        if(error.includes('401') || error.includes('440')){
          this.router.navigate(['/page-not-found']);
        }
      })

  }
  emiDay() {
    let param = {
      FIRM_ID: this.userData['firmID'],
      Product_ID: this.userData.productID,
      Loan_ID: this.loanID
    };
    this.commonService.getEmiDay(param).subscribe(result1 => {
      

      this.DueDate = result1['emI_DAY'];

    }, error => { 
     

      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })

  }



  onChangeFile(event) {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();

    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      this.FileName = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[1];
      this.FileExte = extension;
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          this.FileDataType = pdf_url.split(',')[0]
          this.FileData = pdf_url.split(',')[1];
          this.ext = "pdf"
          var pdf_name = temp.name;
          reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
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
          this.FileDataType = pdf_url.split(',')[0]
          this.FileData = pdf_url.split(',')[1];
          this.ext = "pdf"
          var pdf_name = temp.name;
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
      }else{
        this.DisplayMessage("File Extension not supported", 'Alert')
        const target: DataTransfer = undefined
        this.FileName = undefined
      }
    }else{
      this.displayMessage("Invalid File", "Alert");

    }
    }
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
  resonSearch() {
    const dialogRef = this.dialog.open(ReasonsearchComponent, {
      height: "75%",
      width: '100%',
      data: { value: this.funID }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.Reason = result['reason_name']
    })
  }
}



