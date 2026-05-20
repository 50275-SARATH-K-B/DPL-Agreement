import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-fileviewer',
  templateUrl: './fileviewer.component.html',
  styleUrls: ['./fileviewer.component.scss']
})
export class FileviewerComponent implements OnInit {

  public fileExtention: string = "";
  public fileName: string = "";
  fileArray: any = [];
  IsImage: boolean = false;
  Isexecl: boolean;
  IsImagepdf: boolean;
  datavalue: any;
  constructor(private dialogs:MatDialogRef<FileviewerComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    console.log(this.data)
    this.IsImage = false;
    if (!!this.data && this.data !== null && this.data !== '') {
      if (!!this.data['isView']) {
        this.fileExtention = this.data['exte'];
      } else {
        this.fileExtention = this.data['exte'].split('.')[1];
      }
      if (this.data['exte'] === "jpeg" || this.data['exte'] === "jpg" || this.data['exte'] == "png") {
        this.fileName = 'data:image/jpeg;base64,' + this.data['file'];
        this.IsImage = true;
        this.Isexecl = false;
        this.IsImagepdf = false;
      } else if(this.data['exte'] === "xlsx"){
        this.fileName = this.data['file'];
        this.IsImage = false;
        this.Isexecl = true;
        this.IsImagepdf = false;
        this.datavalue = this.data["execl"]
      }
      else {
        this.fileName = this.data['file'];
        this.IsImage = false;
        this.Isexecl = false;
        this.IsImagepdf = true;
      }

      this.fileArray.push(this.fileName);
    }
  }

     close(){
     this.dialogs.close();
   }

  download() {
    this.downloadFile(this.fileName, 'file', this.fileExtention);
  }

  downloadFile(data, file_name, ext) {
    if (ext === ".png" || ext === "png" || ext === '.PNG' || ext === 'PNG') {
      let dataURL = data;
      var file_ext = '.png';
      var a = document.createElement("a");
      a.download = file_name + file_ext;
      a.href = dataURL;
      document.body.appendChild(a);
      a.click();
    } else if (ext === ".jpg" || ext === "jpg") {
      // var dataURL = "data:image/jpeg;base64," + data;
      let dataURL = data;
      var file_ext = '.jpg';
      var a = document.createElement("a");
      a.download = file_name + file_ext;
      a.href = dataURL;
      document.body.appendChild(a);
      a.click();
    } else if (ext === "pdf") {
      let pdfWindow = window.open("");
      pdfWindow.document.write("<iframe width='100%' height='100%' src='data:application/pdf;base64, " + encodeURI(data) + "'></iframe>");
      pdfWindow.document.title = file_name + '.pdf';
    } else {
      this.exportexcel("tableWithHeader",file_name)
    }
  }
  exportexcel(id,name): void {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, name + ".xlsx");

  }
}
