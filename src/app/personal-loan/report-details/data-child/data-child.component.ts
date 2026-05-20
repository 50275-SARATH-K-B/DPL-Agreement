import { Component, OnInit, ViewChildren, Input, Output } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ReportService } from '../../../services/report/report.service';
import { EventEmitter } from 'events';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import * as jspdf from 'jspdf';
import { ExportService } from '../../../services/reports/export.service';
import * as Highcharts from 'highcharts';
import { state } from '@angular/animations';
import { subMinutes } from 'date-fns';
import { DisbursementComponent } from '../../../Report/report/disbursement/disbursement.component';
import { id } from '@swimlane/ngx-datatable/release/utils';
import { CommonService } from '../../../services/report/common.service';

const ELEMENT_DATA2 = [
  { position: 1, name: 'Hydrogen' },
  { position: 2, name: 'Helium' },
  { position: 3, name: 'Lithium' },
  { position: 4, name: 'Beryllium' },
  { position: 5, name: 'Boron' },
  { position: 6, name: 'Carbon' }
];

@Component({
  selector: 'app-data-child',
  templateUrl: './data-child.component.html',
  styleUrls: ['./data-child.component.scss']
})
export class DataChildComponent implements OnInit {
  @Input() someInput: string;

  @Input() levelZeroData: any;
  @Input() params: any;
  @Input() resetFlag: any;
  @Output() ClearEmitter: EventEmitter = new EventEmitter();
  levelNo: number = 0;
  public displayedColumns = [];
  public urlList = [];
  public testdataSource = new MatTableDataSource(ELEMENT_DATA2);
  public settings: Settings;
  public options: any;
  reportss:boolean = true
  view: number = 1;
  constructor(private reportService: ReportService,private commonService:CommonService, public appSettings: AppSettings, public dialog: MatDialog, private exportService: ExportService) {
    this.settings = this.appSettings.settings;
  }
  userData:any;

  ngOnInit() {
    this.view = 1
    this.userData = this.commonService.getCredentials();
    this.resetValues()
  }
  resetValues() {
    this.urlList = this.displayedColumns = this.LEVEL_DATA = [];
    this.levelNo = 0;
    this.testdataSource = new MatTableDataSource([]);
    console.log(this.testdataSource)
  }
 
