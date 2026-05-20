import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment, defaultValues } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) { }

updateData(data: any) { this.dataSource.next(data); }

  public putApi(body: any, params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: params };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/APIS', body, httpOptions);
  }

  //////////***  Holiday Master ***///////////
  public CommonLMSPatch(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.patch(this.base_url_lms + Url, PostData, httpOptions);
  }

  public getHolidayData() {
    const params = new HttpParams()
      .set('FIRM_ID', defaultValues.FIRM_ID.toString());
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Holiday/getHolidays', { params });
  }

  public addHoliday(postedData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Holiday', postedData, httpOptions);

  }

  public UpdateHoliday(postedData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Holiday', postedData, httpOptions);
  }

  ////////*** Valuation Type  *****///////

  public GetValType(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('PRODUCT_ID', param.ProductID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', { params });
  }

  public deleteValType(data) {
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }

  public addValType(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }

  public editValType(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }

  public saveBackDate(body) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/GetDate', body, httpOptions);
  }

  public getUserLinkData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster/getUserLinkData', { params });
  }

  public getFunctionEventDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster/getFunctionEventDetails', { params });
  }

  public updateUserLink(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster', data);
  }

  public saveUserLink(body) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster', body, httpOptions);
  }

  public getUserLinkMaterData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster/getUserLinkMasterData', { params });
  }

  public getUserLinkDtlData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster/getUserLinkDtlData', { params });
  }

  public getFieldRangeDetailsInSMS(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLinkMaster/getFieldRangeDetails', { params });
  }

}
