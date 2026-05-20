import { Component, OnInit } from '@angular/core';
import { ReportsService } from "../../../services/reports/reports.service";
import { ExportService } from "../../../services/reports/export.service";
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent implements OnInit {

  constructor(private reportService: ReportsService, private exportService: ExportService, private dialog: MatDialog) { }
  reportData: any;
  queryList: any;

  ngOnInit() {

    this.reportService.getQuryList()
      .subscribe(result => {
        if (result['status'].code == 1 && result['status'].flag == 1) {
          this.queryList = result['names'];
        } else {
          this.displayMessage(result['status'].message, "Alert");
        }
      })
  }

  queryID: any;
  onQueryChange(queryID) {
    if (!!queryID) {
      this.reportService.getExcelReport({ QueryId: +queryID })
        .subscribe(result => {
          if (result['status'].flag == 1 && result['status'].code == 1) {
            let array = [];
            let length = result['result'].length;
            array.push(result['header']['Header'].split('||'));
            for (let i = 0; i < result['result'].length; i++) {
              array.push(result['result'][i].split('||'));
              if (i + 1 == length) {
                this.reportData = array;
                this.generateExcel();
              }
            }
          } else {
            this.displayMessage(result['status'].message, "Alert");
          }
        }, error => { })
    }
  }

  generateExcel() {
    this.queryID = undefined;
    this.exportService.exportAsExcelFile(this.reportData, 'sample');
  }
  
  displayMessage(message: string, type: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: "30%",
      data: { message: message, type: type }
    });
  }
}