  nextItem: any;
  reportsList: any;
  ngOnChanges() {
    
    if (this.resetFlag == 1) {
      this.resetFlag = 0;
      this.resetValues();
      this.levelZeroData = undefined;
    }
    if (!!this.levelZeroData && this.levelZeroData != null && this.levelZeroData['data']['length'] > 0) {
      this.view = this.levelZeroData['view']
      this.resetValues();
      this.setLevelZeroData();

    }
  }
  setLevelZeroData() {
    // console.log(this.levelZeroData)
    
    this.view == 1
    this.options = this.levelZeroData['params'].reportName;
    this.displayedColumns = this.levelZeroData['headers'];
    this.setTableWidth(this.levelZeroData['headers'].length)
    this.testdataSource = new MatTableDataSource(this.levelZeroData['data']);
    this.nextItem = this.levelZeroData['linkParams'];
    this.alignItem = this.levelZeroData['alignItem'];
    this.isLastLevel = this.levelZeroData['isLastLevel'];
    this.processChart();
  }
  processChart() {
    let repdet = this.levelZeroData['params'].reportName;
    let repid = this.levelZeroData['params'].reportId;
    let ctype = this.levelZeroData['charttype'];
    let data = this.levelZeroData['data'];
    console.log(data.length)
    //let total = data.find(function(s){return s["STATE ID"] === "Total";});
    let totalLoans = data[0]["No of Loans"];
    console.log(totalLoans)
    let states = data.filter(function (s) { return (!!s["STATE ID"] ? s["STATE ID"].trim() : s["STATE ID"]) !== "Total"; });

    let state_series = states.map(function (s) {

      let number_of_loans = +s['No of Loans'];
      let number_of_accounts = +s['No. Of Accounts'];
      let account_percentage = (number_of_accounts / number_of_accounts) * 100;
      let loan_number_percentage = (number_of_loans / totalLoans) * 100;
      let d = {
        name: s['STATE NAME'],
        y: loan_number_percentage || account_percentage,
        drilldown: true,
        state_id: s["STATE ID"]
      }
      return d;
    });

    var component = this;
    this.options = {
      chart:
      {
        type: ctype,
        events: {
          drilldown: function (e) {
            console.log(e);
            component.nextTable(e);
          }
        },
        renderTo: 'container',
        options3d: {
          enabled: true,
          alpha: 40
        }
      },
      title: {
        text: repdet
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45

        }
      },
      plotType: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b>of Total<br/>'
      },
      series: [{

        name: repdet,
        data: state_series

      }]
    }
    this.displayHighchart();
     
  }
  displayHighchart() {
    Highcharts.chart(this.options);
  }
  nextTable(e) {
    let data = this.levelZeroData['data'];
    let state_id = e.point.state_id;
    let el = data.find(function (s) { return s['STATE ID'] == state_id });
    this.onNextLevelClick(el);
  }
  getReportList() {
    let params = {
      productId: this.userData['productID'],
      firmId: this.userData['firmID']
    }
    this.reportService.getReportDetails(params).subscribe(res => {
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        this.reportsList = res['reportDetailsList'];
        // this.reportChanged();
        // setTimeout(() => {
        //   this.submit();
        // }, 1000);

      }
    }, err => { })
  }
  onNextLevelClick(element) {
    let item = Object.keys(element).find(key => element[key].trim() == 'Total' || element[key].trim() == 'total');
    if (!item) {
      this.LEVEL_DATA.push({ [this.nextItem]: element[this.nextItem] });
      let nextLevel = this.levelNo + 1;
      this.getDataDetails(element, nextLevel);
    }
  }
  tableWidth: any = "100%";
  setTableWidth(columnNo) {
    if (columnNo <= 2) {
      this.tableWidth = '40%';
    } else {
      if (columnNo > 4) {
        if (columnNo >= 6) {
          this.tableWidth = '95%';
        } else {
          this.tableWidth = '60%';
        }
      } else {
        this.tableWidth = '50%';
      }
    }
  }
  backFlag: boolean = false;
  isLastLevel: boolean = false;
  alignItem: any;
  LEVEL_DATA = [];
  getDataDetails(element, levelNo) {
    this.backFlag = true;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 500 ? 'T' : 'L');
    let paramlist = this.levelZeroData['params'].param1 == 0 ? '' : this.levelZeroData['params'].param1;
    paramlist = paramlist + (this.levelZeroData['params'].param2 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param2 : '*' + this.levelZeroData['params'].param2));
    paramlist = paramlist + (this.levelZeroData['params'].param3 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param3 : '||' + this.levelZeroData['params'].param3));
    paramlist = paramlist + (this.levelZeroData['params'].param4 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param4 : '*' + this.levelZeroData['params'].param4));
    paramlist = paramlist + (this.levelZeroData['params'].param5 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param5 : '*' + this.levelZeroData['params'].param5));
    paramlist = paramlist + (this.levelZeroData['params'].param6 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param6 : '*' + this.levelZeroData['params'].param6));
    paramlist = paramlist + (this.levelZeroData['params'].param7 == '' ? '' : (paramlist == '' ? '' + this.levelZeroData['params'].param7 : '||' + this.levelZeroData['params'].param7));
    let params = {
      type: device, level_no: levelNo,
      report_id: this.levelZeroData['params'].reportId,
      parms: paramlist == '' ? 1 : paramlist,
      link_field: this.nextItem,
      link_value: element[this.nextItem],

    }

    this.settings.loadingSpinner = true;
    this.reportService.getReportDataList(params)
      .subscribe(result => {
        if (result['status'].code == 1 && result['status'].flag == 1) {

          let headers = result['header'].split('||');
          this.setTableWidth(headers['length']);
          let dataSet = result['resulset'];
          this.isLastLevel = result['last_level'] == 1 ? true : false;
          if (result['resulset'] != []) {
            this.settings.loadingSpinner = false;
            this.nextItem = result['link_fields'];
            setTimeout(() => { this.backFlag = false; }, 1000);
            this.levelNo = levelNo;
            let headerPropertyList = [];
            let dataSource = [];
            this.alignItem = {};
            for (let j = 0; headers['length'] > j; j++) {
              let align_ltem = headers[j].split('*');
              if (align_ltem.length > 1) {
                this.alignItem[align_ltem[0].trim()] = 'right';
              } else {
                align_ltem = headers[j].split('~');
                if (align_ltem.length > 1) {
                  this.alignItem[align_ltem[0].trim()] = 'center';
                } else {
                  align_ltem = headers[j].split('^');
                  this.alignItem[align_ltem[0].trim()] = (align_ltem.length > 1) ? 'left' : 'center';

                }
              }
              headerPropertyList.push(align_ltem[0].trim());
              if (headers['length'] == j + 1) {
                for (let i = 0; dataSet['length'] > i; i++) {
                  let dataItem = dataSet[i].resultset.split('||');
                  let item = {};
                  for (let k = 0; dataItem['length'] > k; k++) {
                    item[headerPropertyList[k]] = dataItem[k];
                    if (dataItem['length'] == k + 1) { dataSource.push(item); }
                  }
                  if (dataSet['length'] == i + 1) {
                    this.displayedColumns = headerPropertyList;
                    console.log(this.displayedColumns)
                    this.testdataSource = new MatTableDataSource(dataSource);
                  }
                }
              }
            }
          } else {
            this.backFlag = false;
            this.settings.loadingSpinner = false;
            this.displayMessage("No Data Found", "Alert")
          }
        } else {
          this.backFlag = false;
          this.settings.loadingSpinner = false;
          this.displayMessage("No Data Found", "Alert");
          // this.displayMessage(result['status'].message, "Alert")
        }
        // this.resetValues();
      }, error => {
        this.backFlag = false;
        this.resetValues()
        this.settings.loadingSpinner = false;
      })
  }

  onBackClick() {
    this.levelNo--;
    if (this.levelNo > 0) {
      let item = this.LEVEL_DATA[this.levelNo - 1];
      this.nextItem = Object.keys(item)[0];
      this.LEVEL_DATA.splice(this.levelNo, 1);
      this.getDataDetails(item, this.levelNo);
    } else {
      this.LEVEL_DATA = [];
      this.setLevelZeroData();
    }
  }

  exportPDF() {
    debugger
    var doc = new jspdf();
    jspdf.autoTableSetDefaults({
      columnStyles: { id: { fontStyle: 'bold' } },
      headStyles: { fillColor: 0 },
    });
    doc.setFontSize(14);
    doc.setFontStyle('bold');
    
    var report_name = this.levelZeroData['params'].reportName  + ' ' + ( this.levelZeroData['params']['param2']?(' From  ' + this.levelZeroData['params']['param6']):'' ) +  ( this.levelZeroData['params']['param3']?(' To ' + this.levelZeroData['params']['param3']):'' );
    doc.text(report_name, 55, 16);
    doc.autoTable({
      html: '#reportTable',
      tableWidth: '80%',
      styles: { cellPadding: 0.4, fontSize: 8, border: 2, margin: 130 },
      margin: { top: 90 },
      bodyStyles: { lineColor: '#4CAF50' },
      startY: 20,
      showHead: 'firstPage',
      theme: 'grid'
    });
    doc.save(`${this.levelZeroData['params'].reportName}.pdf`);
  }
