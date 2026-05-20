import { Component, OnInit } from '@angular/core';
import { defaultValues } from '../../../../environments/environment';
import { ReportsService } from '../../../services/reports/reports.service';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog } from '@angular/material';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-collection-report',
  templateUrl: './collection-report.component.html',
  styleUrls: ['./collection-report.component.scss']
})
export class CollectionReportComponent implements OnInit {

  constructor(private _reportsService: ReportsService,
    private _dialog: MatDialog) { }
  public field: object;
  public total: string = '0.00';
  public collectionList: Array<object> = [];
  ngOnInit() {
    this._init();
  }
  private _init(): void {
    this.field = {
      loanNo: "",
      from_date: "",
      to_date: "",
      type: 1
    }
  }
  public search(): void {
    this.collectionList = [];
    if (this.field['from_date'] > this.field['to_date']) {
      this._displayMesage({ type: "Alert", message: "'From Date' should be less than 'To Date'" });
      return;
    }
    const params = {
      FIRM_ID: defaultValues.FIRM_ID,
      FROM_DT: this._datePipe(this.field['from_date']),
      TO_DT: this._datePipe(this.field['to_date']),
      optionID: 1
    }
    if (+this.field['type'] == 1) {
      params['LOAN_NO'] = this.field['loanNo'];
      params['optionID'] = 2
    }
    this.total = '0.00';
    this._reportsService.getCollectionDetails(params).subscribe((res) => {
      if (!!res && res['status'].code == 1) {
        if (res['collList'] !== null) {
          res['collList'].forEach(element => {
            element['ReceiptDate'] = this._datePipe(new Date(element['ReceiptDate']));
            this.total = element['CollectionAmount'] + (+this.total);
          });
          this.collectionList = res['collList'];
          this.total = (+this.total).toFixed(2);
        }
      } else {
        this._displayMesage({ type: "Alert", message: res['status'].message })
      }
    })
  };
  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }
  private _displayMesage(params): void {
    const dialogRef = this._dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: params['message'], type: params['type'] }
    });
  }
  public convert(): void {
    if (this.collectionList.length > 0) {
      var doc = new jspdf();
      doc.setFontSize(10);
      doc.setFontStyle('bold');
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      doc.text('COLLECTION REPORT', pageWidth / 2, 16, 'center');
      jspdf.autoTableSetDefaults({
        columnStyles: { id: { fontStyle: 'bold' } },
        headStyles: { fillColor: 0 },
      });
      doc.autoTable({
        html: '#collection',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: 20,
        showHead: 'firstPage',
        theme: 'grid'
      });
      doc.text('Total Collection Amount :' + ' ' + this.total, (pageWidth / 2) + 20, doc.autoTable.previous.finalY + 10);
      const date = this._datePipe(new Date());
      let reportName = "collection_report" + date + ".pdf";
      // doc.output("dataurlnewwindow");
      doc.save(reportName);
    }
  }
  public radioChange(): void {
    this.collectionList = [];
  }
}
