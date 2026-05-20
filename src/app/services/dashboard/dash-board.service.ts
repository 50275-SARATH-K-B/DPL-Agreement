import { Injectable } from '@angular/core';
import { environment, defaultValues } from '../../../environments/environment';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DashBoardService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  base_url_personal_gen:string = environment.baseUrl + environment.lmspersonalgen_api;
  base_url_pl_gen:string =  environment.baseUrl + environment.plgen_api;
  apiVer: string = environment.apiVersion;
  constructor(private httpClient: HttpClient) { }



  public getApplicationsByStatus(params) {
    return this.httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/ApplicationDashBoard/getDetails', { params });
  }

  public getLoanList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getLoanDashboard', { params });
  }
  public getCustomerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getCustomerList', { params });
  }

  public getAllLeads(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Leads', { params });
  };
  public getDisbursementList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getDisbursementDetails', { params });
  };

  public getDisbursementByBranchID(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getDisbursementData', { params });
  };
  public getOutstandingList(params) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Report/getOutstandingData',params);
  };

  public getcollectionByBranchID(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getCollectionDataDetails', { params });
  };
  public getCollectionList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getCollectionDetails', { params });
  };

  public getEligibleCust() {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getEligibleCustList');
  };

  public getDueListReport(params) {
    //return this.httpClient.get("https://mac.mactech.net.in/lmspersonalgen/" + 'api/' + this.apiVer + '/Report/getDueList', { params });
    //return this.httpClient.get(this.base_url_personal_gen + 'api/' + this.apiVer + '/Report/getDueList', { params });
    //return this.httpClient.post(this.base_url_personal_gen + 'api/' + this.apiVer + '/Report/getDueList',params);
    
    return this.httpClient.post(this.base_url_pl_gen + 'api/' + this.apiVer + '/Report/getDueList',params);
  };

  getCustomerOutstandingList(params){
    //return this.httpClient.get("https://mac.mactech.net.in/lmspersonalgen/" + 'api/' + this.apiVer + '/Report/getCustomerWiseOutstanding', { params });
    //return this.httpClient.get(this.base_url_personal_gen + 'api/' + this.apiVer + '/Report/getCustomerWiseOutstanding', { params });
    //return this.httpClient.post(this.base_url_personal_gen + 'api/' + this.apiVer + '/Report/getCustomerWiseOutstanding',params);
    return this.httpClient.post(this.base_url_pl_gen + 'api/' + this.apiVer + '/Report/getCustomerWiseOutstanding',params);
  };

  public getDisbursementReportList(params) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Report/getDisbursementReport',params);
  };

  getWeeklyReturnRBIReport(params){
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Report/getWeeklyReturnRBIReport',params);
  }
}
