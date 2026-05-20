import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { MatDialog } from '@angular/material';
import { Settings } from '../../../app.settings.model';
import { AppSettings } from '../../../app.settings';
import { CommonService } from '../../../services/report/common.service';
import { ActivatedRoute, Params } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { environment } from '../../../../environments/environment';
import { FileviewerComponent } from '../fileviewer/fileviewer.component';
import { CommonalertComponent } from '../../../commoncomponents/commonalert/commonalert.component';
import { SelectionModel } from '@angular/cdk/collections';
export interface Installment {
LoanID:string
ReceivableDate:string;
BusinessPartner:string;
ChargeDescription:string;
DueAmount:number;
position: number;
TaxAmount:number;
OverDueAmout:number;
WaiveOffAmount:number;
WaivedAmount:number;
}
@Component({
  selector: 'app-waiver-entry',
  templateUrl: './waiver-entry.component.html',
  styleUrls: ['./waiver-entry.component.scss']
})
export class WaiverEntryComponent implements OnInit {
  @ViewChild('ref') checkboxRef: ElementRef;

  public settings: Settings;
  userData: any;
  LoanId: any;
  reasonArray: any[];
  FileName: any;
  FileExte: any;
  FileData: any;
  ext: string;
  waiverList: any[] = []
  public installmentList: Installment[] = [];

  loanID: string;
  data: any;
  public SuccessDataSource = new MatTableDataSource<any>();
  FileDataType: any;
  dataSource = new MatTableDataSource<Installment>(this.installmentList);

  addressLines: string[] = [];
  showFlag: boolean = false;
  date2: any;
  funID: any;
  Reasoncode: any;
  displayedColumnsSuccess = ["LoanID", "ReceivableDate", "BusinessPartner", "ChargeDescription", "DueAmount", "TaxAmount", "OverDueAmout", "WaiveOffAmount", "WaivedAmount"];
  public selection = new SelectionModel<Installment>(true, []);
  public selectedDatas: Array<object> = [];

  waiverListDetail: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  waiverListlength: number;
  datacheck: number;
  DocumentFile: any;
  Attachment: any;




  constructor(public dialog: MatDialog, public appSettings: AppSettings, private commonService: CommonService, public route: ActivatedRoute) {this.settings = this.appSettings.settings; }

