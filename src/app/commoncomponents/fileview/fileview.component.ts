import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-fileview',
  templateUrl: './fileview.component.html',
  styleUrls: ['./fileview.component.scss']
})
export class FileviewComponent implements OnInit {
  public fileExtention: string = "";
  public fileName: string = "";
  fileArray: any[]=[];
  IsImage: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    debugger
    if (!!this.data && this.data !== null && this.data !== '') {
      if (!!this.data['isView']) {
        this.fileExtention = this.data['exte'];
      } else {
        this.fileExtention = this.data['exte'].split('.')[1];
      }
      this.fileName = this.data['file'];
      
      if (this.data['exte'] === "jpeg" || this.data['exte'] === "jpg" || this.data['exte'] == "png" || this.data['exte'] === ".jpeg" || this.data['exte'] === ".jpg" || this.data['exte'] == ".png") {
        this.fileName = 'data:image/jpeg;base64,' + this.data['file'];
        this.IsImage = true;
     
      } 
      this.fileArray.push(this.fileName);

    }
  }
  downloadd(){
    this.downloadFile(this.fileName,this.data.type,this.fileExtention)
    // if (window.navigator.userAgent.toLowerCase().indexOf('trident') > -1) { //For IE browser
    //   const byteCharacters = atob(this.fileName);
    //   const byteNumbers = new Array(byteCharacters.length);
    //   for (var i = 0; i < byteCharacters.length; i++) {
    //     byteNumbers[i] = byteCharacters.charCodeAt(i);
    //   }
    //   const byteArray = new Uint8Array(byteNumbers);
    //   const blob = new Blob([byteArray], { type: 'image/jpeg' }); // change the file type accordingly
    //   if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
    //     (window.navigator as any).msSaveOrOpenBlob(blob, this.data.custid+ "_" + this.data.type+ ".jpeg"); 
    //   }
    // } else { //For other browsers
    //   const linkSource = 'data:image/jpeg;base64,' + this.fileName;
    //   const downloadLink = document.createElement("a");
    //   const fileName = this.data.custid+ "_" + this.data.type+ ".jpeg";
    
    //   downloadLink.href = linkSource;
    //   downloadLink.download = fileName;
    //   downloadLink.click();
    // }
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
