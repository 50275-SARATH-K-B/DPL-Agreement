import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }


  public exportAsExcelFile(json: any[], excelFileName: string): any {
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(json, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, excelFileName + " Data");
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(wbout, excelFileName)
    // saveAs(new Blob([wbout],{type:"application/octet-stream"}), "test.xlsx");
    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    // const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): any {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
