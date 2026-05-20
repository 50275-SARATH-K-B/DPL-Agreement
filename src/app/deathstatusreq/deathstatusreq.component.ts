import { Component, OnInit } from '@angular/core';
import { LoanSearchComponent } from '../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material/dialog';
import { FileviewviewComponent } from '../fileviewview/fileviewview.component';
import * as XLSX from 'xlsx';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { CommonService } from '../services/report/common.service';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';

@Component({
  selector: 'app-deathstatusreq',
  templateUrl: './deathstatusreq.component.html',
  styleUrls: ['./deathstatusreq.component.scss']
})
export class DeathstatusreqComponent implements OnInit {
  loanId:any
  loanAmount:any
  branchnmaee:any
  nominname:any
  deathdte:any
  remarks:any
  deathceritf:any
  nominepan:any
  nomineeadh:any
  nomineebank:any
  FileData: any;
  FileExte: any;
  deathbasedata: any;
  deathext: string;
  deathname: any;
  deathdtype: any;
  nomineeadrname: any;
  nomineeadhaartype: any;
  nomineebase: any;
  nomineeext: string;
  nompanname: any;
  nomineepantypw: any;
  nominpanbase: any;
  nomineepanext: string;
  nomineebanknme: any;
  nominnebnktype: any;
  nomineebankbase: any;
  nomineebnkext: string;
  nomnieeadress: any;
  cusname: any;
  public settings: Settings;

  constructor(public appSettings: AppSettings,private dialog: MatDialog,private commonService: CommonService) { 
    this.settings = this.appSettings.settings;

  }

