import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss']
})
export class ApplicationStatusComponent implements OnInit {
  public data: any[];
  public showLegend = false;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#FF1493', '#A9A9A9', '#006400', '#9932CC', '#FF69B4', '#20B2AA', '#800000', '#808000']
  };
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;

  constructor(private commonService: CommonService, public router: Router) { }
  userData: any;
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.onLoad();
  }

  applicationStatusList: any;
  onLoad(): any {
    const param = {
      flag: 1,
      ProductID: this.userData['productID']
    };
    this.commonService.getApplicationStatusPieChart(param)
      .subscribe(result => {
        this.data = this.applicationStatusList = result['pieChartsData'];
      })
  }
  public onSelect(event) {
    let applicationItem = this.applicationStatusList.find(s => s.name == event['name']);
    this.router.navigate(['/dashboard/application-status-dashboard/' + applicationItem['status']]);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      setTimeout(() => this.onLoad());
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
