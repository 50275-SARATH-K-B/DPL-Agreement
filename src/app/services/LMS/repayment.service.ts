import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class RepaymentService {

  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  private applicationData = new BehaviorSubject<any>('');
  data = this.applicationData.asObservable();
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  apiVer: string = environment.apiVersion;

  private pageNameSource = new BehaviorSubject("");
  pageNameHandler = this.pageNameSource.asObservable();

  private topUpValueSource = new BehaviorSubject("");
  topUpValuesHandler = this.topUpValueSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    userData.ProductID = +localStorage.ProductID;
    return userData;
  }

  public GetPaymentModeDetails(param) {

    // if(this.base_url_lms == "https://uatonpay.manappuram.com/plapi_public/"){
    //   return this.httpClient.post("https://unsecurepl.manappuram.com/plapi_public/"+ 'api/' + this.apiVer + '/InstCollection/getPaymentModes', param);

    // }else{
    //   return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getPaymentModes', param);

    // }

    if(this.base_url_lms == "https://uatonpay.manappuram.com/plapi_publiclive/"){
      return this.httpClient.post("https://unsecurepl.manappuram.com/plapi_publiclive/"+ 'api/' + this.apiVer + '/InstCollection/getPaymentModes', param);

    }else{
      return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getPaymentModes', param);

    }
  }
  public GetPaymentModeDetails1(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    const params = new HttpParams()
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getPaymentModes', param, httpOptions);
  }

  public getLoanData(params) {
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params });
  }


  public saveInstallmentCollection(params: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection', params, httpOptions);

  }
  public getLoanDetailsCollection(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getLoanDetails', { params });
  }
  public getCollectionDtls(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Disbursement/getCustomerDetails', { params });
  }
  public getLoanDetailsSettlement(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Disbursement/getLoanDetails', { params });
  }

  public Collection(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection', params, httpOptions);
  }
  //New Api for settlement
  public getSettlementDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Disbursement/getLoanDetails', { params });
  }
  public saveSettlementDetails(params) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection', params);
  }
  public getCustomerDetails(param) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Disbursement/getCustomerDetails?LOGIN_ID=' + param);
  }

  public getClearedBouncedDetails(passParams: any) {
    let params = new HttpParams()
      .set("FIRM_ID", passParams.FIRM_ID)
      .set("apiID", passParams.apiID)
      .set("WHERE_DATA", passParams.WHERE_DATA)
      .set("DATA", passParams.DATA);

    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/APIS', { params });
  }

  public postEligibilityData(InstrumentRealisationParams: any) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/CustomerDetailsUpload', InstrumentRealisationParams, httpOptions);

  }
  public postEnachData(InstrumentRealisationParams: any) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/EnachBulkUpload/EnachBulkUpload', InstrumentRealisationParams, httpOptions);

  }
  public postExcelupload(InstrumentRealisationParams: any) {
    
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/CustomerDetailsUpload', InstrumentRealisationParams, httpOptions);
    
  }
  public postEligibilityDataApproval(InstrumentRealisationParams: any) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/AddCustomerLoanUploadDetails', InstrumentRealisationParams, httpOptions);

  }
  public PostInstrumentRealisation(InstrumentRealisationParams: any) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentRealisation', InstrumentRealisationParams, httpOptions);

  }

  changePageVal(pageName: any) {
    this.pageNameSource.next(pageName)
  }

  public getLoanDetails(loadDetailsParameters: any) {
    let params = new HttpParams()
      .set("Product_ID", loadDetailsParameters.Product_ID)
      .set("Loan_ID", loadDetailsParameters.Loan_ID)
      .set("FIRM_ID", loadDetailsParameters.FIRM_ID);

    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params });
  }


  changeTopUpSettlementValues(topUpValues: any) {
    this.topUpValueSource.next(topUpValues)
  }

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();


  public getLiveLoanSearchData(firmID: any) {
    const params = new HttpParams().set('firmID', firmID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSearchData', { params });

  }

  private searchTypeSource = new BehaviorSubject("");
  searchTypeValue = this.searchTypeSource.asObservable();


  passSearchType(searchTypeText: any) {
    this.searchTypeSource.next(searchTypeText)
  }

  changeMessage(loanId: any) {
    this.messageSource.next(loanId)
  }

  private amountReceivedSource = new BehaviorSubject("");
  currentValue = this.amountReceivedSource.asObservable();
  changeAmountReceivedVal(amountVal: any) {
    this.amountReceivedSource.next(amountVal)
  }

  public getSubAccountDetails(params: any) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getSubAccountDetails', { params });

  }
  public GetChargeTypesList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Adhoc/ChargeDtls', { params });
  }

  public saveLoanInfo(instCollectionRequest: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection', instCollectionRequest, httpOptions);
  }
  public saveAdhoc(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Adhoc', params, httpOptions);
  }


  public uploadCollections(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/BulkCollection', params, httpOptions);
  }

}



