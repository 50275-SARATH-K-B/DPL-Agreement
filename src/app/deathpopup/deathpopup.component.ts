import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonService } from '../services/report/common.service';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';

@Component({
  selector: 'app-deathpopup',
  templateUrl: './deathpopup.component.html',
  styleUrls: ['./deathpopup.component.scss']
})
export class DeathpopupComponent implements OnInit {
  intimationrcvd:boolean = false
  docrcvd:boolean
  appsubmit:boolean
  appresubmit:boolean
  claimrcvd:boolean
  accclsd:boolean
  docrsvd: boolean = false;
  appsub: boolean = false;
  appresub: boolean = false;
  clamrsd: boolean = false;
  accclsdbool: boolean = false;
  intimatboo:boolean = false
  Transaction: any;
  intimrcvd: any;
  docrcveed: any;
  resubmittted: any;
  climmrecvs: any;
  appsubbb: string;
  accntclosdd: string;
  appresubbb: string;
  clamamt: any;
  insuramt: any;
  constructor(public dialog: MatDialog,public dialogRef: MatDialogRef<DeathpopupComponent>,@Inject(MAT_DIALOG_DATA) public data: DeathpopupComponent,private commonService: CommonService) { }

  ngOnInit() {
   let  d = null
 
   this.refresh()
  }
  datediff(first, second) {        
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
 }
  setAll(checked){
    
    this.intimationrcvd = checked
  }
  setAll2(checked){
   this.docrcvd = checked
  }
  setAll3(checked){
   this.appsubmit = checked
  }
  setAll4(checked){
  this.appresubmit = checked
  }
  setAll5(checked){
  this.claimrcvd=checked
  }
  setAll6(checked){
  this.accclsd = checked
  }
  confirm(role){
  if(role == 1){
     let params = {
      "loan_id": this.data['loan_id'],
      "intimation_received": this._rptdatePipe(this.Transaction)
     }

     this.commonService.intimationdate(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }else if(role ==2){
    let params = {
      "loan_id": this.data['loan_id'],
      "document_received": this._rptdatePipe(this.Transaction)
     }

     this.commonService.docrecieveddte(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }else if(role == 3){
    let params = {
      "loan_id": this.data['loan_id'],
      "application_submitted": this._rptdatePipe(this.Transaction)
     }

     this.commonService.applisubmit(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }else if(role ==5){
    let params = {
      "loan_id": this.data['loan_id'],
      "claim_recieved": this._rptdatePipe(this.Transaction),
      "claim_amount": this.clamamt,
      "insurancenumber": this.insuramt
     }

     this.commonService.claimamtsub(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }else if(role == 6){
    let params = {
      "loan_id": this.data['loan_id'],
      "account_closed_date":this._rptdatePipe(this.Transaction)
     }

     this.commonService.accntcloded(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }else if(role ==4){
    let params = {
      "loan_id": this.data['loan_id'],
      "application_resubmitted":this._rptdatePipe(this.Transaction)
     }

     this.commonService.appliresubmittt(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
        this.displayMessage(res['outputmsg'], "Success");
        this.dialogRef.close();
      }else{
        this.displayMessage(res['status']['message'], "Alert");

      }
     })
  }
  }
  refresh(){
    let params = {
      "loan_id":this.data['loan_id']
    }
    this.commonService.refreshapi(params).subscribe(res=>{
      if(res['status']['code'] == 1 && res['status']['flag'] == 1){
          this.docrsvd = true
          
          if(!!res['datedetails'][0]['intimation_received']){
            let date = this._rptdatePipe(res['datedetails'][0]['intimation_received'])
            this.intimrcvd = !!res['datedetails'][0]['intimation_received']?this._rptdatePipe(res['datedetails'][0]['intimation_received']):null
            this.docrcveed = !!res['datedetails'][0]['document_received']?this._rptdatePipe(res['datedetails'][0]['document_received']):null
            this.appsubbb = !!res['datedetails'][0]['application_submitted']?this._rptdatePipe(res['datedetails'][0]['application_submitted']):null
            this.resubmittted = !!res['datedetails'][0]['application_resubmitted']?this._rptdatePipe(res['datedetails'][0]['application_resubmitted']):null
            this.climmrecvs = !!res['datedetails'][0]['claim_recieved']?this._rptdatePipe(res['datedetails'][0]['claim_recieved']):null
            this.accntclosdd = !!res['datedetails'][0]['account_closed_date']?this._rptdatePipe(res['datedetails'][0]['account_closed_date']):null
            this.appresubbb = !!res['datedetails'][0]['application_resubmitted']?this._rptdatePipe(res['datedetails'][0]['application_resubmitted']):null
            let now = new Date()
            let lag = this.datediff(new Date(date),now) 
            let docrec = this.datediff(new Date(res['datedetails'][0]['document_received']),now)
            let clmrcvd = this.datediff(new Date(this.appsubbb),now) 
            let accntclsed = this.datediff(new Date(res['datedetails'][0]['claim_recieved']),now)
            let resubapp = this.datediff(new Date(res['datedetails'][0]['application_resubmitted']),now)
            if(res['datedetails'][0]['intimation_received'] !== null && lag >15){
              this.intimatboo = true

              this.docrsvd = false
           }
          if(res['datedetails'][0]['document_received'] !== null && docrec >3){
             this.appsub = false
             this.docrsvd = true

          }else{
            this.appsub = true

          }
          
         if(res['datedetails'][0]['application_submitted'] !==null && clmrcvd >15){
           this.clamrsd = false
           this.appsub = true

         }else{
          this.clamrsd = true
         }
        if(res['datedetails'][0]['claim_recieved'] !==null && accntclsed >3){
          this.clamrsd = true
          this.accclsdbool = false
        }else{
          this.accclsdbool = true

        }
        if(res['datedetails'][0]['account_closed_date'] !==null ){
          this.accclsdbool = true

        }else{

        }
        if(res['datedetails'][0]['application_resubmitted'] !==null && resubapp > 15){
          this.clamrsd = false
          this.appsub = true
        }else{
          // this.clamrsd = true

        }
          }
    
      }
      
    })
    
  }
  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: type }
    });
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
   return date.getDate() + '-' +   months[date.getMonth() + 1] + '-' + date.getFullYear();
  }
}
