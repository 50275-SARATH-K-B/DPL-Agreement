import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DealerService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_aadhaar: string = environment.baseUrl + environment.aadhaar_api;
  apiVer: string = environment.apiVersion;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  updateData(data: any) { this.dataSource.next(data); }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }

  public getDealerData(param) {
    const params = new HttpParams()
      .set('PRODUCT_ID', param.ProductID)
      .set('FIRM_ID', param.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerData', { params });
  }

  public getDealerBranchData(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('dealerID', param.DealerID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerBranchData', { params });
  }

  public addDealer(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Dealer', postedData, httpOptions);
  }

  DealerType: any;
  GetVAPCategoryDealer(param) {
    this.DealerType = 2;
    const params = new HttpParams()
      .set('PRODUCT_ID', param.ProductID)
      .set('dealerType', this.DealerType)
      .set('FIRM_ID', param.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerDtls', { params });
  }

  public getCommonItemList(FIRM_ID: any, COMMON_DATA_TYPE_ID: any) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public getBranchList(param) {
    const params = new HttpParams()
      .set('StateID', param.StateID)
      .set('FIRM_ID', param.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches', { params });
  }

  /**
   * @member in add-customer.component
   * @param CountryID 
   */
  public getStateList(param) {
    const params = new HttpParams()
      .set('flag', param.Flag)
      .set('CountryID', param.CountryID);

    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/States/getStates', { params });
  }

  /**
 * @member in add-customer.component
 * @param StateID 
 */
  public getDistrictList(param) {
    const params = new HttpParams()
      .set('flag', param.flag)
      .set('StateID', param.StateID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/District', { params });
  }

  public getSubAccountList(param) {
    const params = new HttpParams()
      .set('Account_No', param.Account_No)
      .set('Branch_ID', param.Branch_ID)
      .set('FIRM_ID', param.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSubAccountDetails', { params });
  }

  public getBankBranchList(BankID: any) {
    const params = new HttpParams()
      .set('bankID', BankID)
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankBranchData', { params });
  }

  public getAnyApi(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/APIS', { params });
  }

  /**
   * @member in add-customer.component,
   * @param Flag 
   */
  public getcountryList(Flag) {
    const params = new HttpParams()
      .set('flag', Flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Country/getCountries', { params });
  }

  public getBranches(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches', { params });
  }

  public getIdentityType(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/IdentityType/getIdentityType', { params });
  }

  public postApi(body: any, params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: params };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/APIS', body, httpOptions);
  }

  public getVapCategory(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FirmID)
      .set('PRODUCT_ID', param.ProductID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', { params });
  }

  public addVapCategory(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', data);
  }

  public editVapCategory(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', data);
  }
  public sendSms(body) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Policies', body, httpOptions);
  }
  public validateGst(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_aadhaar + 'api/gst', body, httpOptions);
  }
}
