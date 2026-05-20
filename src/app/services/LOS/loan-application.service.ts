import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanApplicationService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  baseURL: string = environment.baseUrl;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  apiVer: string = environment.apiVersion;
  base_url_aadhaar: string = environment.baseUrl + environment.aadhaar_api;
  flag: any = 1;
  constructor(private httpClient: HttpClient) { }
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  updateData(data: any) {
    this.dataSource.next(data);
  }

  //Common API Member in verification Module




  public getDayOfWeek() {
    return this.httpClient.get(this.base_url_los + "api/" + this.apiVer + "/Communications/DayofWeek");
  }
  //Common API 
  public updateApplicationAssignee(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications/ChangeAssignee', body, httpOptions);
  }
  public updateCreditBureau(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications/CreditBureau', body, httpOptions);
  }
  public getCreditBureauInfo(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/CreditBureauInfo', { params });
  }

  public updateLoanApplication(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications', body, httpOptions);
  }
  public getCommunicationPreferences(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Communications', { params });
  }
  public saveCommunicationPreferences(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Communications', body, httpOptions);
  }
  public getOtherApplicant(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanApplicants', { params });
  }
  public addOtherApplicant(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/LoanApplicants', param, httpOptions);
  }
  public getDocumentList(ApplicationID): any {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Documents/' + ApplicationID);
  }
  public getDocumentDataByDocumentNo(documentNo): any {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Documents/Document/' + documentNo);
  }
  public saveDocumentDetails(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_los + 'api/' + this.apiVer + '/Documents', postedData, httpOptions);
  }


  public fetchReferenceDetailList(requestParams) {
    const params = new HttpParams()
      .set('optionId', requestParams.optionId)
      .set('searchValue', requestParams.searchValue);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/References', { params });
  }

  public saveReferenceDetail(referenceDetailPostParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/References', referenceDetailPostParams, httpOptions);
  }

  public updateReferenceDetail(referenceDetailUpdateParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/References', referenceDetailUpdateParams, httpOptions);
  }
  public updateRegulatoryInfo(updateParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications/RegulatoryInfo', updateParams, httpOptions);
  }




  public bindTransportOffice(passParams: any) {
    const params = new HttpParams()
      .set('FIRM_ID', passParams.FIRM_ID)
      .set('apiID', passParams.apiID)
      .set('WHERE_DATA', passParams.WHERE_DATA);
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/APIS', { params });
  }

  public validateRegistraionNumber(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_aadhaar + 'api/rc', body, httpOptions);
  }
  public saveOrUpdateVehicleDetails(passParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets/VehicleDetails', passParams, httpOptions);
  }
  public loanAssetVehicleDataList(requestParams) {

    const params = new HttpParams()
      .set('optionId', requestParams.optionId)
      .set('searchValue', requestParams.searchValue)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets/GetVehicleDetails', { params });

  }

  public updateLoanAsset(updateParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets', updateParams, httpOptions);
  }

  public saveLoanAsset(saveParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets', saveParams, httpOptions);
  }
  public getApiCredentials(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.baseURL + 'cartapi/api/Cart/login', data, httpOptions);
  }

  public uploadBankStatement(formData) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    };
    return this.httpClient.post(this.baseURL + 'cartapi/api/Cart/upload', formData, httpOptions);
  }
  public downloadBankStatement(params) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    };
    return this.httpClient.post(this.baseURL + '/cartapi/api/Cart/download', params, httpOptions);
  }
  public saveBankEvaluation(body) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts/BankEvaluation', body, httpOptions)
  }
  public SOAUpload(body) {
    const httpOptions = {
      headers: new HttpHeaders({ "Accept": "application/json" })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts/SOAUpload', body, httpOptions)
  };
  public getBankEvaluationDetails(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts', { params })
  }
  public getSOA(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts/SOA', { params })
  }
  public getFinancialData(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Financials', { params });
  };
  public saveFinanceData(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Financials', body, httpOptions);
  }
  public calculate(body: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Financials/summary', body, httpOptions);
  }

  public saveGstDetails(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Customers', body, httpOptions);
  }
  public validateGst(body) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_aadhaar + 'api/gst', body, httpOptions);
  }
  public getEducationList(ApplicationID) {
    const params = new HttpParams()
      .set('applicationId', ApplicationID);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Qualifications', { params });
  }

  public addCustomerEducationDetails(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_los + 'api/' + this.apiVer + '/Qualifications', postedData, httpOptions);
  }
  public fetchAllFamilyMembers(applicationId: any) {
    const params = new HttpParams()
      .set('applicationId', applicationId);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/FamilyMembers', { params });
  }
  public SaveFamilyDetails(familyDetailsParams: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/FamilyMembers', familyDetailsParams, httpOptions);
  }

  public getEmployee(data) {
    const params = new HttpParams()
      .set('applicationId', data.Applicationid)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Employments', { params })
  }
  public getEmployer(data) {
    const params = new HttpParams()
      .set('FIRM_ID', data.FIRM_ID)
      .set('flag', data.FLAG)
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Employers', { params })
  }
  public addEmployement(parameters: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Employments', parameters, httpOptions);
  }

  public getLoanParameters(ApplicationID: any) {
    const params = new HttpParams()
      .set('applicationId', ApplicationID)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
  }
  public calculateInstallmentAmount(Data: any) {
    const params = new HttpParams()
      .set('LOAN_AMOUNT', Data.LOAN_AMOUNT)
      .set('TENURE', Data.TENURE)
      .set('DURATION', Data.DURATION)
      .set('ROI', Data.ROI)
      .set('INTTYPE', Data.INTTYPE)
      .set('LOANTYPE', Data.LOANTYPE)
      .set('COLLECTTYPE', Data.COLLECTTYPE);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/EMICalculator', { params });
  }
  public saveLoanParameters(postData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', postData, httpOptions);
  }
  public getChargeNameList(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('flag', param.Flag)
      .set('PRODUCT_ID', param.ProductID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Charges', { params });
  }

  public getDate(paramDate) {
    const params = new HttpParams()
      .set('FIRM_ID', paramDate.FIRM_ID)
      .set('BRANCH_ID', paramDate.BRANCH_ID)
      .set('USER_ID', paramDate.USER_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/GetDate', { params });
  }
  public getApplicationByApplicationId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/applicationById', { params });
  }

  // public getApplicationDataDetailsById(params) {
  //   return this.httpClient.get(this.base_url_los + 'api/v1/Applications/' + params['applicationId']);
  // }
  public getInsuredList(InsuranceTypeID: any, params: any) {
    if (InsuranceTypeID == 2) {
      return this.searchLoanAssets({ optionId: InsuranceTypeID, searchValue: params['ApplicationID'] })
    } else if (InsuranceTypeID == 1) {
      return this.getApplicationByApplicationId(params);
    }
  }
  public searchLoanAssets(loanAssetSearchParam) {
    const params = new HttpParams()
      .set('optionId', loanAssetSearchParam.optionId)
      .set('searchValue', loanAssetSearchParam.searchValue)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets', { params });
  }
  public GetSchemeData(CustomerInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', CustomerInfo['FIRM_ID'])
      .set('EMPLOYMENT_TYPE', CustomerInfo['EMPLOYMENT_TYPE'])
      .set('EMPLOYER_ID', CustomerInfo['EMPLOYER_ID'])
      .set('BRANCH_ID', CustomerInfo['BRANCH_ID'])
      .set('ASSET_CATEGORY', CustomerInfo['ASSET_CATEGORY'])
      .set('AGE', CustomerInfo['AGE'])
      .set('GENDER', CustomerInfo['GENDER']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeDataDetails', { params });
  }
  public getPolicyDetails(SchemeInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', SchemeInfo['FIRM_ID'])
      .set('OCCUPATION_TYPE', SchemeInfo['OCCUPATION_TYPE'])
      .set('SCHEME_ID', SchemeInfo['SCHEME_ID'])
      .set('EXPERIENCE', SchemeInfo['EXPERIENCE'])
      .set('TOT_EXPERIENCE', SchemeInfo['TOT_EXPERIENCE'])
      .set('NEGATIVE_AREA', SchemeInfo['NEGATIVE_AREA'])
      .set('ASSET_CATEGORY', SchemeInfo['ASSET_CATEGORY'])
      .set('NET_INCOME', SchemeInfo['NET_INCOME'])
      .set('AGE', SchemeInfo['AGE']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemePolicyDetails', { params });
  }
  public getChargeListBySchemeID(SchemeInfo: any) {
    const params = new HttpParams()
      .set('FIRM_ID', SchemeInfo['FirmID'])
      .set('schemeID', SchemeInfo['SchemeID']);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Scheme/getSchemeDetails', { params });
  }


  public fetchAssetBodyList(requestParams) {
    const params = new HttpParams()
      .set('optionId', requestParams.optionId)
      .set('searchValue', requestParams.searchValue)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets/GetBodyDetails', { params });
  }

  public getBankDetails(optionId, applicationId) {
    const params = new HttpParams()
      .set('optionId', optionId)
      .set('searchValue', applicationId);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts', { params })
  }
  public getAssetDetailsByDealerBranch(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModelDetails', { params })
  }
  public getAssetModelByManufctureCategory(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModelData', { params })
  }
  public getAssetModelBranchList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModelBranchDetails', { params })
  }
  public getAssetModelDealerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModelBranchDetails', { params })
  }
  public getDepreciation(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getDepreciation', { params })
  }

  public getCustomerDetail(custId) {
    const params = new HttpParams()
      .set('optionId', '1')
      .set('searchValue', custId)

    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
  }

  public postCreditShield(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };

    return this.httpClient.post(this.base_url_lms_los + "api/" + this.apiVer + "/Credit Shield/Post", param, httpOptions)
  }



  public getCreditShieldDetailsByApplicationID(params) {
    return this.httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/Credit Shield/GetApplicationDetails", { params })
  }
  public getInsuraneagencyListByAppliationID(params) {
    return this.httpClient.get(this.base_url_lms_los + "api/" + this.apiVer + "/Credit Shield//GetInsuranceAgency", { params })
  }

  public getEmployementExperirnce(params){
    return this.httpClient.get(this.base_url_los+"api/"+ this.apiVer + "/Employments/calculateExperience",{params})
  }
}
