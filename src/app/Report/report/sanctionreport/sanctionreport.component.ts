import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ReportService } from '../../../services/report/report.service';
import { LoanSearchComponent } from '../../../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../services/report/common.service';

import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { ExportService } from '../../../services/reports/export.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
const ELEMENT_DATA2 = [
  { position: 1, name: 'Hydrogen' },
  { position: 2, name: 'Helium' },
  { position: 3, name: 'Lithium' },
  { position: 4, name: 'Beryllium' },
  { position: 5, name: 'Boron' },
  { position: 6, name: 'Carbon' }
];

@Component({
  selector: 'app-sanctionreport',
  templateUrl: './sanctionreport.component.html',
  styleUrls: ['./sanctionreport.component.scss']
})

export class SanctionreportComponent implements OnInit {
  public displayedColumns = [];

  public selectedReportID: any;
  public reportList: any;
  public reportFieldList: any;
  public FieldName: any;
  public MappingName: any;
  public myreportArray: Element[] = [];
  public dataSource: any[] = []
  public dispalycolArray2: string[] = ['slno','loaN_NO', 'URL'];
  public displayedColumns1: string[] = this.dispalycolArray2;
  public testdataSource2 = new MatTableDataSource([]);
  public testdataSource = new MatTableDataSource(ELEMENT_DATA2);

