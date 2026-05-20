import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { environment, defaultValues } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmploymentMasterService {

  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  apiVer: string = environment.apiVersion;

  constructor(private httpClient: HttpClient) { }

  //////////////////////////////////////employer Master////////////////////////////////////////////////////////////
  /**
  * @author Niphy Anto
  * 
  * @summary Function to fetch employer list from backend
  */
  public getEmployerList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Employers', { params });
  }

  /**
  * @author Niphy Anto
  * 
  * @summary Function to fetch employer list from backend
  */
  public getSubIndustryList(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', { params });
  }

  /**
   * @author Niphy Anto
   * @param params
   * @summary function to change the status in db
   */
  public changeEmployerStatus(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Employers', params, httpOptions);
  }

  /**
   * @author Niphy Anto
   * @summary function to update data in db
   */

  public updateEmployer(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Employers', params, httpOptions);
  }


  /**
   * @author Niphy Anto
   * @param params 
   * @summary function to save data in db
   */
  public saveEmployer(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Employers', params, httpOptions);
  }

  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    userData.ProductID = +sessionStorage.ProductID;
    return userData;
  }

  getOccupation(params) {
    return this.httpClient.get(this.base_url_lms + "api/" + this.apiVer + "/Occupation", { params });
  }

  public confirmOccupation(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Occupation', param, httpOptions)
  }

  public editOccupation(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Occupation', param, httpOptions)
  }

  public deleteOccupation(param) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/Occupation', param, httpOptions)
  }

  ///////////****Industry master *//////////////////////////

  private dataSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();

  updateData(data: any) {
    this.dataSource.next(data);
  }

  public SaveIndustry(industryParam: any, statusVal: any) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    if (statusVal == 'UPDATE') {
      return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Industries', industryParam, httpOptions);
    }
    else {
      return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Industries', industryParam, httpOptions);
    }
  }

  public getIndustries(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Industries', { params });
  }


  public saveIndustry(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Industries', params, httpOptions)
  }


  public updateIndustry(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/Industries', params, httpOptions)
  }

  ////////////***** Sub Industry *//////////

  /************************************ */
  public GetSubIndustriesList() {
    const params = new HttpParams()
      .set('FIRM_ID', defaultValues.FIRM_ID.toString());
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries?FIRM_ID=1&flag=2');
  }

  public Addsubindustry(data) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }
  public Editsubindustry(data) {
    return this.httpClient.put(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }
  public deletesubindustry(data) {

    return this.httpClient.patch(this.base_url_lms + 'api/' + this.apiVer + '/SubIndustries', data);
  }

}
