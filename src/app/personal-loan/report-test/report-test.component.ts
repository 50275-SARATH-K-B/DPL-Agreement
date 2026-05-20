import { Component, OnInit, ViewChild } from '@angular/core';
import { generatedata1 } from './test-data';
import { ReportService } from '../../services/report/report.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { LoanSearchComponent } from '../../common/loan-search/loan-search.component';

import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';

// import { jqxDataTableComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxdatatable';
// import { jqxInputComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxinput';
// import { jqxPanelComponent } from 'jqwidgets-scripts/jqwidgets-ts/angular_jqxpanel';



@Component({
  selector: 'app-report-test',
  templateUrl: './report-test.component.html',
  styleUrls: ['./report-test.component.scss'],

})
export class ReportTestComponent implements OnInit {
  constructor(private reportService: ReportService, public dialog: MatDialog) { }
  result: any;

  reportsList: any[] = [];
  report: any;
  reportDetails: any = {
    REPORTPARM3: null,
    REPORTPARM2: null,
    REPORTPARM22: null,
    REPORTPARM41: null,
    REPORTPARM42: null,
    REPORTPARM5: null,
    REPORTPARM1: null
  };

  optionList1: any[] = [];
  optionList2: any[] = [];

  option1: string;
  option2: string;
  fromDate: string;
  toDate: string;
  fromDate2: string;
  toDate2: string;

  headerList: any;
  columnList: any;
  headerPropertyList: any;

  dataList: any[] = [];

  public filter: string = "";

  displayedColumns: string[] = ["loaN_ID", "applicatioN_ID", "loaN_DATE", "customeR_ID", "customeR_NAME", "disburseD_AMOUNT"];

  dataSource = new MatTableDataSource<any>(this.dataList);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  ngOnInit() {
    // this.report = '2';

    // this.loanId = '188';
    this.reportDetails = {
      REPORTPARM3: null,
      REPORTPARM2: null,
      REPORTPARM22: null,
      REPORTPARM41: null,
      REPORTPARM42: null,
      REPORTPARM5: null,
      REPORTPARM1: null
    }

    this.getReportList();
    this.headerList = [];
    this.headerPropertyList = [];
    this.columnList = [];


  }
  export() {
  }
  userData:any;
  getWidth(): any {
    if (document.body.offsetWidth < 850) {
      return '90%';
    } else {
      return '95%';
    }

    // return 850;
  }

