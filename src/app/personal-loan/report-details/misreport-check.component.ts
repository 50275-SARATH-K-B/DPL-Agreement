import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { ReportService } from '../../services/report/report.service';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { CommonService } from '../../services/report/common.service';

import * as Highcharts from 'highcharts';
import { DatePipe } from '@angular/common';
import { ExportService } from '../../services/reports/export.service';
import { DataChildComponent } from './data-child/data-child.component';
import { Router } from '@angular/router';
const ELEMENT_DATA2 = [
  { position: 1, name: 'Hydrogen' },
  { position: 2, name: 'Helium' },
  { position: 3, name: 'Lithium' },
  { position: 4, name: 'Beryllium' },
  { position: 5, name: 'Boron' },
  { position: 6, name: 'Carbon' }
];



var myreportArray: Element[] = [];

@Component({
  selector: 'app-misreport-check',
  templateUrl: './misreport-check.component.html',
  styleUrls: ['./misreport-check.component.scss']
})
export class MISreportCheckComponent implements OnInit {
  // @ViewChild('app-data-child') someInput:DataChildComponent;
  public displayedColumns = [];

  public selectedReportID: any;
  public reportList: any;
  public reportFieldList: any;
  public FieldName: any;
  public MappingName: any;
  public myreportArray: Element[] = [];
  public dataSource: any[] = []
  public dispalycolArray2: any = ['position', 'name'];
  public displayedColumns1: string[] = this.dispalycolArray2;
  public testdataSource = new MatTableDataSource(ELEMENT_DATA2);
  public testdataSource2 = new MatTableDataSource([]);

  public options: any;
  public settings: Settings;
  dataList: any[] = [];
  headerPropertyList: any[] = [];
  params: { reportId: number; reportName: any; type: string; param1: any; param2: string; param3: string; param4: any; param5: any; param6: string; param7: string; firmId: any; productId: any; };
  view:any = 1;
  // dataAdapter: any;
  constructor(public router: Router,
    public appSettings: AppSettings,
    private reportService: ReportService,
    private commonService: CommonService,
    public dialog: MatDialog, public datePipe: DatePipe,
    private exportService: ExportService) {
    this.settings = this.appSettings.settings;
  }

  reportDetails: any = {
    REPORTPARM3: null, REPORTPARM2: null,
    REPORTPARM22: null, REPORTPARM41: null,
    REPORTPARM42: null, REPORTPARM5: null, REPORTPARM1: null
  };
  today: any;
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.commonService.session2()

    // let params = {
    //   "user_Id":this.userData['empCode']
    // }
    // this.commonService.sessionactive(params).subscribe(res=>{
    //  if(res['message'] == 'Session is already active'){

    //  }else{
    //   this.DisplayMessage(res['message'], "Alert")

    //   this.router.navigate(['/login']);

    //  }
    // })
    console.log(this.userData)
    this.getReportList(); this.resetFlag = 0;
    this.toDate = this.toDate2 = this.today = new Date();
    this.fromDate = this.fromDate2 = this.today
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
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
    this.view = 1
    this.levelOneURL = undefined;
    this.levelOneParams = undefined;
    this.resetFlag = 1;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 1024 ? 'T' : 'L');
    let reportItem = this.reportsList.find(s => s.REPORTID == +this.report)
    console.log(this.fromDate)
    let params = {
      reportId: +this.report,
      reportName: reportItem['REPORTNAME'],
      type: device,
      param1: this.loanId ? this.loanId : 0,
      param2: this.fromDate ? this._rptdatePipe(this.fromDate) : '',
      param3: this.toDate ? this._rptdatePipe(this.toDate) : '',
      param4: this.option1 ? this.option1 : '',
      param5: this.option2 ? this.option2 : '',
      param6: this.fromDate2 ? this._rptdatePipe(this.fromDate2) : '',
      param7: this.toDate2 ? this._rptdatePipe(this.toDate2) : '',
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
                if(this.report == 159){
                  
                let arr = []
                arr = this.dataSource.filter(s=>this.userData['empCode'] == s['Emp Code'])
                this.source = {
                  data: arr,
                  headers: this.headerPropertyList,
                  charttype: charttype,
                  params: params,
                  linkParams: res['link_fields'],
                  alignItem: this.alignItem,
                  isLastLevel: isLastLevel,
                  reportId: this.report,
                  view:this.view
                };
                }else{
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
                }
             
                // this.ExportExcel()
                console.log(this.source)
                this.resetFlag = 1;
                // this.dataAdapter = new jqx.dataAdapter(this.source);
                // console.log(this.dataAdapter)
              }
              // }

            }
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
        this.displayMessage({ type: "Alert", message: 'No data found' });
        // this.displayMessage({ type: "Alert", message: res['status']['message'] });
      }
    }, error => { this.settings.loadingSpinner = false; })
  }