vieww(){
  this.view = 2

}
  ExportExcel() {
    // debugger
    let item = {};
    let dataArray = [];
    console.log(this.displayedColumns)
    for (let i = 0; this.displayedColumns['length'] > i; i++) {
      item[this.displayedColumns[i]] = this.displayedColumns[i];
      if (this.displayedColumns['length'] == i + 1) {
        dataArray.push(item);
        dataArray = dataArray.concat(this.testdataSource.data)
        console.log(dataArray)
        var report_name = this.levelZeroData['params'].reportName  + ' ' + ( this.levelZeroData['params']['param2']?(' From  ' + this.levelZeroData['params']['param2']):'' ) +  ( this.levelZeroData['params']['param3']?(' To ' + this.levelZeroData['params']['param3']):'' );
        console.log(report_name)
        if(report_name.length >30){

          var report_name1 = this.levelZeroData['params'].reportName;
          console.log(report_name1)
           report_name = report_name1.replace("-", ""); 
           console.log(report_name)
        }

        this.exportService.exportAsExcelFile(dataArray, report_name);
      }
    }
  }

  private displayMessage(message: string, type: string): void {
    let deviceWidth = window.innerWidth > 600 ? '30%' : '80%';
    this.dialog.open(AlertMessageComponenent, {
      width: deviceWidth,
      data: { message: message, type: type }
    });
  }



}
