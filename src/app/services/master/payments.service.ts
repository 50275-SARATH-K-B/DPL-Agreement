import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
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


  updateData(data: any) {
    this.dataSource.next(data);
  }

  public getBanksList(getData) {
    const params = new HttpParams()
      .set('flag', getData['Flag'])
      .set('FIRM_ID', getData['FirmID']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankData', { params });
  }

  public getBranchList(getData) {
    const params = new HttpParams()
      .set('FIRM_ID', getData['FirmID']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches', { params });
  }

  public getBankBranches(bankid) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankBranchData?bankID=' + bankid);
  }

  public deletebanks(data) {
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }

  public addBankMaster(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }

  public editBanks(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }

  public getInstrumentReturnReasonData(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FirmID)
      .set('PRODUCT_ID', param.ProductID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentReturnReason/getInstrReturnReasonData', { params });
  }

  public commonLMSPatch(PostData, Url) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + Url, PostData, httpOptions);
  }

  public getInstrumentReturnReasonServiceData(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('PRODUCT_ID', param.PRODUCT_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentReturnReason/getInstrReturnReasonData', { params });
  }

  public saveReturnReason(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentReturnReason', postedData, httpOptions);
  }

  public updateReturnReason(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentReturnReason', postedData, httpOptions);
  }

  public getPaymentModeList(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('PRODUCT_ID', param.PRODUCT_ID)
      .set('flag', param.Flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode/getPaymentModes', { params });
  }

  public changePaymentModeStatus(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);
  }

  public savePaymentMode(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);
  }

  public updatePaymentMode(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);
  }

}
