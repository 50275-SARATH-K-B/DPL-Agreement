import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  updateData(data: any) {
    this.dataSource.next(data);
  }
  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }
  constructor(private httpClient: HttpClient) { }
  public AddDistrict(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public EditDistrict(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public deleteDistrict(data) {
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public getDistictList(stateid) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/District?stateID=' + stateid);
  }
  public getStates(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/States/getStates', { params });
  }

  public getCountries(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Country/getCountries', { params });
  }
  public getCommonItemList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public SaveStateDetails(stateDetailsParam: any, statusVal: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    if (statusVal == 'UPDATE') {
      return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/States', stateDetailsParam, httpOptions);
    } else {
      return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/States', stateDetailsParam, httpOptions);
    }
  }

}