  ngOnInit() {
    // this.waiverListDetail =[{
    //   "LoanID":1231,
    //   "ReceivableDate":"10/11/2022",
    //   "BusinessPartner":"vinay",
    //   "ChargeDescription":"overdue amount",
    //   "DueAmount":333,
    //   "TaxAmount":33,
    //   "OverDueAmout":454,
    //   "ChargeCode":25

    // },
    // {
    //   "LoanID":1433,
    //   "ReceivableDate":"10/11/2022",
    //   "BusinessPartner":"anoop",
    //   "ChargeDescription":"overdue amount",
    //   "DueAmount":333,
    //   "TaxAmount":33,
    //   "OverDueAmout":454,
    //   "ChargeCode":25

    // },
    // {
    //   "LoanID":1233,
    //   "ReceivableDate":"10/11/2022",
    //   "BusinessPartner":"ram",
    //   "ChargeDescription":"overdue amount",
    //   "DueAmount":333,
    //   "TaxAmount":33,
    //   "OverDueAmout":454,
    //   "ChargeCode":25

    // }]
    // this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);

    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    this.date2 = new Date();
    this.route.params.subscribe((params: Params) => {
      if (!!params && !!params['params']) {
        this.funID = params['params'];
        this.displayLoanSearchPopup();

      }
    });
    this.displayLoanSearchPopup();



  }
  public checkboxLabel(row?: Installment): string {
   
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
  public isSomeSelected() {
    this.selectedDatas = this.selection.selected;
    return this.selection.selected.length > 0;
  }
  public masterToggle(ref) {
    console.log(ref)
    if (this.isSomeSelected()) {
      this.selection.clear();
      ref.checked = false;
    } else {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
    this.selectedDatas = this.selection.selected;
  }
  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    // console.log(numSelected)
    const numRows = this.SuccessDataSource.data.length;
    // console.log(numRows)
    return numSelected === numRows;
  }
  reasons() {
    const param = {
      "FIRM_ID": this.userData['firmID'],
      "PRODUCT_ID": 69,
      "ReasonId": 1
    }
    // this.settings.loadingSpinner = true;
    this.commonService.reason(param).subscribe(appsearch => {
      this.settings.loadingSpinner = false;
      this.reasonArray = []
      if (appsearch['status'].code == "1" && appsearch['status'].flag == "1") {
        var sizevalue = Object.keys(appsearch.reasonlist).length;
        for (let i = 0; i < sizevalue; i++) {
          this.reasonArray.push({
            reason_code: appsearch.reasonlist[i].reason_code,
            reason_id: appsearch.reasonlist[i].reason_id,
            reason_name: appsearch.reasonlist[i].reason_name,
          })
        }
      }
      else {
        this.displayMessage(appsearch['status'].message, "Alert")
      }
    })
  }
  public displayLoanSearchPopup(): void {
  this.clearDataSource()
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.loanItem.LoanStatus == 0) {
          this.displayMessage("Loan Already Closed", "Success");
        } else {
          this.LoanId = result.loanItem.LoanId;
          console.log(this.LoanId)
          this.date2 = new Date();
          this.waiverListDetail = [];
          this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);
          setTimeout(() => {
            this.SuccessDataSource.paginator = this.paginator;
          }, 250);
          this.GetWaiverDetailsForEntry(this.LoanId);

        }
      }

    });
  }
  GetWaiverDetailsForEntry(LoanId) {
    this.settings.loadingSpinner = true;
    // debugger;
    const params = {
      FIRM_ID: this.userData['firmID'],
      BRANCH_ID: this.userData['branchID'],
      LoanID: LoanId
    }
    this.commonService.GetWaiverDetailsForEntry(params).subscribe(result => {
      this.settings.loadingSpinner = false;
      if (result['status'].code == 1 && result['status'].flag == 1) {
        console.log(result);
        this.waiverList = result['waiveList'];
       this.reasons()
        this.waiverList.forEach(element => {
          let Duedetail = {
            LoanID: element['loan_id'],
            ReceivableDate: this._rptdatePipe(element['ReceivableDate']),
            BusinessPartner: element['BusinessPartner'],
            ChargeDescription: element['ChargeDescription'],
            DueAmount: element['DueAmount'],
            TaxAmount: element['TaxAmount'],
            OverDueAmout: element['OverDueAmout'], 
            WaiveOffAmount: "",
            WaivedAmount: "",
            ChargeCode: element['ChargeCode'],
            ChargeAmt: element['ChargeAmt'],
            TRANS_ID: element['TRANS_ID'],
            wavierindicator:element['WaiverTaxInd']
          }
          this.waiverListDetail.push(Duedetail);
        });
        this.waiverListlength = this.waiverListDetail.length;
        this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);
        console.log(this.SuccessDataSource);
        setTimeout(() => {
          this.SuccessDataSource.paginator = this.paginator;
        }, 250);
      }
      else {
        this.displayMessage(result['status'].message, "Alert");
      }
    })
  }
 
  clearDataSource() {
    this.waiverListDetail = [];
    this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);
    this.LoanId = undefined;
    this.date2 = "";
    this.FileName = undefined;
    this.Reasoncode = "";
  }
  displayMessage(message, type): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });

  }
  Calculation(data,i: any) {

    this.waiverListDetail = this.waiverListDetail.filter((value,key)=>{
      if(value.id == data.id){
        if(data.WaiveOffAmount<=data.DueAmount){
        if(data.ChargeCode == "25"){
        var item : any;
        item = data.WaiveOffAmount;
        var waived = item*18/118;
       data.WaivedAmount = Math.round(waived*100)/100;

        }
        else{
          data.WaivedAmount = 0;
        } 
      }
      else{
        data.WaiveOffAmount="";
        data.WaivedAmount = "";
        this.displayMessage("Wave-Off amount should be less than the Due amount","Alert")
      }
      }
      return true;
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
  confirm() {
    this.datacheck=0
    var arrayList: any;
    arrayList = this.SuccessDataSource.data;
    for (var i = 0; i < arrayList.length; i++) {
      if (arrayList[i].WaiveOffAmount == "") {
        arrayList[i].WaiveOffAmount = 0;
      }
      this.datacheck=this.datacheck+Number(arrayList[i].WaiveOffAmount)
    }
   
     if(this.datacheck!=0){
    
    const dialogRef = this.dialog.open(CommonalertComponent, {
      width: '35%',
      height: '35%'
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      console.log(dialogResult)
      if (dialogResult == true) {
        var arrayList: any;
        var paramsList: any[] = [];
        arrayList = this.SuccessDataSource.data;
        console.log(arrayList)
        for (var i = 0; i < arrayList.length; i++) {
          if (arrayList[i].WaiveOffAmount == "") {
            arrayList[i].WaiveOffAmount = 0;
          }
         
          var valuedate = this._rptdatePipe(this.date2)
          const params = {
            WaiveData: arrayList[i].LoanID + "^" + arrayList[i].ReceivableDate + "^" + arrayList[i].WaiveOffAmount + "^" + arrayList[i].ChargeDescription + "^" + arrayList[i].ChargeAmt + "^" + arrayList[i].DueAmount + "^" + arrayList[i].OverDueAmout + "^" + arrayList[i].TaxAmount + "^" + arrayList[i].WaivedAmount + "^" + arrayList[i].ChargeCode + "^" + this.Reasoncode + "^" + arrayList[i].TRANS_ID + "^" + valuedate,
            Waiveamount: arrayList[i].WaiveOffAmount
          }
          paramsList.push(params);
        }
        console.log(paramsList);
       
        if (paramsList.length > 0) {
          this.settings.loadingSpinner = true;
          const data = {
            FirmID: this.userData['firmID'],
            BranchID: this.userData['branchID'],
            UserID: this.userData['empCode'],
            waivedataList: paramsList,
            attachement: this.FileData,
            attachement_ext: this.ext,
            attachement_type: this.FileDataType,
            attachement_name: this.FileName
          }
          console.log(data);
          
          this.commonService.PostWaiverDetails(data).subscribe(res => {
            this.settings.loadingSpinner = false;
            if (res['status'].code == 1 && res['status'].flag == 1) {
              console.log(res);
              this.displayMessage(res['status'].message, "Success");
              this.waiverListDetail = [];
              this.SuccessDataSource = new MatTableDataSource(this.waiverListDetail);
              this.LoanId = undefined;
              this.DocumentFile = undefined;
              this.FileExte = undefined;
              this.Attachment = undefined;
            }
            else {
              this.displayMessage(res['status'].message, "Alert");
            }
          })
        }
    
    }
  })
}else{ 
  this.displayMessage("Please enter Waive-Off Amount", "Alert");
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
      if(extension == "xlsx" || extension =="pdf" || extension == "jpg" || extension == "png" || extension == "jpeg" || extension == "PNG" || extension == "JPG" || extension == "JPEG" ){
      if (extension == "xlsx") {
        let pdf = event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(pdf);
        reader.onload = (event: any) => {
          var pdf_url = event.target.result;
          console.log("Type", typeof (event.target.result))
          this.FileDataType = pdf_url.split(',')[0]
          this.FileData = pdf_url.split(',')[1];
          this.ext = "xlsx"
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
    }else{
      this.displayMessage("Invalid File", "Alert");

    }
      
    }
  }
  keyPress(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/;
    // let inputChar = String.fromCharCode(event.charCode);
    // if (event.keyCode != 8 && !pattern.test(inputChar)) {
    //   event.preventDefault();
    // }

    let value = event.target.value;
    let current: string = value;
    const position = event.target.selectionStart;
    const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    if (next && !String(next).match(pattern)) {
      event.preventDefault();
    }
  }
  
  overdueroundoff(waveoff:any,dueamt:any){
    console.log(waveoff);
    console.log(dueamt);
    
    
    if(waveoff>dueamt){
      
    }
    this[0].WaiveOffAmount="qdqjwnkj"

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
      const dialogRef = this.dialog.open(FileviewerComponent, {
        data: data,
        width: mobilewidth,
        height: mobileheight,
      });
    }
  }


}
