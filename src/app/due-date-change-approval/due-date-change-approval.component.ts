import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { CommonService } from '../services/report/common.service';
import { RepaymentService } from '../services/report/repayment.service';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { environment } from '../../environments/environment';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-due-date-change-approval',
  templateUrl: './due-date-change-approval.component.html',
  styleUrls: ['./due-date-change-approval.component.scss']
})
export class DueDateChangeApprovalComponent implements OnInit {


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
  Additional: any;
  GapAmount: any;
  FileName: any;
  Reason: any;
  FileData: any;
  FileExte: any;
  FileDataType: any;
  data: any;
  ext: string;
  EmpCode: any;
  Name: any;
  flagvalueApproval: number;
  flagvaluereject: number;
  falgvalue: number;
  name: string;
  due_date_change_id: any;
  TreatmentDetail: any;

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private repaymentService: RepaymentService,
    private datePipe: DatePipe,
    private router: Router,
    
  ) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.date = new Date();
    this.repaymentService.GetPaymentModeDetails
    ({ FIRM_ID: this.userData['firmID'], flag: 1, PRODUCT_ID: this.userData['productID'] }).subscribe(res => {
     

      if (!!res && res['paymentModeList'] !== null) {
        this.paymentModeList = res['paymentModeList'];
      }
    }, error => { 
      

      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })
    this.route.params.subscribe((params: Params) => {
      if (!!params && !!params['loanid']) {
        if (!!params && !!params['funID']) {
          if (params['funID'] == "64") {
            this.name = "Due date Change Approval";
            this.funID = params['funID'];
            this.flagvalueApproval = 2
            this.flagvaluereject = 3
            this.applicationId = params['Application'];
            this.duevalue(params['loanid']);
          }
          else if (params['funID'] == "69") {
            this.name = "Due date Change Cancel Approval";
            this.funID = params['funID'];
            this.flagvalueApproval = 6
            this.flagvaluereject = 5
            this.applicationId = params['Application'];
            this.duecancelvalue(params['loanid']);
          }
        }
      } else if (params['params'] == "64") {
        this.name = "Due date Change Approval";
        this.flagvalueApproval = 2
        this.flagvaluereject = 3
        this.funID = params['params'];
        this.loanSearch();
      }
      else if (params['params'] == "69") {
        this.name = "Due date Change Cancel Approval";
        this.flagvalueApproval = 6
        this.flagvaluereject = 5
        this.funID = params['params'];
        this.loanSearch();
      }
    });
  }

  public loanSearch(): void {
    
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        
        if (result.loanItem.LoanStatus == 0) {
          this.DisplayMessage("Loan Already Closed", "Success");
        } else {
          this.loanID = result.loanItem.LoanId;
          this.applicationId = result.loanItem.ApplicationId;
          if (this.funID == 70 || this.funID == "69") {
            this.duecancelvalue(result.loanItem.LoanId)
          } else {
            this.duevalue(result.loanItem.LoanId);
          }
        }
      }
    });
  }

  duecancelvalue(LoanId) {
    this.Clear();
    this.loanID = LoanId;
    const params = {
      firm_id:this.userData['firmID'],
      product_id:this.userData['productID'],
      loan_id:this.loanID,
      branch_id:this.userData['branchID'],
      User_id:this.userData['empCode'],
    }
   
    this.repaymentService.getduecancelCollection(params).subscribe(res => {
      
     
      if (res['status'].code == 1 && res['status'].flag == 1) {
        if (res['dueDateChangeGetApprovalList']) {
          this.loanID = res['dueDateChangeGetApprovalList'][0].loan_id
          this.customerID = res['dueDateChangeGetApprovalList'][0].customer_id
          this.customerName = res['dueDateChangeGetApprovalList'][0].customer_name
          this.LoanDate = res['dueDateChangeGetApprovalList'][0].loan_date
          this.LoanAmount = res['dueDateChangeGetApprovalList'][0].loan_amount
          this.InstallmentPaid = res['dueDateChangeGetApprovalList'][0].installment_paid
          this.CurrentDue = res['dueDateChangeGetApprovalList'][0].current_due
          this.DueDate = res['dueDateChangeGetApprovalList'][0].due_date
          this.DueDayID = res['dueDateChangeGetApprovalList'][0].due_day
          this.Gap = res['dueDateChangeGetApprovalList'][0].gap_days_interest
          this.Nextdue = res['dueDateChangeGetApprovalList'][0].next_due_date
          this.GapAmount = res['dueDateChangeGetApprovalList'][0].gap_days_interest_ampunt
          this.Additional = res['dueDateChangeGetApprovalList'][0].additional_charges
          this.Transaction = res['dueDateChangeGetApprovalList'][0].transaction_date
          this.Effective = res['dueDateChangeGetApprovalList'][0].rescheduling_effective_date
          this.TreatmentDetails = res['dueDateChangeGetApprovalList'][0].gaP_DAYS_INTEREST_TREATMENT
          this.TreatmentDetail = res['dueDateChangeGetApprovalList'][0].treatment_details
          this.InstallmentAmt = res['dueDateChangeGetApprovalList'][0].installment_amount
          this.FileName = res['dueDateChangeGetApprovalList'][0].attachementName
          this.Reason = res['dueDateChangeGetApprovalList'][0].reason
          this.Comments = res['dueDateChangeGetApprovalList'][0].comments
          this.FileExte = res['dueDateChangeGetApprovalList'][0].attachement_Ext;
          this.FileData = res['dueDateChangeGetApprovalList'][0].attachement;
          this.FileDataType = res['dueDateChangeGetApprovalList'][0].attachement_type;
          this.EmpCode = res["dueDateChangeGetApprovalList"][0].requesteD_BY
          this.Name = res["dueDateChangeGetApprovalList"][0].requesteD_NAME

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
        this.DisplayMessage(res['status'].message, "Alert")
      }

    }, error => { 
      

      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })
  }

  Clear() {
    this.AmountToBePaid = this.CurrentDue = this.DueDate = this.NextInstallment = this.LateFee = this.OtherCharge = undefined;
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


  duevalue(loanID) {
    let params = {
      loan_id:loanID,
      product_id:this.userData['productID'],
      firm_id:this.userData['firmID'],
      branch_id:this.userData['branchID'],
      User_id:this.userData['empCode']
    }
    this.commonService.GetDuedateChange(params).subscribe(res => {
    

      if (res['status'].flag == 1 && res['status'].code == 1) {
        this.loanID = res['dueDateChangeGetApprovalList'][0].loan_id
        this.customerID = res['dueDateChangeGetApprovalList'][0].customer_id
        this.customerName = res['dueDateChangeGetApprovalList'][0].customer_name
        this.LoanDate = res['dueDateChangeGetApprovalList'][0].loan_date
        this.LoanAmount = res['dueDateChangeGetApprovalList'][0].loan_amount
        this.InstallmentPaid = res['dueDateChangeGetApprovalList'][0].installment_paid
        this.CurrentDue = res['dueDateChangeGetApprovalList'][0].current_due
        this.DueDate = res['dueDateChangeGetApprovalList'][0].due_date
        this.DueDayID = res['dueDateChangeGetApprovalList'][0].due_day
        this.Gap = res['dueDateChangeGetApprovalList'][0].gap_days_interest
        this.Nextdue = res['dueDateChangeGetApprovalList'][0].next_due_date
        this.GapAmount = res['dueDateChangeGetApprovalList'][0].gap_days_interest_ampunt
        this.Additional = res['dueDateChangeGetApprovalList'][0].additional_charges
        this.Transaction = res['dueDateChangeGetApprovalList'][0].transaction_date
        this.Effective = res['dueDateChangeGetApprovalList'][0].rescheduling_effective_date
        this.TreatmentDetails = res['dueDateChangeGetApprovalList'][0].gaP_DAYS_INTEREST_TREATMENT
        this.TreatmentDetail = res['dueDateChangeGetApprovalList'][0].treatment_details
        this.InstallmentAmt = res['dueDateChangeGetApprovalList'][0].installment_amount
        this.FileName = res['dueDateChangeGetApprovalList'][0].attachementName
        this.Reason = res['dueDateChangeGetApprovalList'][0].reason
        this.Comments = res['dueDateChangeGetApprovalList'][0].comments
        this.FileExte = res["dueDateChangeGetApprovalList"][0].attachement_Ext;
        this.FileData = res["dueDateChangeGetApprovalList"][0].attachement;
        this.FileDataType = res["dueDateChangeGetApprovalList"][0].attachement_type;

        this.EmpCode = res["dueDateChangeGetApprovalList"][0].requesteD_BY
        this.Name = res["dueDateChangeGetApprovalList"][0].requesteD_NAME

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
      else {
        this.DisplayMessage(res['status'].message, 'Alert');
      }
    }, error => { 
      

      if(error.includes('401') || error.includes('440')){
        this.router.navigate(['/page-not-found']);
      }
    })
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
  //         + "^" + this.Transaction
  //         + "^" + this.Effective
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
  schedulelist: any[]=[];
  phone: any;
  custname: any;
  address: any;
  ROI: any;

  duedatechange(InstallmentForm, flag) {
    // var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var c1 = 0 ;var c2 = 0;var c3 = 0; var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

    // // Define the string
    // var string = 'Hello World!';
    
    // // Encode the String
    // var d = Base64.encode('AIMEMSX9C3ROHTSTNJJA67M7BPM4RBJ9:4G77IBRMXDUBFOYMT3MM9UDEMBA4DTMK');
    // var decodedString = Base64.decode(d);
    
    //     let pos = {"llx":90.12,"lly":236,"urx":259.71,"ury":298}
    //     let posar1 = []
    //         posar1.push(pos)
    //     let pos2 = {"llx":90.12,"lly":236,"urx":259.71,"ury":298}
    //     let posar2 = []
    //         posar2.push(pos2)
    //     let signers = {1:posar1,2:posar2}
    //     let day = this._rptdatePipe(new Date()).split('/')[0]
    //     let duedat = this.DueDate +'/'+ this._rptdatePipe(new Date()).split('/')[1] + '/'+ this._rptdatePipe(new Date()).split('/')[2]
    //     // let values = {"agreementDate":this._rptdatePipe(new Date()),"name":this.customerName,"bname":this.customerName,"address":this.address,"loanAmount":this.LoanAmount,"loanDate":this.LoanDate,"interestRate":this.ROI,"tenure":this.TotalInstallment,"processingFee":this.proccessingf,"odRate":"3","bounceCharge":"500","totInterest":this.totalintrchr,"totintchg":this.totalintrchr,"totamount":this.amttobep,"otherupfrontchg":this.upfrontch,"otherchgs":this.otherch,"netdisbursed":this.netdisb,"totemi":this.amttobep,"apr":this.apr,"noofrepayinstall":this.nofrepay,"prfeert":this.proce,"BranchCode":"it","ApplicationNo":100,"ApplicationDate":this._rptdatePipe(new Date()),"SanctionDate":this._rptdatePipe(new Date()),"CustomerID":this.customerID,"ApplicantName":this.customerName,"PresentAddress":this.address,"PermenantAddress":this.address,"PhoneNo":this.phone,"EmailID":" ","Type":"personalLoan","Amount":this.LoanAmount,"LoanTenure":this.TotalInstallment,"InterestType":"monthly","Interest":this.ROI,"Periodicity":this.customerName,"Security":"not applicable","Installment":this.emiamount,"EMI":"0","InsuranceAmount":this.insuranceamt,"ProcessingFee":this.proce,"UpfrontFees":"0","Balance":"0","totprinciple":this.LoanAmount,"emailaddress":"","creditlinked":this.insuranceamt,"emiamount":this.emiamount,"dueday":this.day,"Accno":this.aacntnum,"ifsc":this.ifsccode,"bnkname":this.banknme,"place":this.branchnme,"mobile":this.phone,"regmobile":this.phone,"purpose":"Personal","type":"Savings Account"}
    //     let values = {"reason":this.Reason,"emidate":duedat,"loanno":this.loanID,"Address":this.address,"loantype":"Personal Loan","newdate":this.Nextdue,"Date":duedat,"Name":this.customerName}

    //     // for(let i=0;i<this.schedulelist.length;i++){
    //     //   values['dueDate'+(i+1)] = this.schedulelist[i]['DueDate']
    //     //   values['principle'+(i+1)] = this.schedulelist[i]['PrincipalAmount']
    //     //   values['Interest'+(i+1)] = this.schedulelist[i]['InterestAmount']
    //     //   values['emi'+(i+1)] = this.schedulelist[i]['InstallmentAmount']
    //     //   values['outstanding'+(i+1)] = this.schedulelist[i]['OpeningBalance']
    //     // }
       

    //     let param =
    //       {"template_values":values,
    //       "signers":[{"identifier":this.phone,"name":this.custname,"reason":"Manappuram Personal Loan Note"}],
    //       "sign_coordinates":{[this.phone]:signers}
    //     }
       
    //     this.commonService.digioesign(param,d,this.TotalInstallment).subscribe(res=>{
          
    //     if(!!res['id']){
    if (flag == 2) {
      this.falgvalue = 2

    }
    else {
      this.falgvalue = 3
    }
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
      //   if (dialogResult == true) {
         


          customerstring =
            customerstring + +this.falgvalue + "^" + this.loanID
            + "^" +this.userData['productID']
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
            + "^" + this.Transaction
            + "^" + this.Effective
            + "^" + this.TreatmentDetails
            + "^" + this.InstallmentAmt
            + "^" + this.Reason
            + "^" + this.Comments
            + "^" + this.TreatmentDetail
            + "^"


          let params = {
            loan_id: this.loanID,
            product_id:this.userData['productID'],
            firm_id: this.userData['firmID'],
            branch_id: this.userData['branchID'],
            input_data: customerstring,
            user_id: this.userData['empCode'],
            attachement: "",
            attachementName: "",
            attachement_Ext: "",
            attachement_type: "",
          }
          this.commonService.updateDuedateChange(params).subscribe(res => {
            
            
            if (res['status'].flag == 1 && res['status'].code == 1) {
              this.DisplayMessage(res['status']['message'], 'Success');
              this.clear(InstallmentForm);
            }
            else {
              this.DisplayMessage(res['status']['message'], 'Alert');
            }
          }, error => { 
            

            if(error.includes('401') || error.includes('440')){
              this.router.navigate(['/page-not-found']);
            }
          })
      //   }
      // })
    }
//   }else{
//     this.DisplayMessage("Please try again", 'Alert');

//   }
// })
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


  // onChangeFile(event) {
  //   const target: DataTransfer = <DataTransfer>(event.target);
  //   if (target.files.length !== 1) throw new Error('Cannot use multiple files');
  //   reader = new FileReader();
  //   if (event.target.files && event.target.files[0]) {
  //     let temp = event.target.files[0];
  //     this.FileName = temp.name;
  //     let nameArray = temp.name.split('.');
  //     let extension = nameArray[nameArray['length'] - 1];
  //     this.FileExte = extension;
  //     if (extension == "xlsx") {
  //       let pdf = event.target.files[0];
  //       var reader = new FileReader();
  //       reader.readAsDataURL(pdf);
  //       reader.onload = (event: any) => {
  //         var pdf_url = event.target.result;
  //         this.FileDataType = pdf_url.split(',')[0]
  //         this.FileData = pdf_url.split(',')[1];
  //         this.ext = "pdf"
  //         var pdf_name = temp.name;
  //         reader.onload = (e: any) => {
  //           const bstr: string = e.target.result;
  //           const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  //           const wsname: string = wb.SheetNames[0];
  //           const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //           this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
  //         };
  //         reader.readAsBinaryString(target.files[0]);
  //       }
  //     }
  //     else if (extension == "pdf") {
  //       let pdf = event.target.files[0];
  //       var reader = new FileReader();
  //       reader.readAsDataURL(pdf);
  //       reader.onload = (event: any) => {
  //         var pdf_url = event.target.result;
  //         this.FileDataType = pdf_url.split(',')[0]
  //         this.FileData = pdf_url.split(',')[1];
  //         this.ext = "pdf"
  //         var pdf_name = temp.name;
  //       }
  //     } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
  //       let photo = event.target.files[0];
  //       var reader = new FileReader();
  //       reader.readAsDataURL(photo);
  //       reader.onload = (event: any) => {
  //         this.FileData = event.target.result;
  //         this.FileDataType = this.FileData.split(',')[0]
  //         this.FileData = this.FileData.split(',')[1];
  //         this.ext = "jpg"
  //       }
  //     }
  //   }
  // }

  // OpenFile(): any {
  //   if (!!this.FileData) {
  //     var data = {
  //       "isView": true,
  //       "exte": this.FileExte,
  //       'file': this.FileData,
  //       'Filetype': this.FileDataType,
  //       "execl": this.data
  //     };
  //     let mobilewidth = "50%";
  //     let mobileheight = "auto";
  //     if (window.innerWidth < 599) {
  //       mobilewidth = "95%";
  //       mobileheight = "75%";
  //     }
  //     const dialogRef = this.dialog.open(FileviewComponent, {
  //       data: data,
  //       width: mobilewidth,
  //       height: mobileheight,
  //     });
  //   }
  // }

}