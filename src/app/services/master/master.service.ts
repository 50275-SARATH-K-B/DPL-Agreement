import { Injectable } from '@angular/core';
import { environment,defaultValues } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  private applicationData = new BehaviorSubject<any>('');
  data = this.applicationData.asObservable();
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;
  base_url_los: string = environment.baseUrl + environment.los_api;
  FIRM_ID: any = defaultValues.FIRM_ID;
  PRODUCT_ID: any = defaultValues.ProductId;
  constructor(private httpClient: HttpClient) { }
  updateData(data: any) {
    this.dataSource.next(data);
  }
  setApplicationData(data: any) {
    this.applicationData.next(data);
  }

  public getDealerData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerData', { params });
  }

  public getDealerBranchData(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Dealer/getDealerBranchData', { params });
  }

  public GetRoleData(flag) {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID)
      .set('flag', flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Role/getRoles', { params });
  }

  public GetPaymentModeDetails(flag) {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID)
      .set('PRODUCT_ID', this.PRODUCT_ID)
      .set('flag', flag);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode/getPaymentModes', { params });
  }
  public GetPaymentModeList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode/getPaymentModes', { params });
  }
  public SavePaymentMode(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);

  }
  public UpdatePaymentMode(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);

  }

  public deletePaymentMode(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode', postedData, httpOptions);
  }

  public UpdateInstrumentReturnReason(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/InstrumentReturnReason', postedData, httpOptions);

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


  public GetRoleFunctionDetails(flag) {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/RoleMenuMapping/getRoleFunctions', { params });
  }

  public GetMacturerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers/getManufacturers', { params });
  }

  public GetAssetModelList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/AssetModels/getAssetModels', { params });
  }

  public AddManufacturer(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }

  public EditManufacturer(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }
  public deleteManufacturer(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Manufacturers', data);
  }

  /************************************ */
  public GetSubIndustriesList() {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries?FIRM_ID=1&flag=2');
  }
  /************************************ */
  public Addsubindustry(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }
  public Editsubindustry(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }
  public deletesubindustry(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }
  /******************************************/
  public getStateList() {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/States/getStates?countryID=1');
  }

  public getDistictList(stateid) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/District?stateID=' + stateid);
  }

  public AddDistrict(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public EditDistrict(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public deleteDistrict(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/District', data);
  }
  public GetValType() {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID)
      .set('PRODUCT_ID', this.PRODUCT_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', { params });
  }

  public addValType(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }
  public editValType(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }
  public deleteValType(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/ValuationType', data);
  }

  /************************************ */
  public GetbanksList() {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankData?FIRM_ID=1&flag=2');
  }
  public GetBranchMaster() {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Branches?FIRM_ID=1');
  }
  public Editbanks(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }
  public deletebanks(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }
  public addBankMaster(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Bank', data);
  }

  public getbranches(bankid) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Bank/getBankBranchData?bankID=' + bankid);
  }


  public GetVapCategory() {
    const params = new HttpParams()
      .set('FIRM_ID', this.FIRM_ID)
      .set('PRODUCT_ID', this.PRODUCT_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', { params });
  }

  public addVapCategory(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', data);
  }
  public editVapCategory(data) {

    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', data);
  }
  public deleteVapCategory(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/VAPCategory', data);
  }


  public getProduct() {
    const params = new HttpParams()
      .set('flag', "0")
      .set("FIRM_ID", defaultValues.FIRM_ID.toString())

    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Products", { params });
  }

  public getLoanData(searchType: any) {


    let params = new HttpParams()
      .set("PRODUCT_ID", searchType.PRODUCT_ID)
      .set("FIRM_ID", searchType.FIRM_ID)
      .set("SEARCH_TYPE", searchType.SEARCH_TYPE)
      .set("SEARCH_DATA", searchType.SEARCH_DATA);
    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanData', { params });

  }
  public getLiveLoanSearchData() {
    const params = new HttpParams().set('firmID', this.FIRM_ID);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getSearchData', { params });

  }
  public getLoanDetails(loadDetailsParameters: any) {
    let params = new HttpParams()
      .set("Product_ID", loadDetailsParameters.Product_ID)
      .set("Loan_ID", loadDetailsParameters.Loan_ID)
      .set("FIRM_ID", loadDetailsParameters.FIRM_ID);

    return this.httpClient.get<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params });
  }

  public postMorotoriumReq(data) {

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/APIProcedures', data);
  }


}