vieww(){
  this.view = 2

}
ExportExcel1() {
  // debugger
  let item = {};
  let dataArray = [];
  this.testdataSource2 = new MatTableDataSource(this.source['data']);

  console.log(this.source['headers'])
  for (let i = 0; this.source['headers']['length'] > i; i++) {
    item[this.source['headers'][i]] = this.source['headers'][i];
    if (this.source['headers']['length'] == i + 1) {
      dataArray.push(item);
      dataArray = dataArray.concat(this.testdataSource2.data)
      console.log(dataArray)
      var report_name = this.source['params'].reportName  + ' ' + ( this.source['params']['param2']?(' From  ' + this.source['params']['param2']):'' ) +  ( this.source['params']['param3']?(' To ' + this.source['params']['param3']):'' );
      console.log(report_name)
      if(report_name.length >30){

        var report_name1 = this.source['params'].reportName;
        console.log(report_name1)
         report_name = report_name1.replace("-", ""); 
         console.log(report_name)
      }

      this.exportService.exportAsExcelFile(dataArray, report_name);
    }
  }
}
  reportChanged(event?) {
    // this.someInput = undefined
    this.dataSource=[],
    this.headerPropertyList=[],
    
    // this.alignItem =undefined,
    // this.report  =undefined 
     this.levelOneURL = undefined;
    this.levelOneParams = undefined;
    // console.log(this.report)
    // this.loanId = undefined;
    this.option1 = undefined;
    this.option2 = undefined;
    this.resetFlag = 1;
    setTimeout(() => { this.resetFlag = 0; }, 1000);
    this.reportDetails = this.reportsList.find((f) => { return f['REPORTID'] == +this.report });
    if (this.reportDetails['REPORTPARM3']) { this.getOptionList(1); }
    if (this.reportDetails['REPORTPARM5']) { this.getOptionList(2); }
  }
  optionList1: any;
  optionList2: any;

  getOptionList(optionid) {
    let params = { combo_id: optionid, report_id: +this.report };
    this.reportService.getReportSearchOptions(params).subscribe(res => {
      if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
        if (optionid == 1) {
          this.optionList1 = res['resultset'];

        }
        if (optionid == 2) {
          this.optionList2 = res['resultset'];
        }
      }
    })
  }

  public displayLoanSearchPopup(): void {
    const dialogRef = this.dialog.open(LoanSearchComponent, {
      height: "80%",
      width: '75%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!!result) {
        this.getSelectedLoanDetails(result.loanItem);
      }
    });
  }

  customerName: any;
  loanAmount: any;
  loanClassification: any;
  loanDate: any;
  getSelectedLoanDetails(e) {
    this.loanId = e.LoanId;
    this.customerName = e.CustomerName;
    this.loanAmount = e.LoanAmount;
    this.loanClassification = e.Classification;
    this.loanDate = e.LoanDate;
  }

  reportsList: any;
  getReportList() {
    let params = {
      productId: this.userData['productID'],
      firmId: this.userData['firmID']
    }
    this.reportService.getReportDetails(params)
      .subscribe(res => {
        if (res['status']['flag'] == 1 && res['status']['code'] == 1) {
          if(!!sessionStorage.branchuser){
          let arr = []
          arr = res['reportDetailsList']
          let bb = []
           bb.push(arr.find(s=>s.REPORTID ==159))

          this.reportsList = bb
          }else{
            this.reportsList = res['reportDetailsList'];

          }
         
          console.log(sessionStorage.branchuser)
          console.log(sessionStorage.currentUser)

        }
      }, err => { })
  }

  fromDateChange(fromDate) {
    // this.toDate = undefined;
    // this.toDate2 = undefined;
    // this.fromDate2 = undefined;
  }


  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }


  clearform() {
    this.selectedReportID = undefined;
    this.myreportArray.length = 0;
  }



  private displayMessage(params): void {
    let deviceWidth = window.innerWidth > 500 ? '30%' : '80%';
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: deviceWidth,
      data: params
    });
  }

  ExportExcel() {
    // debugger
    if (this.report == 14) {
      let item = {};
      let dataArray = [];
      for (let i = 0; this.headerPropertyList['length'] > i; i++) {
        item[this.headerPropertyList[i]] = this.headerPropertyList[i];
        if (this.headerPropertyList['length'] == i + 1) {
          dataArray.push(item);
          dataArray = dataArray.concat(this.dataSource)
          var report_name = this.params.reportName + ' ' + (this.params['params']['param2'] ? (' From  ' + this.params['params']['param2']) : '') + (this.params['params']['param3'] ? (' To ' + this.params['params']['param3']) : '');
          if (report_name.length > 30) {

            var report_name1 = this.params.reportName;
            report_name = report_name1.replace("-", "");
            console.log(report_name)
          }

          this.exportService.exportAsExcelFile(dataArray, report_name);
        }
      }
    }

  }


}


