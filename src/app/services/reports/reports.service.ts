import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;

  constructor(private httpClient: HttpClient) { }

  public getCustomerDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getCustomerDetails', { params });
  }
  public getCustDetails(params){
    return this.httpClient.get(this.base_url_lms+ 'api/' + this.apiVer + '/Report/getCustomerDetails', { params });
  }
  public getAccountStatement(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getAccountStatement', { params });
  }
  public getInstallmentSchedule(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentSchedule/getInstallmentSchedule', { params });
  }
  public getCollectionDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getCollectionDetails', { params });
  }

  getAccountStatementReport(params) {
    return this.httpClient.get('https://mac.mactech.net.in/lms_api_public/api/v1/Reports/getAccountStatementDtl', { params });
  }
  // getEx(params) {
  //   return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Report/getAccountStatementDtl', { params });
  // }

  getExcelReport(params) {
    return this.httpClient.get('https://mac.mactech.net.in/los-api_temp_public/api/v1/QueryExecuter', { params });

  }
  getQuryList() {
    return this.httpClient.get('https://mac.mactech.net.in/los-api_temp_public/api/v1/QueryExecuter/getQueryName');

  }


  getReportNextData(url) {
    return this.httpClient.get('https://mac.mactech.net.in/los-api_temp_public/api/v1/' + url);

  }




  getAccountStatementData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/GetNewDataReport', { params });
  
  }
  getAccountStatementData2(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/GetNewDataReport',params,httpOptions);
  }

  getReportDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/getReportDetails',{params});
  }


  getReportSearchOptions(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/ComboFill', { params });
  }

  generateReport(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/GenerateReport', { params });
  } 
  getReportDataList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ReportDetails/DrillDownReports', { params });
  }

}
