import { Injectable } from '@angular/core';
import { environment, defaultValues } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { CommonService } from '../common/common.service';

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  base_url: string = environment.baseUrl;
  apiVer: string = environment.apiVersion;
  applicationId: any;
  customerId: any;
  address: any;
  emi: any;
  loanAmount: any;
  tenure: any;
  downPayment: any;
  manufacture: any;
  model: any;
  assetCost: any;
  asset: any;
  dealer: any;
  userData: any;
  constructor(private httpClient: HttpClient, private commonService: CommonService) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
  }

  private newMethod() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
  }


  public createAccount(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/leads', param, httpOptions);
  }
  public getAllLeads() {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Leads');
  };


  public getLeadByID(params, search) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Leads/searchById', { params });
  }
  public getCrditScore(params) {
    return this.httpClient.get(this.base_url + 'Equifaxapi/api/PCSReport', { params });
  }

  public getDse(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/APIS", { params })
  }

  //follow up service



  public updateUser(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/leads', param, httpOptions);

  }


  public saveCustomerDealerLead(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Quotations/CustomerDetails', param, httpOptions);
  }

  public saveLoanDealerLead(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Quotations/LoanDetails', param, httpOptions);
  }

  public saveReferenceDealerLead(param: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Quotations/ReferenceDetails', param, httpOptions);
  }

  public getProposalDetails(url, param) {
    const params = new HttpParams()
      .set("proposalId", param.proposalId)
      .set("optionId", param.optionId)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Quotations/' + url, { params })
  }

  public saveDealerDocumnet(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };

    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Quotations/Confirmation', param, httpOptions);
  }

  public getDocumentList(params) {
    return this.httpClient.get(this.base_url_lms + '/api/' + this.apiVer + '/Documents', { params })
  }

  public moveProposalIdToApplication(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + "api/" + this.apiVer + "/Quotations/MoveToApplication", param, httpOptions);
  }


  public fetchLoanParameters(applicationID: any) {
    const params = new HttpParams()
      .set('applicationId', applicationID);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
  }

  public getAssetDetail(params) {
    return this.httpClient.get(this.base_url_los + '/api/' + this.apiVer + '/LoanAssets', { params })
  }

  public getCustomerDetails(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
  }


  // adding new Lead
  public confirmNewLead(param: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_los + '/api/' + this.apiVer + '/NewLead', param, httpOptions)
  }

  public setCreditApprovalData(param) {
    this.applicationId = param.applicationId;
    this.customerId = param.customerId;
    this.address = param.Customeraddress;
    this.emi = param.emi;
    this.loanAmount = param.loanAmount;
    this.tenure = param.tenure;
    this.downPayment = param.downPayment;
    this.manufacture = param.manufacture;
    this.model = param.model;
    this.assetCost = param.assetCost;
    this.asset = param.asset;
    this.dealer = param.dealer
  }

  public getCreditApprovalData() {
    const param = {
      applicationId: this.applicationId,
      customerId: this.customerId,
      loanAmount: this.loanAmount,
      tenure: this.tenure,
      emi: this.emi,
      Customeraddress: this.address,
      downPayment: this.downPayment,
      manufacture: this.manufacture,
      model: this.model,
      assetCost: this.assetCost,
      asset: this.asset,
      dealer: this.dealer
    }
    return param;
  }



}
