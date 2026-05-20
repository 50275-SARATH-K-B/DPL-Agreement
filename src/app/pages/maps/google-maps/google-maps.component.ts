import { Component } from '@angular/core';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';



export interface PeriodicElement {
  name: string;
  itemname: number;
  weight: number;
  symbol: string;
  sweight: number;
  
}

export interface PeElement {
  name: string;
  itemname: number;
  weight: number;
  symbol: string;
  remark: string;
  sweight: number;
  ssweight: number;
}

export interface PeeElement {
  name: string;
  itemname: number;
  weight: number;
  symbol: string;
  remark: string;
  sweight: number;
  ssweight: number;
}



const ELEMENT_DATA: PeriodicElement[] = [
  {itemname: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',sweight: 2.2}
 
];

const ELE_DATA: PeElement[] = [
  {itemname: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',sweight: 2.2, ssweight: 3.2,remark:'Ok done'},
  {itemname: 2, name: 'Helium', weight: 4.0026, symbol: 'He', sweight: 2.2, ssweight: 3.2, remark:"rejected settle"}
];

const ELEE_DATA: PeeElement[] = [
  {itemname: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H',sweight: 2.2, ssweight: 3.2,remark:'Ok done'},
  {itemname: 2, name: 'Helium', weight: 4.0026, symbol: 'He', sweight: 2.2, ssweight: 3.2, remark:"rejected settle"}
];

@Component({
  selector: 'app-google-maps',
  templateUrl: './google-maps.component.html'
})
export class GoogleMapsComponent {
  public lat: number = 45.421530;
  public lng: number = -75.697193;
  public zoom: number = 7;
  public settings: Settings;

  
  displayedColumns: string[] = ['itemname', 'name', 'weight', 'symbol','sweight'];
    dataSource = ELEMENT_DATA;

    displayedColumns1: string[] = ['itemname', 'name', 'weight', 'symbol','sweight','ssweight','remark'];
    dataSource1 = ELE_DATA;

    
    displayedColumns2: string[] = ['itemname', 'name', 'weight', 'symbol','sweight','ssweight','remark'];
    dataSource2 = ELEE_DATA;
  constructor(public appSettings:AppSettings) { 
    this.settings = this.appSettings.settings; 
  }
}