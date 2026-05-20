import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FcuService {

  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  apiVer: string = environment.apiVersion;
  constructor(private _httpClient: HttpClient) { }

  // public getApplicationDetails(applicationId) {
  //   return this._httpClient.get(this.base_url_los + '/api/v1/Applications/' + applicationId);
  // }
  public getProductDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCURequest/GetProductDetails", { params });
  }
  public getDocumentDetail(params) {
    return this._httpClient.get(this.base_url_lms_los+ 'api/' + this.apiVer + '/RCUInitiation/GetDocuments', { params });
  }

  public getDocumentImage(documentNo) {
    return this._httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Documents/Document/' + documentNo);
  }
  public getFCUDocumentImage(documentNo) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/RCUApproval/RCUDocument/' + documentNo);
  }
  public saveFcuInitiation(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this._httpClient.post(this.base_url_lms_los + "api/" + this.apiVer + "/RCUInitiation", param, httpOptions);
  }

  public getFCUInitiationDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCURequest/GetDetails", { params });
  }
  public getFCURequestDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCUConfirmation/GetDetails", { params });
  }
  public getFCUDocumentList(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCURequest/GetDocumentList", { params });
  }
  public saveFCUVerification(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this._httpClient.put(this.base_url_lms_los + "api/" + this.apiVer + "/RCURequest", param, httpOptions);
  }
  public getFCUConfirmationDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCUApproval/GetDetails", { params });
  }

  public saveFCUVerificationConfirmation(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this._httpClient.put(this.base_url_lms_los + "api/" + this.apiVer + "/RCUConfirmation", param, httpOptions);
  }
  public saveRCUApproval(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this._httpClient.put(this.base_url_lms_los + "api/" + this.apiVer + "/RCUApproval", param, httpOptions);
  }
  // public getApplicationDataDetailsByStatus(params) {
  //   return this._httpClient.get(this.base_url_los + 'api/v1/Applications/' + params['flag'] + '/' + params['status'] + '/' + params['applicationId']);
  // }
  public getSendbackDocuments(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/RCU Feedback/GetApplicationDetails", { params });
  }
  public updateSendback(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this._httpClient.put(this.base_url_lms_los + "api/" + this.apiVer + "/RCU Feedback", param, httpOptions);
  }
}
