import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { analytics } from '../dashboard.data';
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html'
})
export class AnalyticsComponent implements OnInit {

  public analytics: any[];
  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = false;
  public showXAxisLabel = false;
  public xAxisLabel = 'Year';
  public showYAxisLabel = false;
  public yAxisLabel = 'Profit';
  public colorScheme = {
    domain: ['#283593', '#039BE5', '#FF5252', '#00695c', '#ffdd00', '#ec1c24', '#292c7d']
  };
  public autoScale = true;
  public roundDomains = true;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  constructor(private commonService: CommonService) { }

  dashboardData: any;
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.onLoad();
  }

  onSelect(event) {
    console.log(event);
  }

  array: any;
  onLoad(): void {
    this.array = [];
    const param = {
      flag: 1,
      productId: this.userData['productID']
    };
    this.commonService.getDashboardLineChart(param)
      .subscribe(result => {
        this.array = result['lineChartsData'];
        // for (let i = 0; i < lineChartsData.length; i++) {
        //   let item = { name: lineChartsData[i].name, series: [] }
        //   lineChartsData[i]['data'].forEach(element => {
        //     item.series.push({ name: element.week, value: element.amount })
        //   });
        // this.array.push(item);
        // }

      })
  }
  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      this.analytics = [...analytics];
      setTimeout(() =>
        this.analytics = this.array
        , 1000);
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}