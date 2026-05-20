import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }
  public getCommonItemList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }
  getDocuments(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Documents/', { params });
  }
  /**
 * 
 * @param param 
 */
  addDocument(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Documents', param, httpOptions);
  }
  /**
   * 
   * @param param 
   */
  editDocument(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Documents', param, httpOptions);
  }

  getProduct(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Products", { params })
  }

  getTransition(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/TransactionType", { params })
  }

  getDocument(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Documents", { params })
  }

  getransactionType(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/CommonMaster/getFormData",{params})
  }

  confirmCheckList(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/DocumentChkList', params, httpOptions);
  }

  GetChekListDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/DocumentChkList//getDocumentChkLstData', { params });
  }

  EditCheckList(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/DocumentChkList', params, httpOptions);
  }
  CheckListStatusChange(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/DocumentChkList', params, httpOptions);
  }
  getCheckListDetailsData(param,firm,Product) {

    const params = new HttpParams()
    .set('FIRM_ID',firm)
    .set('document_check_list_id',param)
    .set('productId',Product)
    
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/DocumentChkList/getDocumentChkDtlsData', { params });
  }

  deleteDocument(param) {
    return this.httpClient.patch(this.base_url_lms + "api/" + this.apiVer + "/Documents", param);
  }

}