  resetFlag: number = 0;
  source: any;
  levelOneURL: any;
  levelOneParams: any;
  report: any;
  fromDate: any;
  toDate: any;
  loanId: any;
  option1: any;
  fromDate2: any;
  toDate2: any;
  option2: any;
  alignItem: any;
  public options: any;
  public settings: Settings;
  dataList: any[] = [];
  headerPropertyList: any[] = [];
  params: { reportId: number; reportName: any; type: string; param1: any; param2: string; param3: string; param4: any; param5: any; param6: string; param7: string; firmId: any; productId: any; };
  view:any = 1;
  userData: any;
  today: Date;
  reportsList: any[]=[];
  levelNo: number;
  backFlag: boolean = false;
  searchid: any;
  filter: any;
  constructor(public appSettings: AppSettings,
    private reportService: ReportService,
    private commonService: CommonService,
    public dialog: MatDialog, public datePipe: DatePipe,
    private exportService: ExportService,private httpClient: HttpClient) {
    this.settings = this.appSettings.settings;
    }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    console.log(this.userData)
    // this.getReportList(); this.resetFlag = 0;
    this.toDate = this.toDate2 = this.today = new Date();
    this.fromDate = this.fromDate2 = this.today
    this.submit()
  }
  download(url: string): Observable<Blob> {
    return this.httpClient.get(url, {
      responseType: 'blob'
    })
  }
  getReportList() {
    let params = {
      productId: this.userData['productID'],
      firmId: this.userData['firmID']
    }
    this.reportService.getReportDetails(params)
      .subscribe(res => {
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          this.reportsList = res['reportDetailsList'];
          // this.reportChanged();
          // setTimeout(() => {
          //   this.submit();
          // }, 1000);

        }
      }, err => { })
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
    return date.getDate() + '/' + months[date.getMonth() + 1] + '/' + date.getFullYear();
  }

  submit() {
    // this.source = undefined;
    this.levelOneURL = undefined;
    this.levelOneParams = undefined;
    this.resetFlag = 1;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 1024 ? 'T' : 'L');
    let reportItem = this.reportsList.find(s => s.REPORTID == +this.report)
    console.log(this.fromDate)
    let dd = new Date()
    let params = {
      reportId: 1145,
      reportName:"Sanction Letter",
      type: device,
      param1:  0,
      param2:  this._rptdatePipe(dd),
      param3: this._rptdatePipe(dd),
      param4:  '',
      param5: '',
      param6: this._rptdatePipe(dd),
      param7: this._rptdatePipe(dd),
      firmId: this.userData['firmID'],
      productId: this.userData['productID']
    }
    this.params = params
    this.settings.loadingSpinner = true;

    this.reportService.generateReport(params).subscribe(res => {
      console.log(res)
      this.settings.loadingSpinner = false;
      if (res['status']['code'] == 1 && res['status']['flag'] == 1) {
        this.dataList = res['resulset'];

        let charttype = res['chartType'];
        let headers = res['header'].split('||');
        let isLastLevel = +res['last_level'] == 1 ? true : false;
        let dataSet = res['resulset'];
        this.levelOneURL = res['urls'];
        this.levelOneParams = res['url_Params'];
        console.log(this.levelOneParams)
        // let headerPropertyList = [];
        // let dataSource = [];
        this.headerPropertyList = []
        this.dataSource = []
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

          // this.alignItem[align_ltem[0].trim()] =  ? true : false;
          this.headerPropertyList.push(align_ltem[0].trim());
          console.log(this.headerPropertyList)
          if (headers['length'] == j + 1) {
            for (let i = 0; dataSet['length'] > i; i++) {
              let dataItem = dataSet[i].resultset.split('||');
              console.log(dataItem)
              console.log(dataItem.length)
              let item = {};
              for (let k = 0; dataItem['length'] > k; k++) {
                item[this.headerPropertyList[k]] = dataItem[k];
                if (dataItem['length'] == k + 1) {
                  this.dataSource.push(item);
                  // console.log(this.dataSource)
                  // var newArray = this.dataSource.slice(0, 20)

                }
              }
              // if(this.report != 14){
              if (dataSet['length'] == i + 1) {
                // this.columnList = columnList;
                this.source = {
                  data: this.dataSource,
                  headers: this.headerPropertyList,
                  charttype: charttype,
                  params: params,
                  linkParams: res['link_fields'],
                  alignItem: this.alignItem,
                  isLastLevel: isLastLevel,
                  reportId: this.report,
                  view:this.view
                };
                // this.ExportExcel()
                console.log(this.source)
                this.resetFlag = 1;
                // this.dataAdapter = new jqx.dataAdapter(this.source);
                // console.log(this.dataAdapter)
              }
              // }

            }
            console.log(this.source)
            this.setLevelZeroData();

          }
        }
      } else {
        this.source = {
          data: [],
          headers: [],
          charttype: "",
          params: "",
          linkParams: "",
          alignItem: "",
          isLastLevel: "",
          reportId: ""
        };
        // this.displayMessage({ type: "Alert", message: 'No data found' });
        // this.displayMessage({ type: "Alert", message: res['status']['message'] });
      }
    }, error => { this.settings.loadingSpinner = false; })
  }
  nextItem: any;
  isLastLevel: boolean = false;
  LEVEL_DATA = [];

  processChart() {
    let repdet = this.source['params'].reportName;
    let repid = this.source['params'].reportId;
    let ctype = this.source['charttype'];
    let data = this.source['data'];
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
  onNextLevelClick(element) {
    let item = Object.keys(element).find(key => element[key].trim() == 'Total' || element[key].trim() == 'total');
    if (!item) {
      this.LEVEL_DATA.push({ [this.nextItem]: element[this.nextItem] });
      let nextLevel = this.levelNo + 1;
      this.getDataDetails(element, nextLevel);
    }
  }
  filterSource(filterValue: string) {
    
    this.searchid =this.filter
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.testdataSource.filter = filterValue;
  }
  getDataDetails(element, levelNo) {
    this.backFlag = true;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 500 ? 'T' : 'L');
    let paramlist = this.source['params'].param1 == 0 ? '' : this.source['params'].param1;
    paramlist = paramlist + (this.source['params'].param2 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param2 : '*' + this.source['params'].param2));
    paramlist = paramlist + (this.source['params'].param3 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param3 : '||' + this.source['params'].param3));
    paramlist = paramlist + (this.source['params'].param4 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param4 : '*' + this.source['params'].param4));
    paramlist = paramlist + (this.source['params'].param5 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param5 : '*' + this.source['params'].param5));
    paramlist = paramlist + (this.source['params'].param6 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param6 : '*' + this.source['params'].param6));
    paramlist = paramlist + (this.source['params'].param7 == '' ? '' : (paramlist == '' ? '' + this.source['params'].param7 : '||' + this.source['params'].param7));
    let params = {
      type: device, level_no: levelNo,
      report_id: this.source['params'].reportId,
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
  public urlList = [];

  resetValues() {
    this.urlList = this.displayedColumns = this.LEVEL_DATA = [];
    this.levelNo = 0;
    this.testdataSource = new MatTableDataSource([]);
    console.log(this.testdataSource)
  }
  nextTable(e) {
    let data = this.source['data'];
    let state_id = e.point.state_id;
    let el = data.find(function (s) { return s['STATE ID'] == state_id });
    this.onNextLevelClick(el);
  }
  setLevelZeroData() {
    // console.log(this.levelZeroData)
    this.view == 1
    this.options = this.source['params'].reportName;
    this.displayedColumns = this.source['headers'];
    this.setTableWidth(this.source['headers'].length)
    this.testdataSource = new MatTableDataSource(this.source['data']);
    this.nextItem = this.source['linkParams'];
    this.alignItem = this.source['alignItem'];
    this.isLastLevel = this.source['isLastLevel'];
    // this.processChart();
  }
  tableWidth: any = "100%";
  hello(element){
    this.showDocument(element['Sanction Letter URL'])
    // setTimeout(() => {
      // window.location.assign(element['Sanction Letter URL'])  
    //   }, 3000);
    
  }
  showDocument(documentId: string): void {
    this.reportService.findById(documentId)
      .subscribe((blob: Blob): void => {
        const file = new Blob([blob], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank', 'width=1000, height=800');
      });
  }
  downloadpdf(element){
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this.httpClient.get(element['Sanction Letter URL'], { headers: headers, responseType: 'blob' });
  }
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

  private displayMessage(message: string, type: string): void {
    let deviceWidth = window.innerWidth > 600 ? '30%' : '80%';
    this.dialog.open(AlertMessageComponenent, {
      width: deviceWidth,
      data: { message: message, type: type }
    });
  }
}
