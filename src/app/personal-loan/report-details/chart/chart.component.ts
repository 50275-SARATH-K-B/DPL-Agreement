import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, OnInit,NgModule,  ViewChild, ElementRef, VERSION } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import * as Highcharts from 'highcharts';

import  More from 'highcharts/highcharts-more';
More(Highcharts);

import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);
import  threeD from 'highcharts/highcharts-3d';
threeD(Highcharts);
// Load the exporting module.
import Exporting from 'highcharts/modules/exporting';
// Initialize exporting module.
Exporting(Highcharts);
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  
  constructor( ) { }
  ngOnInit(){
   
       }
      
}
