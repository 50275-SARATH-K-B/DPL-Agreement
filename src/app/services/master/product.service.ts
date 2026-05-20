import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  userData: any;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }

  public getMacturerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers/getManufacturers', { params });
  }

  public deleteManufacturer(data) {
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }

  public saveManufacturer(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }

  public updateManufacturer(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }

  public getProductList(param) {
    const params = new HttpParams()
      .set('flag', param.Flag)
      .set("FIRM_ID", param.FIRM_ID)
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Products", { params });
  }

  public saveProduct(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + "api/" + this.apiVer + "/Products", param, httpOptions)
  }

  public updateProduct(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_lms + "api/" + this.apiVer + "/Products", param, httpOptions)
  }

  public deleteProduct(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + "api/" + this.apiVer + "/Products", param, httpOptions)
  }
}
