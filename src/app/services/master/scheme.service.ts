import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

  public base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  public apiVer: string = environment.apiVersion;

  constructor(private httpCLient: HttpClient) { }

  public getProduct(flag, Firm) {
    const params = new HttpParams()
      .set('flag', flag)
      .set('FIRM_ID', Firm)
    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Products', { params })
  }

  public getPolicies(flag, firm) {
    const params = new HttpParams()
      .set('flag', flag)
      .set('FIRM_ID', firm)
    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Policies', { params })
  }

  public getEmployer(firm) {
    const params = new HttpParams()
      .set('FIRM_ID', firm)

    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme', { params })
  }

  public getChargeCode(firm, productId, flag) {
    const params = new HttpParams()
      .set('FIRM_ID', firm)
      .set('PRODUCT_ID', productId)
      .set('FLAG', flag)

    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Charges', { params })
  }

  // public getAssetCategory(flag, firm) {
  //   const params = new HttpParams()
  //     .set('flag', firm)
  //     .set('FIRM_ID', flag)

  //   return this.httpCLient.get(this.base_url_lms + 'api/v1/AssetCategory/getAssetCategory', { params })
  // }

  public getSchemeDetails(Firm_ID, productId, flag) {
    const params = new HttpParams()
      .set('FIRM_ID', Firm_ID)
      .set('PRODUCT_ID', productId)
      .set('flag', flag);

    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeData', { params })
  }

  public confirmSchemeMaster(addParams) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpCLient.post(this.base_url_lms + 'api/' + this.apiVer + '/Scheme', addParams, httpOptions);
  }

  public editSchemeMaster(addParams) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpCLient.put(this.base_url_lms + 'api/' + this.apiVer + '/Scheme', addParams, httpOptions);
  }


  public getSchemeIDDetails(firmID, id) {
    const params = new HttpParams()
      .set('FIRM_ID', firmID)
      .set('schemeID', id.toString())

    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeDetails', { params })
  }
  public schemeStatusChange(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpCLient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Scheme', params, httpOptions);
  }

  public getProductAssetCategories(params) {
    return this.httpCLient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory/getProductAssetCategories', { params })
  }

  // /**
  //  * @member in add-customer.component,bank-details.component
  //  * @param FIRM_ID 
  //  * @param COMMON_DATA_TYPE_ID 
  //  */
  // public getCommonItemList(FIRM_ID: any, COMMON_DATA_TYPE_ID: any) {
  //   const params = new HttpParams()
  //     .set('FIRM_ID', FIRM_ID)
  //     .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID);
  //   return this.httpCLient.get(this.base_url_lms + 'api/v1/CommonMaster', { params });
  // }
}
