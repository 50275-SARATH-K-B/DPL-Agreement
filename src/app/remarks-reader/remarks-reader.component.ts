import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import * as XLSX from 'xlsx';
import { FileviewviewComponent } from '../fileviewview/fileviewview.component';

@Component({
  selector: 'app-remarks-reader',
  templateUrl: './remarks-reader.component.html',
  styleUrls: ['./remarks-reader.component.scss']
})
export class RemarksReaderComponent implements OnInit {
  ext: string;

  reasonMasterID: any;
  reasonMasterList: any;
  reasonText: any;
  userData: any;
  reasonArray: any;
  Recpect: any;
  Recepethandle: any;
  FileName: any;
  FileExte: any;
  FileDataType: any;
  FileData: any;
  data: any[];

  constructor (private commonService: CommonService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RemarksReaderComponent>
  ) {
  }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.getRemarksMaster();
    this.Receipts()
  }
  public close(): void {
    this.dialogRef.close({ filenme:this.FileName,ext:this.FileExte,file:this.FileData,filetype:this.FileDataType,reasonMasterID: this.reasonMasterID, reasonText: this.reasonText , receiptText: this.Recepethandle });
  }
  postReason(ReasonForm) {
    if(ReasonForm.valid){
    this.close();
    }
  }
  displayMessage(message, type) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
     
    });
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
      const dialogRef = this.dialog.open(FileviewviewComponent, {
        data: data,
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
    else{
            this.displayMessage("Invalid File", "Alert");
    this.FileName = undefined;
          }
    }
  }
  Receipts() {
    this.commonService.getCommonItemList(this.userData['firmID'],210,this.userData['productID'])
      .subscribe(res => {
       
          this.Recpect = res['commonDataList'];
          console.log( this.Recpect )
      })
  }


  getRemarksMaster() {
    this.commonService.getCommonItemList(this.userData['firmID'], 165,this.userData['productID'])
    .subscribe(result => {
      
       
        this.reasonArray = result['commonDataList'];
        console.log( this.reasonArray)
      
    })
  }

}
