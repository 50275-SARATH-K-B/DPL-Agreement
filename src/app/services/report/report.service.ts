import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 
export class ReportService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api; 
  apiVer: string = environment.apiVersion;

  constructor(private httpClient: HttpClient) { }
  
  getAccountStatementReport(params) { 
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer +'/Reports/getAccountStatementDtl', params ,httpOptions);
  }
  public getAccountStatement(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Report/getAccountStatement',params,httpOptions);
  }
  public getCustDetails(params){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms+ 'api/' + this.apiVer + '/Report/getCustomerDetails',params,httpOptions);
  }
  public getInstallmentSchedule(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentSchedule/getInstallmentSchedule', params,httpOptions);
  }

  public getsoadetails(params) {
   

    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Soa/GetSoaDetails', { params });
  }
  generateReport(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/GenerateReport', params,httpOptions);
  }
  getReportSearchOptions(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/ComboFill', params,httpOptions);
  } 
  public findById(id?: string): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    return this.httpClient.get(id, {responseType: 'blob'});
  }
  getReportDetails(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/getReportDetails',params,httpOptions);
  }
  getReportDataList(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/DrillDownReports',params,httpOptions);
  }
  getReportNextData(url) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post('https://mac.mactech.net.in/los-api_temp_public/api/v1/' , url, httpOptions);

  }

  getAccountStatementData(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/GetNewDataReport', params,httpOptions);
  
  }

}
