import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class PostDatedEntriesService {

  constructor(private httpClient: HttpClient) { }
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  }

  public getLiveLoanSearchData(firmID: any) {
    const params = new HttpParams().set('firmID', firmID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSearchData', { params });

  }


  public getPddDocumentDetails(passParams) {
    const params = new HttpParams()
      .set('FIRM_ID', passParams.FIRM_ID)
      .set('apiID', passParams.apiID)
      .set('WHERE_DATA', passParams.WHERE_DATA)

    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/APIS', { params });
  }

  public saveData(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/APIProcedures', params, httpOptions);
  }

  public getLoanData(searchType: any) {
    let params = new HttpParams()
      .set("PRODUCT_ID", searchType.PRODUCT_ID)
      .set("FIRM_ID", searchType.FIRM_ID)
      .set("SEARCH_TYPE", searchType.SEARCH_TYPE)
      .set("SEARCH_DATA", searchType.SEARCH_DATA);
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanData', { params });
  }

  public getInstNoList(loanId) {
    const params = new HttpParams()
      .set('loanID', loanId)
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/PDCUpdation/getInstNoList', { params });
  }



}
