import { Injectable } from '@angular/core';
import { environment, defaultValues } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';

@Injectable({ providedIn: 'root' })
export class CommonService {
  private dataSource = new BehaviorSubject<any>('');
  private CustomerSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  selectedCustomerData = this.CustomerSource.asObservable();
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  base_url_Adhaar: string = environment.baseUrl + environment.aadhaar_api;
  baseURL: string = environment.baseUrl;
  apiVer: string = environment.apiVersion;
  userData: any;
  base_url_session:string = environment.baseUrl + environment.session

  constructor(public dialog: MatDialog,private router:Router,private commonService: CommonService,private httpClient: HttpClient) { }

  public getUserCredentials(): void {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    defaultValues.ProductId = +sessionStorage.getItem("ProductID");
    defaultValues.FIRM_ID = userData['firmID'];
    defaultValues.Branch_ID = userData['branchID'];
    // defaultValues.Branch_ID = userData['branchID'];
    defaultValues.User_ID = userData['empCode'];
    defaultValues.Role = userData['roleID'];
    defaultValues.UserName = userData['employeeName'];
  }

  public getDate(paramDate) {
    const params = new HttpParams()
      .set('FIRM_ID', paramDate.FIRM_ID)
      .set('BRANCH_ID', paramDate.BRANCH_ID)
      .set('USER_ID', paramDate.USER_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/GetDate', { params });
  }

  DataService(data: any) {
    this.dataSource.next(data);
  }
  sessionactive(params){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/UserLoginDetails/GetUserLoginDetails", params, httpOptions)

  }
  session(){
    this.userData = this.getCredentials();
    sessionStorage.removeItem("schemeData")
    let params = {
      "user_Id":this.userData['empCode'],
      "token":this.userData['token']
    }
    this.sessionactive(params).subscribe(res=>{
     if(res['message'] == 'Session is already active'){

     }else{

      this.dialog.closeAll()

      this.router.navigate(['/time-out']);
     }
    })
  }
  session2(){
    this.userData = this.getCredentials();
    sessionStorage.removeItem("schemeData")
    let params = {
      "user_Id":this.userData['empCode'],
      "token":this.userData['token']
    }
    this.sessionactive(params).subscribe(res=>{
     if(res['message'] == 'Session is already active'){

     }else{
      this.dialog.closeAll()
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('branchuser')
      this.DisplayMessage("User Session has expired!", "Alert")

      
      this.router.navigate(['/login']);

     }
    })
  }
  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%', data: { message: message, type: action },
    });
  }
  DataCustomerService(data: any) {
    this.CustomerSource.next(data);
  }

  /**
   * @member in add-customer.component,bank-details.component
   * @param FIRM_ID 
   * @param COMMON_DATA_TYPE_ID 
   */
  public getCommonItemList(FIRM_ID: any, COMMON_DATA_TYPE_ID: any) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public getZipDetail(pin) {
    const params = new HttpParams()
      .set('flag', "1")
      .set("districtID", pin)

    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ZipCode/getZipCodeDetails', { params });
  }

  public validateApplicationId(applicationId: any) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/' + applicationId);
  }

  public getAnyApi(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/APIS', { params });
  }
  public getLiveEligibilityData(params) {
  

    const httpOptions = {  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/getCustomerLoanUploadDetailsForApproval',  params , httpOptions);
  }

  public postApi(body: any, params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: params, };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/APIS', body, httpOptions);
  }
  public putApi(body: any, params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), params: params, };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/APIS', body, httpOptions);
  }

  public getVerificationType(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/VerificationType', { params });
  }

  public getAgency(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerData', { params });
  }

  public CommonLMSPost(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms + Url, PostData, httpOptions);
  }


  public CommonLMSUpdate(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_lms + Url, PostData, httpOptions);
  }

  public CommonLMSPatch(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.patch(this.base_url_lms + Url, PostData, httpOptions);
  }

  public CommonLOSPost(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_los + Url, PostData, httpOptions);
  }

  public CommonLOSUpdate(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_los + Url, PostData, httpOptions);
  }

  public getAccuralReport(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AccrualReport', { params });
  }


  /**
   * @member in add-customer.component
   * @param Url 
   */
  public getDocumentsDetailsLOS(Url) {
    return this.httpClient.get(this.base_url_los + Url);
  }

  public updateApplicationLos(data) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications', data, httpOptions);
  }

  public getPrimaryDetails(ApplicationId) {
    const params = new HttpParams()
      .set('ApplicationId', ApplicationId)
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters/CustomerInfo', { params })
  }


  public getDayOfWeek() {
    return this.httpClient.get(this.base_url_los + "api/" + this.apiVer + "/Communications/DayofWeek");
  }
  getDashboardPieChart(param) {
    const params = new HttpParams()
      .set('flag', param.flag)
      .set('productId', param.productId);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Charts/Pie', { params });
  }
  getDashboardLineChart(param) {
    const params = new HttpParams()
      .set('flag', param.flag)
      .set('productId', param.productId);
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Charts/Line', { params });
  }

  sendSMS(PostData) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_lms_los + 'api/' + this.apiVer + '/UserSMS', PostData, httpOptions);
  }
  getApplicationStatusPieChart(params) {
    return this.httpClient.get(this.base_url_lms_los + 'api/' + this.apiVer + '/ApplicationDashBoard/getPieChart', { params });
  }

  getDisbursementChart(param) {
    const params = new HttpParams()
      .set('firmId', param.firmID)
      .set('flag', param.flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dashboard/getDisbursementDB', { params });
  }

  public getApiCredentials(data) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.baseURL + 'cartapi/api/Cart/login', data, httpOptions);
  }
  //After Modularization
  public getLiveLoanSearchData(firmID: any) {
    const params = new HttpParams().set('firmID', firmID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getSearchData', { params });
  }
  /**
   * 
   * @param searchType 
   * @summary get loan details for common component
   */
  public getLoanData(params: any) {
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getLoanData', { params });
  }



  public Calculate(emiParams: any) {
    const params = new HttpParams()
      .set('LOAN_AMOUNT', emiParams.LOAN_AMOUNT)
      .set('TENURE', emiParams.TENURE)
      .set('DURATION', emiParams.DURATION)
      .set('INTTYPE', emiParams.INTTYPE)
      .set('LOANTYPE', emiParams.LOANTYPE)
      .set('COLLECTTYPE', emiParams.COLLECTTYPE)
      .set('ROI', emiParams.ROI);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/EMICalculator', { params });
  }

  public checkPolicy(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Policies/getPolicyChkDetails', { params });
  }
  public searchCustomerDetails(params) {
    return this.httpClient.get<any>(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
  }
  public getCommonItems(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster', { params });
  }

  public getManualTypeList() {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Adhoc/getData');
  }


  public getAgencyList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerDtls', { params });
  }
  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    return userData;
  } 
  public getEmployeeByUserId(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getEmployeeName', { params });
  }
  public getPrimaryCustomerDetails(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters/CustomerInfo', { params })
  }
  public getcountryList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Country/getCountries', { params });
  }
  public getStateList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/States/getStates', { params });
  }
  public getDistrictList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/District', { params });
  }
  public getAssetCategories(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetCategory/getAssetCategory', { params });
  }
  public getAssetModels(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModels', { params });
  }
  public getManufactures(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers/getManufacturers', { params });
  }
  public getDealerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerData', { params });
  }
  public getDealerBranchList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerBranchData', { params });
  }
  public getIndustry(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Industries', { params })
  }
  public getSubIndustry(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', { params })
  }
  public getOccupation(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Occupation", { params })
  }
  // public getApplicationDataDetailsById(params) {
  //   return this.httpClient.get(this.base_url_los + 'api/v1/Applications/' + params['applicationId']);
  // }
  public getPINDetailsbyPINautocomplete(PIN) {
    const params = new HttpParams()
      .set('zipcode', PIN);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ZipCode/getZipCodeData', { params });
  }
  public getCustomerDetails(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
  }
  public getBankDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSubAccountDetails', { params });
  };
  public getCustomerPhoto(photoId: any) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers/CustomerPhoto/' + photoId);
  }
  public commonLOSUpdate(PostData, Url) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.put(this.base_url_los + Url, PostData, httpOptions);
  }
  public getProductList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Products', { params });
  }
  public getBankAccountListByCustomerId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/BankAccounts/CustomerBank', { params });
  }

  public getPostOfficebyDistrict(param) {
    const params = new HttpParams()
      .set('districtID', param.District)
      .set('flag', param.flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ZipCode/getZipCodeDetails', { params })
  }

  public getRegions(params) {
    // const params = new HttpParams()
    //   .set('flag', "1")
    //   .set('FIRM_ID', this.FirmID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Region/getRegions', { params });
  }

  public getArea(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Area/getArea', { params });
  }


  public postRegion(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Region', data);
  }

  public getRegionDetails(regionid) {
    const params = new HttpParams()
      .set('regionID', regionid);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Region/getRegionDetails', { params });
  }

  public putRegion(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Region', data);
  }
  public deleteRegion(data) {
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Region', data);
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
  public getManufacturingYearCount(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getManufacturingYear', { params });
  }
  public getLoanDetails(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params });
  }
  public getFunctionEventAccessData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CommonMaster/getFunctionEventAccessData', { params });
  }
  public getApplicationByStatus(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/applicationByStatus', { params });
  }
  public getApplicationByApplicationId(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications/applicationById', { params });
  }
  public getApplicationList(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Applications', { params });
  }
  public getLoanAssetDetails(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets', { params })
  }
  public getLoanParameters(params) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
  }
  public getDocumentDetail(applicationId) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Documents/' + applicationId);
  }
  public getDocumentImage(documentNo) {
    return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers/KYCDocument/' + documentNo);
  }
  public getEligibilityDetailsByID(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/BulkUpload/getCustomerLoanUploadDetails', params,httpOptions);
  }
  public VerifyBankAccount(PostData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_Adhaar + 'api/bank', PostData, httpOptions);
  }
}