  ngOnInit() {
    this.commonService.session2()

    this.displayLoanSearchPopup()

  }
  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
      }
    });
  }
  getSelectedLoanDetails(loanid){
   let params = {
    "loan_id": loanid.LoanId
   }

   this.commonService.deathdetails(params).subscribe(res=>{
if(res['status']['code']==1 && res['status']['flag'] ==1) {
  this.loanId = loanid.LoanId
   this.cusname = loanid.CustName
   this.loanAmount = res['deathinfo'][0]['loan_amount']
   this.branchnmaee = res['deathinfo'][0]['branch_name']
   this.nominname = res['deathinfo'][0]['nominee_name']
   this.nomnieeadress = res['deathinfo'][0]['nominee_address']
}else{
  this.displayMessage(res['status']['message'], 'Alert');

}
})
  }

  OpenFile(): any {
    if (!!this.deathbasedata) {
      let dataI = {
        file: this.deathbasedata,
        exte: this.deathext,
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

  onChangeFile1(event) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.deathname = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" || extension == "PDF" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.deathdtype = pdf_url.split(',')[0]
          this.deathbasedata = pdf_url.split(',')[1];
          this.deathext = "pdf"
          var pdf_name = temp.name;
          reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            // this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
            // console.log(this.data);
          };
          reader.readAsBinaryString(target.files[0]);
        }
      }
      else if (extension == "pdf" || extension == "PDF") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.deathdtype = pdf_url.split(',')[0]
          this.deathbasedata = pdf_url.split(',')[1];
          this.deathext = "pdf"
          var pdf_name = temp.name;
          console.log('event', temp);
        }
      } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
        let photo = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = (event: any) => {
          this.deathbasedata = event.target.result;
          this.deathdtype = this.deathbasedata.split(',')[0]
          this.deathbasedata = this.deathbasedata.split(',')[1];
          this.deathext = "jpg"
        }
      }
    }
    else{
    this.DisplayMessage("Invalid File", "Alert");
    this.deathname = undefined;
          }
    }
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
  onChangeFile2(event) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.nomineeadrname = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.nomineeadhaartype = pdf_url.split(',')[0]
          this.nomineebase = pdf_url.split(',')[1];
          this.nomineeext = "pdf"
          var pdf_name = temp.name;
          reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            // this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
            // console.log(this.data);
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
          this.nomineeadhaartype = pdf_url.split(',')[0]
          this.nomineebase = pdf_url.split(',')[1];
          this.nomineeext = "pdf"
          var pdf_name = temp.name;
          console.log('event', temp);
        }
      } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
        let photo = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = (event: any) => {
          this.nomineebase = event.target.result;
          this.nomineeadhaartype = this.nomineebase.split(',')[0]
          this.nomineebase = this.nomineebase.split(',')[1];
          this.nomineeext = "jpg"
        }
      }
    }
    else{
            this.DisplayMessage("Invalid File", "Alert");
    this.nomineeadrname = undefined;
          }
    }
  }
  onChangeFile3(event) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.nompanname = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.nomineepantypw = pdf_url.split(',')[0]
          this.nominpanbase = pdf_url.split(',')[1];
          this.nomineepanext = "pdf"
          var pdf_name = temp.name;
          reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            // this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
            // console.log(this.data);
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
          this.nomineepantypw = pdf_url.split(',')[0]
          this.nominpanbase = pdf_url.split(',')[1];
          this.nomineepanext = "pdf"
          var pdf_name = temp.name;
          console.log('event', temp);
        }
      } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
        let photo = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = (event: any) => {
          this.nominpanbase = event.target.result;
          this.nomineepantypw = this.nominpanbase.split(',')[0]
          this.nominpanbase = this.nominpanbase.split(',')[1];
          this.nomineepanext = "jpg"
        }
      }
    }
    else{
            this.DisplayMessage("Invalid File", "Alert");
    this.nompanname = undefined;
          }
    }
  }
  onChangeFile4(event) {

    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');
    reader = new FileReader();


    if (event.target.files && event.target.files[0]) {
      let temp = event.target.files[0];
      console.log('File size', event.target.files[0].size)
      this.nomineebanknme = temp.name;
      let nameArray = temp.name.split('.');
      let extension = nameArray[nameArray['length'] - 1];
      this.FileExte = extension;
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.nominnebnktype = pdf_url.split(',')[0]
          this.nomineebankbase = pdf_url.split(',')[1];
          this.nomineebnkext = "pdf"
          var pdf_name = temp.name;
          reader.onload = (e: any) => {
            /* read workbook */
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            // this.data = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
            // console.log(this.data);
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
          this.nominnebnktype = pdf_url.split(',')[0]
          this.nomineebankbase = pdf_url.split(',')[1];
          this.nomineebnkext = "pdf"
          var pdf_name = temp.name;
          console.log('event', temp);
        }
      } else if (extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG") {
        let photo = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onload = (event: any) => {
          this.nomineebankbase = event.target.result;
          this.nominnebnktype = this.nomineebankbase.split(',')[0]
          this.nomineebankbase = this.nomineebankbase.split(',')[1];
          this.nomineebnkext = "jpg"
        }
      }
    }
    else{
    this.DisplayMessage("Invalid File", "Alert");
    this.nomineebanknme = undefined;
          }
    }
  }
  OpenFile2(): any {
    if (!!this.nomineebase) {
      let dataI = {
        file: this.nomineebase,
        exte: this.nomineeext,
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
  OpenFile3(): any {
    if (!!this.nominpanbase) {
      let dataI = {
        file: this.nominpanbase,
        exte: this.nomineepanext,
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
  OpenFile4(): any {
    if (!!this.nomineebankbase) {
      let dataI = {
        file: this.nomineebankbase,
        exte: this.nomineebnkext,
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

  confirm(form){

   let params = {
    "death_certificate_filename":this.deathname,
    "death_certificate_extention":this.deathext,
    "death_certificate":this.deathbasedata,
    "nominee_adhar_filename":this.nomineeadrname,
    "nominee_adhar_extention":this.nomineeext,
    "nominee_adhar":this.nomineebase,
    "nominee_pan_filename":this.nompanname,
    "nominee_pan_extention":this.nomineepanext,
    "nominee_pan":this.nominpanbase,
    "nominee_bank_details_filename":this.nomineebanknme,
    "nominee_bank_details_extention":this.nomineebnkext,
    "nominee_bank_details":this.nomineebankbase,
    "loan_id":this.loanId,
    "loan_amount":this.loanAmount,
    "branch_name":this.branchnmaee,
    "nominee_name":this.nominname,
    "nominee_address":this.nomnieeadress,
    "death_date":this._rptdatePipe(this.deathdte),
    "remarks":this.remarks,
    "customer_name":this.cusname,
    "status":1,
    "request_date": this._rptdatePipe(new Date())

   }
   this.settings.loadingSpinner = true;
   this.commonService.deathreconfirm(params).subscribe(res=>{
   if(res['status']['flag']==1 && res['status']['code']==1){
    this.settings.loadingSpinner = false;

    this.displayMessage(res['status']['message'], 'Success');
    form.resetForm()
    this.clear(form)
   }else{
    this.settings.loadingSpinner = false;

    this.displayMessage(res['status']['message'], 'Alert');

   }
   }, error => {
    this.settings.loadingSpinner = false;

   })
  }
  clear(settlementForm){
    this.remarks = ""
    this.loanId = ""
    this.loanAmount = ""
    this.branchnmaee = ""
    this.nominname = ""
    this.nomnieeadress = ""
    this.deathdte = ""
    this.remarks = ""
    this.deathname = "",
    this.deathext = "",
    this.deathbasedata = "",
    this.nomineeadrname = "",
    this.nomineeext = "",
    this.nomineebase = "",
    this.nompanname = "",
    this.nomineepanext = "",
    this.nominpanbase = "",
    this.nomineebanknme = "",
    this.nomineebnkext = "",
    this.nomineebankbase = ""
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
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
}
