import { Injectable } from '@angular/core';
import { environment, defaultValues } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, } from 'rxjs';

@Injectable({ providedIn: 'root' })

@Injectable({
  providedIn: 'root'
})
export class EnachService {

  // enach_api: 'eNach_Public/',
  // base_url_los: string = environment.baseUrl + environment.los_api;
  // base_url_lms: string = environment.baseUrl + environment.lms_api;
  //base_url_enach: string = environment.baseUrl + 'eNach_Public/';
  base_url_enachpl: string = environment.baseUrl + 'pl/';
  // base_url_enach: string = environment.baseUrl + 'plapi_public/';
  base_url_enach: string = environment.baseUrl + 'plapi_public/';
  base_url_enach_external: string = environment.baseUrl + 'tw/enach_public/';
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  loginbaseUrleNach : string = environment.loginbaseUrleNach ;

  apiVer: string = environment.apiVersion;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };
  constructor(private httpClient: HttpClient) {
    //  this.httpClient = new HttpClient(handler); 
  }

  public cancelMandateInternal(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/eNach/CanceleNach', data);
  }
  public duplicationcheck(params) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/EnachBulkUpload/EnachDuplicationCheck', params);
  }
  
  public cancelMandateExternal(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/CancelMandate', data);
  }
  public getInstallmentDetailsbyDate(data) {
    return this.httpClient.post(this.base_url_enach+'api/'+this.apiVer+'/Nach/GetDtl', data);
  }
  public insruanceData() {
    return this.httpClient.get(this.base_url_enach+'api/'+this.apiVer+'/Insurance1/GetInsuranceDetails');
  }
  public insruanceDate(data) {
    return this.httpClient.post(this.base_url_enach+'api/'+this.apiVer+'/Insurance1/InsuranceDetails',data,this.httpOptions);
  }
  public submitNachPresentationInternal(data) {
    return this.httpClient.post(this.base_url_enachpl + 'enach_api_public/api/ACH', data,this.httpOptions);
    // return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/ACH', data);
    //Ena
  }
  public mandatecodeget(data){
    let url = 'https://mac.mactech.net.in/plgen/'
    return this.httpClient.post(this.base_url_enach+'api/'+this.apiVer+'/Nach/GetMandateId',data);
  }
  public submitNachPresentationExternal(data) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Authorization":
    //     "skip": "true"
    //   })
    // };
    // return this.httpClient.post('https://api-test.lotuspay.com/v1/ach_debits', data, httpOptions);
    let url = "https://mac.mactech.net.in/enach_public/"

    return this.httpClient.post(this.base_url_enach_external + 'api/' + this.apiVer + '/eNach/CreateACHDebit', data, this.httpOptions);
    // return this.httpClient.post(url + 'api/' + this.apiVer + '/eNach/CreateACHDebit', data);

  }
  public submitenachdatainsertion(data) {
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Authorization":
    //     "skip": "true"
    //   })
    // };
    // return this.httpClient.post('https://api-test.lotuspay.com/v1/ach_debits', data, httpOptions);

    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/EnachBulkUpload/EnachDuplicationInsert', data, this.httpOptions);
    // return this.httpClient.post(url + 'api/' + this.apiVer + '/eNach/CreateACHDebit', data);

  }
  
  public submitNachPresentationExternal2(data){

    let url = "https://mac.mactech.net.in/enach_public/"
    return this.httpClient.post(url+'api/'+this.apiVer + '/eNach/CreateACHDebit', data);

  }

  public getNachPresentation() {
    return this.httpClient.get(environment.baseUrl + 'enach_api_public/api/ACH/GetCancel');
  }
  public CancelPresentationExternal(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/CancelACHDebit', data);
  }
  public CancelPresentationInternal(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/ACH/Cancel', data);
  }
  public registerPhysicalMandate(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/PhysicalPayment', data);
  }
  public registerEMandate(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/NewCustPayment', data);
  }
  public updateMandate(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/eNach/NachUpdation', data);
  }
  public getMandate(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/eNach/geteNach', data);
  }
  public registerMandate(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/eNach/NachRegistration', data);
  }
  getApplicationData(params) {
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + "/NachApproval/GetNachApproval", params, this.httpOptions)
  }
  getApplicationUpdate(params) {
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + "/NachApproval/NachApprovalUpdate", params, this.httpOptions)
  }
  // public uploadPhysicalMandate(formData, mandateId) {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       "Authorization":
  //         `Bearer ${environment.enachTocken}`,
  //       "skip": "true"
  //     })
  //   };
  //   return this.httpClient.post(environment.lotusPayURL + 'v1/physical_mandate_images', formData, httpOptions);
  // }
  public saveUploadDocument(data) {
    
    return this.httpClient.post(environment.baseUrl + '/enach_api_public/api/eNach/PhysicalUpdation', data);
  }
  public getENach(data) {
    return this.httpClient.post(environment.baseUrl + '/enach_api_public/api/eNach/geteNach', data);
  }
  public nachUpdation(data) {
    return this.httpClient.post(environment.baseUrl + '/enach_api_public/api/eNach/NachUpdation', data);
  }
  getApplicationList(params) {
    return this.httpClient.post<any>(this.base_url_lms+ 'api/' + this.apiVer + "/NachApproval/NachApprovalLoad", params, this.httpOptions)
  }

  public processMandate(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/ProcessMandate', data);
  }
  public retrieveMandate(data) {
    return this.httpClient.post(this.base_url_enach + 'api/' + this.apiVer + '/eNach/RetrieveMandate', data);
  }
  public getLoginCredentials(): any {
    var credentials = JSON.parse(sessionStorage.getItem("currentUser"));
    return credentials;
  }
  public getApplicationByApplicationId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/applicationById', { params });
  }
  public getApplicationByApplicationIdget(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '//Applications/applicationByIdget', { params });
  }
  public getCustomerByCustomerId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/CommondealerEntry/GetCustomer', { params });
    // return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
  }
  public getBankAccountListByCustomerId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts/CustomerBank', { params });
  }
  public getLoanParameters(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
  }
  public getBankList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankData', { params });
  }
  public getBankCodes(params) {
    return this.httpClient.get(environment.baseUrl + 'enach_api_public/api/' + this.apiVer + '/NachBank/BankDetails', { params });
    // return this.httpClient.get(this.base_url_enach + 'api/' + this.apiVer + '/eNach/BankDetails',{params});
  }
  public getTempBankCodes(params) {
    return this.httpClient.get(environment.baseUrl + 'enach_api_public/api/' + this.apiVer + '/NachBank/TempBankDetails', { params });
    // return this.httpClient.get(this.base_url_enach + 'api/' + this.apiVer + '/eNach/TempBankDetails',{params});
  }
  public getIfscCode(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankBranchData', { params })
  }
  public getInstSchedule(data) {
    return this.httpClient.post(environment.baseUrl + 'enach_api_public/api/AchData/GetData', data);
  }
  // public downloadPhysicalMandate(mandateId) {
  //   const headers = new HttpHeaders({
  //     "Authorization":
  //       `Bearer ${environment.enachTocken}`,
  //     "skip": "true"
  //   })
  //   return this.httpClient.get(environment.lotusPayURL + 'v1/sources/' + mandateId + '/pdf',
  //     { headers, responseType: 'blob' }
  //   )
  // }

  public verifyMandateType(bankCode) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization":
        `Bearer ${environment.testkey}`,
        "skip": "true"
      })
    };
    return this.httpClient.get(
      'https://api-test.lotuspay.com/v1/nach_banks/' + bankCode, httpOptions)
  }


  public fetchInstSchedule(requestParams) {
    const params = new HttpParams()
      .set('LOAN_AMOUNT', requestParams.LOAN_AMOUNT)
      .set('TENURE', requestParams.TENURE)
      .set('DURATION', requestParams.DURATION)
      .set('ROI', requestParams.ROI)
      .set('INTTYPE', requestParams.INTTYPE)
      .set('LOANTYPE', requestParams.LOANTYPE)
      .set('COLLECTTYPE', requestParams.COLLECTTYPE)
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentSchedule', { params });
  }

  public getDisbursementInitiatedData(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/DisbursementListTemp', { params });
  }
  public getDisbursement(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Disbursement/DisbursementList', { params });
  }

}
