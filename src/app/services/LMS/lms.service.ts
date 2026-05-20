import { Injectable } from '@angular/core';
import { environment, } from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class LMSService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  apiVer: string = environment.apiVersion;
  constructor(private httpClient: HttpClient) { }

  // Get Scheme Data
  public GetSchemeData(CustomerInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', CustomerInfo['FIRM_ID'])
      .set('EMPLOYMENT_TYPE', CustomerInfo['EMPLOYMENT_TYPE'])
      .set('EMPLOYER_ID', CustomerInfo['EMPLOYER_ID'])
      .set('BRANCH_ID', CustomerInfo['BRANCH_ID'])
      .set('ASSET_CATEGORY', CustomerInfo['ASSET_CATEGORY'])
      .set('AGE', CustomerInfo['AGE']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeDataDetails', { params });
  }

  // Get Scheme Data
  public getPolicyDetails(SchemeInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', SchemeInfo['FIRM_ID'])
      .set('OCCUPATION_TYPE', SchemeInfo['OCCUPATION_TYPE'])
      .set('SCHEME_ID', SchemeInfo['SCHEME_ID'])
      .set('EXPERIENCE', SchemeInfo['EXPERIENCE'])
      .set('TOT_EXPERIENCE', SchemeInfo['TOT_EXPERIENCE'])
      .set('NEGATIVE_AREA', SchemeInfo['NEGATIVE_AREA'])
      .set('ASSET_CATEGORY', SchemeInfo['ASSET_CATEGORY'])
      .set('NET_INCOME', SchemeInfo['NET_INCOME'])
      .set('AGE', SchemeInfo['AGE']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemePolicyDetails', { params });
  }

  // Get Scheme Data
  public getChargeListBySchemeID(SchemeInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', SchemeInfo['FirmID'])
      .set('schemeID', SchemeInfo['SchemeID']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeDetails', { params });
  }

  // Get Policy Data
  public CheckPolicy(param) {
    const params = new HttpParams()
      .set('POLICY_ID', param.POLICY_ID)
      .set('INPUT_DETAILS', param.InputDetails);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Policies/getPolicyChkDetails', { params });
  }


}
