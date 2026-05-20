import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VerificationService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  apiVer: string = environment.apiVersion;
  constructor(private _httpClient: HttpClient) { }

  // public getApplicationDataDetailsByStatus(params) {
  //   return this._httpClient.get(this.base_url_los + 'api/v1/Applications/' + params['flag'] + '/' + params['status'] + '/' + params['applicationId']);
  // }


  //To Do:Common APIs
  public getVerificationType(params) {
    return this._httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/VerificationType', { params });
  }

  // public saveFieldInvestigationAssign(body: any) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //   };
  //   return this._httpClient.post(this.base_url_los + 'api/v1/FieldInvestigation/Assign', body, httpOptions);
  // };

  public saveFieldInvestigationAssign(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._httpClient.post(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/Assign', body, httpOptions);
  };

  public saveDeviationApproval(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Deviations', body, httpOptions);
  };

  // public getFieldInvestigationAssign(params) {
  //   return this._httpClient.get(this.base_url_los + 'api/v1/FieldInvestigation/GetFIList', { params });
  // };

  public getFieldInvestigationAssign(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/GetFIList', { params });
  };

  public getFieldInvestigationAssignDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/GetFIListDetails', { params });
  };

  public getFieldInvestigationVerify(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/FIVerifyList', { params });
  };

  public getFieldInvestigationVerifyDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/FIVerifyListDetails', { params });
  };

  public getFieldInvestigationStatus(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/GetFIVStatus', { params });
  };

  public downloadFile(params) {
    return this._httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/FIDocument/' + params['documentId']);
  };

  public getFieldInvestigationVerificationList(params) {
    return this._httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/FIVerifyList', { params });
  }

  public updateFieldInvestigationUpdation(updateParams: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/Update', updateParams, httpOptions);
  }

  public updateFieldInvestigationApproval(updateParams: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this._httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/Approval', updateParams, httpOptions);
  }
  public getPendingDeviationList(params) {
    return this._httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Deviations/Pending', { params });
  }

  public saveKYCStatus(body) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this._httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/KYC', body, httpOptions);
  }

  public getDeviationList(appId: any) {
    const params = new HttpParams()
      .set('applicationId', appId)
    return this._httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Deviations', { params });
  }
  public getAgencyList(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/FieldInvestigation/GetFIVDetails', { params });
  }

  // public getApplicationDetails(applicationId) {
  //   return this._httpClient.get(this.base_url_los + '/api/v1/Applications/' + applicationId);
  // }

  public getDocumentDetail(applicationId) {
    return this._httpClient.get(this.base_url_los + '/api/' + this.apiVer + '/Documents/' + applicationId);
  }

  public getDocumentImage(documentNo) {
    return this._httpClient.get(this.base_url_los + '/api/' + this.apiVer + '/Documents/Document/' + documentNo);
  }

  public getRequestTypeList(params) {
    return this._httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/TVRAssign/GetRequestType', { params });
  }

  public getRequestType(param) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRAssign/GetRequestType?OptinID=" + param);
  }

  public saveTVRassign(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this._httpClient.post(this.base_url_lms_los + "api/" + this.apiVer + "/TVRAssign", param, httpOptions);
  }

  public getAssignee(param) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRAssign/GetAssignee?verificationType=" + param)
  }

  public getApplication(val) {
    const params = new HttpParams()
      .set('BranchId', val.BranchId)
      .set('FirmId', val.FirmId)
      .set('ApplicationID', val.ApplicationID)
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRAssign/GetApplicationDetails", { params })
  }

  getTvrRequest() {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRVerification/GetRequestID");
  }

  getTvrVerificationDetails(param) {
    const params = { RequestId: param.requestID, ApplicationId: param.applicationID, CustomerID: param.CustomerID }
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRVerification/GetDetails", { params });
  }

  getOptionDetails(params) {
    return this._httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/TVRVerification/GetRequestID", { params });
  }

  saveTvrVerification(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this._httpClient.post(this.base_url_lms_los + "api/" + this.apiVer + "/TVRVerification", param, httpOptions);
  }


}
