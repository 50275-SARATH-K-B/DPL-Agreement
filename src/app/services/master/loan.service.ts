import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  userData: any;
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  updateData(data: any) { this.dataSource.next(data); }

  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }

  public getAllocationPriorities(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority/getAllocationPriorityData', { params });
  }

  public changeStatus(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority', body, httpOptions);
  }

  public getAllocationPriorityChargeDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority/getAllocationPriorityChgDetails', { params });
  }

  public getLoanClassification(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassification', { params });
  }
  public getLoanChargeData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority/getLoanChargeData', { params });
  }

  public updateAllocationPriority(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority', body, httpOptions);
  }

  public saveAllocationPriority(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/AllocationPriority', body, httpOptions);
  }

  public getChargeList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Charges', { params });
  };

  public chargeChangeStatus(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Charges', body, httpOptions);
  }

  public getLedgerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getAllAccountDetails', { params });
  };

  public getCommonItemList(FIRM_ID: any, COMMON_DATA_TYPE_ID: any) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public updateChargeDefinition(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Charges', body, httpOptions);
  }

  public saveChargeDefinition(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Charges', body, httpOptions);
  };

  public getClassificationService(loanParms: any) {
    const params = new HttpParams()
      .set('FLAG', loanParms.FLAG)
      .set('FIRM_ID', loanParms.FIRM_ID)
      .set('PRODUCT_ID', loanParms.PRODUCT_ID)
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassification', { params });
  }


  public changeClassificationStatus(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassification', params, httpOptions)
  }

  public updateClassification(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassification', params, httpOptions)
  }

  public saveClassification(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassification', params, httpOptions)
  }

  public getClassificationCriteria(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassificationCriteria/getLoanClassCriteriaData', { params });
  }


  /**
   * @author Niphy Anto
   * @param params
   * @summary function to change the status in db
   */
  public changeCriteriaStatus(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassificationCriteria', params, httpOptions);
  }

  public getClassificationCriteriaDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassificationCriteria/getLoanClassCriteriaDtls', { params });
  }

  public saveClassificationCriteria(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassificationCriteria', params, httpOptions)
  }

  public updateClassificationCriteria(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/LoanClassificationCriteria', params, httpOptions)
  }

  ////****** Identity Type ****////////////
  public getIdentityype(val) {
    const params = new HttpParams()
      .set('FIRM_ID', val)
      .set('flag', '2')

    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/IdentityType/getIdentityType', { params })
  }

  public addIdentityype(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/IdentityType', param, httpOptions);
  }
}
