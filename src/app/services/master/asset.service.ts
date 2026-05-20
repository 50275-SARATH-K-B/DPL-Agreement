import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  updateData(data: any) {
    this.dataSource.next(data);
  }
  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }

  public getCommonItemList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public getManufactures(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers/getManufacturers', { params });
  }

  public getAssetCategories(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory/getAssetCategories', { params });
  }

  public getAssetModels(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModels', { params });
  }

  public getAssetModelsBranchData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModelBranchData', { params });
  }

  public getBranches(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches', { params });
  }

  public getBranchesData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches/getBranchData', { params });
  }

  public getDealerByBranch(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getBranchDealerDtls', { params });
  }

  public saveAssetModels(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels', body, httpOptions);
  }

  public updateAssetModels(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels', body, httpOptions);
  }

  public changeStatus(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels', body, httpOptions);
  }

  public getProductList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Products', { params });
  }

  public getAssetCategoryList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory/getAssetCategory', { params });
  }

  public saveAssetCategory(assetCategoryPostParams: any, statusVal: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    if (statusVal == 'UPDATE') {
      return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory', assetCategoryPostParams, httpOptions);
    }
    else {
      return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory', assetCategoryPostParams, httpOptions);
    }
  }
  
  public changeAssetCategoryStatus(body: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory', body, httpOptions);
  }

}
