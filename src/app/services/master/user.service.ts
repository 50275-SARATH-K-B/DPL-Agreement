import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  constructor(private httpClient: HttpClient) { }
  public updateData(data: any) {
    this.dataSource.next(data);
  }
  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }
  public getUserRoleData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserMaster/getUserRoleDetails', { params });
  }

  public getUserData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserMaster/getUserData', { params });
  }

  public GetRoleData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Role/getRoles', { params });
  }
  public saveUser(userMasterParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/UserMaster', userMasterParams, httpOptions);
  }

  public updateUser(userMasterParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/UserMaster', userMasterParams, httpOptions);
  }
  public deleteRole(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Role', body, httpOptions);
  }
  public deleteUser(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/UserMaster', body, httpOptions);
  }
  public SaveRole(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Role', postedData, httpOptions);
  }
  public UpdateRole(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Role', postedData, httpOptions);
  }
  public GetRoleFunctionDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/RoleMenuMapping/getRoleFunctions', { params });
  }
  public getMenuListByRoleID(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/RoleMenuMapping/getMenuDetails', { params });
  }

  public saveRoleMenuMapping(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/RoleMenuMapping', postedData, httpOptions);
  }
  public updateRoleMenuMapping(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/RoleMenuMapping', postedData, httpOptions);
  }
  public getUserLinkType(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLink', { params });
  }
  public getLinkDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLink/getLinkDetails', { params });
  }
  public getUserTypeLinkDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserLink/getUserTypeLinkDetails', { params });
  }
  public saveUserLink(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/UserLink', params, httpOptions);
  }
  public updateUserLink(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/UserLink', params, httpOptions);
  }
  public getUserFieldLinkData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster/getUserFieldLinkData', { params });
  }
  public getFunctionEventDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster/getFunctionEventDetails', { params });
  }
  public getFieldRangeDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster/getFieldRangeDetails', { params });
  }
  public getUserFieldLinkMasterData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster/getUserFieldLinkMasterData', { params });
  }
  public getUserFieldLinkDtlData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster/getUserFieldLinkDtlData', { params });
  }
  public saveUserFieldLink(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster', body, httpOptions);
  }
  public updateUserFieldLink(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/UserFieldLinkMaster', body, httpOptions);
  }

  public getEmployee(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getEmployeeName', { params })
  }
}
