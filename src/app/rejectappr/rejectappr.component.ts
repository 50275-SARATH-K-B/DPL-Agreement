import { Component, Inject, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { FileviewviewComponent } from '../fileviewview/fileviewview.component';

@Component({
  selector: 'app-rejectappr',
  templateUrl: './rejectappr.component.html',
  styleUrls: ['./rejectappr.component.scss']
})
export class RejectapprComponent implements OnInit {
  ext: string;
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  reasonMasterID : any ;
  reasonMasterList : any ;
  reasonText : any ;
  userData: any;
   can_edit:boolean = false;
   EmpCode:any;
   Name:any;
  
   data1: any[];

  constructor(private commonService: CommonService,  public dialogRef: MatDialogRef<RejectapprComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {


   console.log(this.data)
   this.EmpCode=this.data.data["REQUESTED_BY"]
   this.Name=this.data.data["REQUESTED_NAME"]

   

    this.userData = this.commonService.getCredentials();
    // this.getRemarksMaster();
    this.can_edit = false;
    this.approvaldata(this.data.trans,this.data.lnid)
  }
  approvaldata(tid,lnid){
    this.EmpCode = ""
  let param = {
    "loan_id":lnid,
    'trans_id':tid
  }
  
  
  this.commonService.collectdocsve(param).subscribe(res=>{

    this.FileData = res['settlementList'][0]['attachment']
    this.FileExte = res['settlementList'][0]['attachement_Ext']
    this.EmpCode = res['settlementList'][0]['userid']
    this.FileName = res['settlementList'][0]['attachementname']
    this.EmpCode = res['settlementList'][0]['userid']
    this.Name = res['settlementList'][0]['requesteD_NAME']
  })
   }
  public close(): void {
    this.dialogRef.close({ reasonMasterID: "1", reasonText :"w"});
  }
  postReason(ReasonForm) {
    //alert('double click');

    this.close();
  }
  getRemarksMaster() {
    
    this.commonService.getCommonItemListlms(this.userData['firmID'], 165,69)
      .subscribe(result => {
        this.reasonMasterList = result['commonDataList'];
        let Customer = this.reasonMasterList.find(s => s.CommonDataName == this.data.data['Remark_id']);
        console.log(Customer)
        this.reasonMasterID = Customer['CommonDataName']
        this.reasonText =this.data.data['Remark_text']
        if (result['status'].flag == 1 && result['status'].code == 1) {
        }
      })

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
            this.data1 = (XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: 'dd-MM-yyyy' }));
            console.log(this.data1);
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
    else{
    this.displayMessage("Invalid File", "Alert");
    this.FileName = undefined;
          }
    }
  }
  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
     
    });
  }
}
