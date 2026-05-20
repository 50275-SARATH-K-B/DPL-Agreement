import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoratoriumService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }
  public getLoanData(params) {
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanData', { params });
  }
  public getLoanDetails(params) {
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params });
  }
  public saveMorotorium(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/APIProcedures', data);
  }
  public getLiveLoanSearchData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSearchData', { params });
  }
  public getBranchList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/MorottoriumApproval/getBranchData', { params });
  }
  public getMorottoriumList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/MorottoriumApproval/getMorottoriumData', { params });
  }
}
