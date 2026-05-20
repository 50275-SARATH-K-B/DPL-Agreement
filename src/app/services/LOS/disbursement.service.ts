import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {

  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  flag: any = 1;

  constructor(private httpClient: HttpClient) { }

  public getApplicationIdDetails(Id) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/DisbursedTo/' + Id);
  }

  // public getApplicationDetail(params) {
  //   return this.httpClient.get(this.base_url_los + '/api/v1/Disbursement/Applications',{params});
  // }
  public getApplicationDetailInDisbursement(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/Applications', { params });
  }
  public getDisbursementList(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/DisbursementList', { params });
  }
  // public getApplicationDisbursement(flag, status, Id) {
  //   const params = new HttpParams()
  //     .set('flag', flag)
  //     .set('status', status)
  //     .set('searchValue', Id)
  //   return this.httpClient.get(this.base_url_los + 'api/v1/Disbursement/DisbursementList', { params });
  // }

  public confirmDisbursement(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/Initiate', param, httpOptions);
  }

  public acceptDisbursement(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/Approve', param, httpOptions);
  }

  public disbursementPayment(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/Payment', param, httpOptions);
  }

  // public getDisbursementList(url) {
  //   return this.httpClient.get(this.base_url_los + url);
  // }


  public getLoanParameterData(ApplicationID: any) {
    const params = new HttpParams()
      .set('applicationId', ApplicationID)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
  }


  // Common Service
  public getPaymentmode(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanData', { params });
  };



}
