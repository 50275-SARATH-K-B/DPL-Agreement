import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { CommonService } from '../../../services/common/common.service';
import { orders, customers, refunds } from '../dashboard.data';

@Component({
  selector: 'app-info-cards',
  templateUrl: './info-cards.component.html',
  styleUrls: ['./info-cards.component.scss']
})
export class InfoCardsComponent implements OnInit {
  public orders: any[];
  public disbursement: any[];
  public customers: any[];
  public refunds: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Month';
  public showYAxisLabel = false;
  public yAxisLabel = 'Profit';
  public colorScheme = {
    domain: ['#283593', '#039BE5', '#FF5252', '#FF1493', '#A9A9A9', '#006400', '#9932CC', '#FF69B4', '#20B2AA', '#800000', '#808000']
  };
  public colorSchemeDue = {
    domain: ['#FF5252', '#039BE5', '#A9A9A9', '#006400', '#9932CC', , '#FF69B4', '#20B2AA', '#800000', '#808000']
  };
  public colorSchemeBucket = {
    domain: ['#006400', '#9932CC', '#FF69B4', '#20B2AA', '#800000', '#808000']
  };
  public autoScale = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  public settings: Settings;
  constructor(public appSettings: AppSettings, private commonService: CommonService) {
    this.settings = this.appSettings.settings;
  }
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.orders = orders;
    // this.customers = customers;
    this.refunds = refunds;
    this.orders = this.addRandomValue('orders');
    // this.customers = this.addRandomValue('customers');
    this.onLoad();
  }

  ResultArray: any
  DueDay: any
  Bucket: any
  onLoad(): void {
    this.disbursement = [];
    this.commonService.getDisbursementChart({ firmID: this.userData['firmID'], flag: 1 })
      .subscribe(result => {
        this.ResultArray = result['disbDBList'];
        this.disbursement = result['disbDBList'] != null ? result['disbDBList'] : [];
        this.DisbursementData();
      }, error => {
        console.log(error);
        this.DisbursementData();
      })
    this.commonService.getDisbursementChart({ firmID: this.userData['firmID'], flag: 2 })
      .subscribe(result => {
        this.DueDay = [{
          name: 'Due Day',
          series: result['dueList'] != null ? result['dueList'] : [{ name: "", value: 0 }, { name: "", value: 0 }]
        }, {
          name: 'Collection',
          series: result['collList'] != null ? result['collList'] : [{ name: "", value: 0 }, { name: "", value: 0 }]
        }];
      }, error => {

      })
    this.commonService.getDisbursementChart({ firmID: this.userData['firmID'], flag: 3 })
      .subscribe(result => {
        this.Bucket = result['bucketList'] != null ? result['bucketList'] : [{ name: "", value: 0 }];
      }, error => {

      })
  }

  DISBURSEMENT_DATA: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  DisbursementData(): void {
    let arraylen = this.ResultArray != null ? this.ResultArray['length'] : 0;
    let No_call = 12 - arraylen;
    for (let i = 0; i < No_call; i++) {
      const dataItem = {
        name: this.DISBURSEMENT_DATA[arraylen + i],
        value: 0
      };
      this.disbursement.push(dataItem);
    }
  }

  public onSelect(event) {
    console.log(event);
  }

  public addRandomValue(param) {
    switch (param) {
      case 'orders':
        for (let i = 1; i < 30; i++) {
          this.orders[0].series.push({ "name": 1980 + i, "value": Math.ceil(Math.random() * 1000000) });
        }
        return this.orders;
      case 'customers':
        for (let i = 1; i < 15; i++) {
          this.customers[0].series.push({ "name": 2000 + i, "value": Math.ceil(Math.random() * 1000000) });
        }
        return this.customers;
      default:
        return this.orders;
    }
  }

  ngOnDestroy() {
    this.orders[0].series.length = 0;
    this.customers[0].series.length = 0;
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      setTimeout(() => this.DueDay = this.DueDay);
      setTimeout(() => this.onLoad());
      setTimeout(() => this.customers = [...customers]);
      setTimeout(() => this.Bucket = this.Bucket);
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}