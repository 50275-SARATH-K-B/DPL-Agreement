import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private imgSource = new BehaviorSubject("");
  imgHandler = this.imgSource.asObservable();

  changePageVal(imgData: any) {
    this.imgSource.next(imgData);
  }
  base_url_LOS: string = environment.baseUrl + environment.los_api;
  base_url_LMS: string = environment.baseUrl + environment.lms_per_gen_api;
  base_url_Adhaar: string = environment.baseUrl + environment.aadhaar_api;
  apiVer: string = environment.apiVersion;
  userData = JSON.parse(sessionStorage['currentUser'])
  FirmID: any = this.userData.firmID;
  flag: any = 1;
  constructor(private httpClient: HttpClient) { }


  @Output() langUpdated = new EventEmitter();

  @Output() CustomerDataUpdated = new EventEmitter();

  setLang(lang) {

    this.langUpdated.emit(lang);
  }
  setcustomer(data) {

    this.CustomerDataUpdated.emit(data);
  }

  // Search customer start  --sng
  customerUri = 'CustomerAPI/api/v1/searchcustomer?';

  customerId: string;
  customerName: string;
  phoneNumber: string;
  photoId: string;
  SelectTabIndex: any = undefined;
  setCustomerCommonData(number: string, name: string, photoId: string) {
    this.customerId = number;
    this.customerName = name;
    this.photoId = photoId;

  }
  setCustomerTabIndex(index: any) {
    this.SelectTabIndex = index;
  }

  getCustomerCommonData() {
    return this.customerId + "," + this.customerName
  }

  tabIndex: string;
  setTabIndex(index) {
    this.tabIndex = index;
  }

  getTabIndex() {
    return this.tabIndex;
  }


  public addCustomerData(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_LOS + 'api/' + this.apiVer + '/Customers', postedData, httpOptions);
  }

  public GetDrivingLicenseData(postedData: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_Adhaar + "api/drivinglicense", postedData, httpOptions);
  }

  /**
   * 
   * @param postedData 
   */
  public getVoterData(postedData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_Adhaar + "api/voterid", postedData, httpOptions);
  }
  public getPANData(postedData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_Adhaar + "api/pan", postedData, httpOptions);
  }
  public getPassportData(postedData: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_Adhaar + "api/passport", postedData, httpOptions);
  }

  public LinkCustomerBankDetails(PostData) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post(this.base_url_LOS + 'api/' + this.apiVer + '/BankAccounts/AddBankAccount', PostData, httpOptions);
  }

  public getBankList() {
    const params = new HttpParams()
      .set('flag', '1')
      .set('FIRM_ID', this.FirmID);
    return this.httpClient.get(this.base_url_LMS + 'api/' + this.apiVer + '/Bank/getBankData', { params });
  }

  /**
 * @member in add-customer.component
 * @param Url 
 */
  public getDocumentsDetailsLOS(Url) {
    return this.httpClient.get(this.base_url_LOS + Url);
  }


  public getCustomerPhoto(photoID) {
    return this.httpClient.get(this.base_url_LOS + 'api/' + this.apiVer + '/Customers/CustomerPhoto/' + photoID);
  }



  /**
 * @member in add-customer.component
 * @param FIRM_ID 
 * @param flag 
 */
  public getIdentityList(FIRM_ID, flag) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('flag', flag);
    return this.httpClient.get(this.base_url_LMS + 'api/' + this.apiVer + '/IdentityType/getIdentityType', { params });
  }

  /**
 * @member in add-customer.component
 */
  public getSourceList() {
    return this.httpClient.get(this.base_url_LOS + 'api/' + this.apiVer + '/MasterData/CustomerDataSource');
  }

  /**
 * @member in add-customer.component
 * @param FIRM_ID 
 * @param flag 
 */
  public getCustomerOccupationList(FIRM_ID) {
    return this.httpClient.get(this.base_url_LOS + 'api/' + this.apiVer + '/MasterData/Occupation/' + FIRM_ID);
  }





  /**
  * @member in bank-details.component
  * @param param 
  */
  public getIfscCode(param) {
    const params = new HttpParams()
      .set('bankID', param);
    return this.httpClient.get(this.base_url_LMS + 'api/' + this.apiVer + '/Bank/getBankBranchData', { params })
  }


  public getPostOfficebyDistrict(param) {
    const params = new HttpParams()
      .set('districtID', param.District)
      .set('flag', param.flag);
    return this.httpClient.get(this.base_url_LMS + 'api/' + this.apiVer + '/ZipCode/getZipCodeDetails', { params })
  }

  public VerifyBankAccount(PostData) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
    return this.httpClient.post(this.base_url_Adhaar + 'api/bank', PostData, httpOptions);
  }

  public getOTP(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    }
    return this.httpClient.post(this.base_url_LOS + '/api/' + this.apiVer + '/Customers/SendOTP', params);
  }

  public VerifyOTP(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    }
    return this.httpClient.put(this.base_url_LOS + '/api/' + this.apiVer + '/Customers/VerifyOTP', params);
  }


}