  source: any;
  level2URL: any;
  dataAdapter: any;
  columns: any[];
  count: number = 0;
  count1: number = 0;
  initRowDetails1 = (id: any, row: number, element: any, rowinfo: any): void => {
    let container = document.createElement('div');
    container.style.margin = '10px';
    // container.style.overflowX='scroll'
    element[0].appendChild(container);
    let nestedDataTable = element[0].children[0];
    let containerID = `nestedDataTable${this.count}`;
    let params = this.levelOneParams.split('||');
    let URLS = this.levelOneURL.split('&');
    let getURL = URLS[0].split('?')[0]; let apiUrl = "";
    for (let i = 0; params['length'] > i; i++) {
      apiUrl = (apiUrl == "" ? apiUrl : apiUrl + '*') + row[params[i]];
    }
    nestedDataTable.id = containerID;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 500 ? 'T' : 'L');
    if (nestedDataTable != null) {
      this.reportService.getReportNextData(getURL + '?report_id=' + this.report + '&parms=' + apiUrl + '&type=' + device)
        .subscribe(result => {

          if (result['status'].code == 1 && result['status'].flag == 1) {
            URLS[0] = URLS[0].split('?')[1]

            let filterGroup = new jqx.filter();
            let filterValue = id;
            let filterCondition = 'equal';
            let filter = filterGroup.createfilter('stringfilter', filterValue, filterCondition);

            if (result['status'].code == 1) {
              let headerList = result['header'].split('||');
              this.level2Params = result['url_Params'];
              this.level2URL = result['urls'];
              let dataSet = result['resulset'];
              let headerPropertyList = [];
              let columnList = [];
              let dataSource = [];
              for (let i = 0; headerList['length'] > i; i++) {
                headerPropertyList.push({ name: headerList[i], type: 'string' });
                columnList.push({ text: headerList[i], dataField: headerList[i], width: 200 });
                if (headerList['length'] == i + 1) {
                  for (let i = 0; dataSet['length'] > i; i++) {
                    let dataItem = dataSet[i].resultset.split('||');

                    let item = {};
                    for (let k = 0; dataItem['length'] > k; k++) {
                      item[headerPropertyList[k].name] = dataItem[k];
                      if (dataItem['length'] == k + 1) {
                        dataSource.push(item);
                      }
                    }
                    if (dataSet['length'] == i + 1) {
                      let source = {
                        localData: dataSource,
                        dataType: 'array',
                        datafields: headerPropertyList
                      };
                      // let a = new jqx.dataAdapter(source)

                      setTimeout(() => {
                        let options = {
                          width: this.getWidth(), height: 180,
                          columns: columnList,
                          theme: 'material',
                          pageable: true,
                          source: new jqx.dataAdapter(source),
                          // rowDetails: true,
                          initRowDetails: this.testFunction,
                          altRows: true
                        };
                        // this.dataAdapter = a;
                        jqwidgets.createInstance(`#${containerID}`, 'jqxDataTable', options);
                        this.nestedTables[id] = nestedDataTable;
                        this.count++;
                      }, 200);

                    }
                  }
                }
              }
            }
          } else {
            this.displayMessage({ message: result['status'].message, type: "Alert" })
          }
        })
    }
  }

  level2Params: any;
  nestedTables = [];
  nestedTables1 = [];
  testFunction(id: any, row: number, element1: any, rowinfo: any): any {
    let container = document.createElement('div');
    container.style.margin = '10px';
    element1[0].appendChild(container);

    let nestedDataTable = element1[0].children[0];
    let containerID = `nestedDataTable${this.count1}`;
    nestedDataTable.id = containerID;

    let filterGroup = new jqx.filter();
    let filterValue = id;
    let filterCondition = 'equal';
    let filter = filterGroup.createfilter('stringfilter', filterValue, filterCondition);

    // let orders: any[] = this.dataAdapter.records;
    let ordersbyid = [{
      EmployeeID: '3',
      ShipName: '51',
      ShipAddress: '1',
      ShipCity: '1',
      ShipCountry: '5',
      ShippedDate: new Date(),
    }];

    let ordersSource = {
      dataFields: [
        { name: 'EmployeeID', type: 'string' },
        { name: 'ShipName', type: 'string' },
        { name: 'ShipAddress', type: 'string' },
        { name: 'ShipCity', type: 'string' },
        { name: 'ShipCountry', type: 'string' },
        { name: 'ShippedDate', type: 'date' }
      ],
      id: 'OrderID',
      localdata: ordersbyid
    }



    if (nestedDataTable != null) {
      let nestedDataTableAdapter = new jqx.dataAdapter(ordersSource);
      let columns = [
        { text: 'Ship Name', dataField: 'ShipName', width: 200 },
        { text: 'Ship Address', dataField: 'ShipAddress', width: 200 },
        { text: 'Ship City', dataField: 'ShipCity', width: 150 },
        { text: 'Ship Country', dataField: 'ShipCountry', width: 150 },
        { text: 'Shipped Date', dataField: 'ShippedDate', cellsFormat: 'd', width: 200 }
      ];

      let options = {
        width: this.getWidth, height: 180, columns: columns, theme: 'material',
        pageable: true, source: nestedDataTableAdapter,
        altRows: true
      };

      jqwidgets.createInstance(`#${containerID}`, 'jqxDataTable', options);

      this.nestedTables1[id] = nestedDataTable;
      this.count1++;

    }

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

  reportChanged(event?) {
    // this.loanId = undefined;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.option1 = undefined;
    this.option2 = undefined;
    this.fromDate2 = undefined;
    this.toDate2 = undefined;

    this.reportDetails = this.reportsList.find((f) => { return f['REPORTID'] == +this.report });
    if (this.reportDetails['REPORTPARM3']) {
      this.getOptionList(1);
    }
    if (this.reportDetails['REPORTPARM5']) {
      this.getOptionList(2);
    }
  }

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

  loanId: string;
  customerName: string;
  loanAmount: string;
  loanClassification: string;
  loanDate: string;
  getSelectedLoanDetails(e) {
    this.loanId = e.LoanId;
    this.customerName = e.CustomerName;
    this.loanAmount = e.LoanAmount;
    this.loanClassification = e.Classification;
    this.loanDate = e.LoanDate;
  }

  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
  }


  private displayMessage(params): void {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: params
    });
  }



  levelOneURL: string;
  levelOneParams: string;
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
   return date.getDate() + '/' +   months[date.getMonth() + 1] + '/' + date.getFullYear();
  }
  submit() {
    this.source = undefined;
    this.levelOneURL = undefined;
    this.levelOneParams = undefined;
    let device = window.innerWidth <= 500 ? 'M' : (window.innerWidth <= 1024 ? 'T' : 'L');
    let params = {
      reportId: +this.report,
      type: device,
      // param1: 188,
      param1: this.loanId ? this.loanId : 0,
      param2: this.fromDate ? this._rptdatePipe(this.fromDate) : '',
      param3: this.toDate ? this._rptdatePipe(this.toDate) : '',
      param4: this.option1 ? this.option1 : '',
      param5: this.option2 ? this.option2 : '',
      param6: this.fromDate2 ? this._rptdatePipe(this.fromDate2) : '',
      param7: this.toDate2 ? this._rptdatePipe(this.toDate2) : ''
    }

    this.reportService.generateReport(params).subscribe(res => {
      if (res['status']['code'] == 1 && res['status']['flag'] == 1) {
        let dataList = res['resulset'];
        let headers = res['header'].split('||');
        let dataSet = res['resulset'];
        this.levelOneURL = res['urls'];
        this.levelOneParams = res['url_Params'];
        let headerPropertyList = [];
        let columnList = [];
        let dataSource = [];
        for (let j = 0; headers['length'] > j; j++) {
          let item = { name: headers[j], type: 'string' };
          headerPropertyList.push(item);
          columnList.push({ text: headers[j], dataField: headers[j], width: 200 })
          if (headers['length'] == j + 1) {
            for (let i = 0; dataSet['length'] > i; i++) {
              let dataItem = dataSet[i].resultset.split('||');
              let item = {};
              for (let k = 0; dataItem['length'] > k; k++) {
                item[headerPropertyList[k].name] = dataItem[k];
                if (dataItem['length'] == k + 1) { dataSource.push(item); }
              }

              if (dataSet['length'] == i + 1) {
                this.columnList = columnList;
                this.source = {
                  localData: dataSource,
                  dataType: 'array',
                  datafields: headerPropertyList
                };
                this.dataAdapter = new jqx.dataAdapter(this.source);

              }
            }
          }

        }
      } else {
        this.displayMessage({ type: "Alert", message: res['status']['message'] });
      }

    })

  }

}
