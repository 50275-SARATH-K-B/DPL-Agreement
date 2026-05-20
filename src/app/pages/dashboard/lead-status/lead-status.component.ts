import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-lead-status',
  templateUrl: './lead-status.component.html'
})
export class LeadStatusComponent implements OnInit {
  public data: any[];
  public showLegend = false;
  public gradient = true;
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B','#FF1493', '#A9A9A9', '#006400', '#9932CC', '#FF69B4', '#20B2AA', '#800000', '#808000']
  };
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false;
  @ViewChild('resizedDiv') resizedDiv: ElementRef;
  public previousWidthOfResizedDiv: number = 0;
  userData:any;
  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    this.onLoad();
  }

  onLoad(): any {
    const param = {
      flag: 1,
      productId: this.userData['productID']
    };
    this.commonService.getDashboardPieChart(param)
      .subscribe(result => {
        this.data = result['pieChartsData'];
      })
  }
  public onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {
    if (this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth) {
      setTimeout(() => this.onLoad());
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}