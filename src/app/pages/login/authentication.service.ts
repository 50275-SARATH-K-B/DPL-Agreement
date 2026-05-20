import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RepaymentService } from '../../services/report/repayment.service';
import { CommonService } from '../../services/report/common.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {
    branchId: any = 3038;
    firmId: any = 1;
    baseUrl = environment.loginbaseUrl + environment.login_api;
    baseurl_api_mafil = environment.loginbaseUrl + environment.login_api_mafil
    login_mafil2 = environment.loginbaseUrl + environment.login_mafil2
    apiVersion = environment.apiVersion;
    keydata:boolean;
    custid: string;
    
    constructor(public router: Router,private http: HttpClient,private repaymentService: RepaymentService,private commonService: CommonService) { }
  ngOnInit() {

    
             
    
    
  }
  concurrentusercheck(params){
    return this.http.post<any>(this.baseUrl +  'api/' + this.apiVersion + "/TokenValidator/GetotpemployeeData", 
    params)
}

  login11(body) {
    const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
    };
  let url = "https://mac.mactech.net.in/plgen/api/"

    return this.http.post<any>(url+ this.apiVersion + '/LoginNew1', body, httpOptions)
        .pipe(map(user => {
            if (user && user['token']) {
                user['productID']= 69;
                // localStorage.setItem('currentUser', JSON.stringify(user));
            
            }
            return user;
        }));
}
 
    login1(body) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        };
        return this.http.post<any>(this.baseUrl + 'api/' + this.apiVersion + '/Login', body, httpOptions)
            .pipe(map(user => {
                if (user && user['token']) {
                    user['productID']= 69;
                    // localStorage.setItem('currentUser', JSON.stringify(user));
                
                }
                return user;
            }));
    }


    getBranchID(params) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
        };
        return this.http.post<any>(this.baseUrl + 'api/' + this.apiVersion + '/MafilLogin/GetEmployee',  params ,httpOptions);
    }
    login(postData) {
        
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        // let loginUrl =  "https://unsecurepl.manappuram.com/tw/lmspersonalgennew/" + 'api/' + this.apiVersion + '/MafilLogin'
        let loginUrl =  this.baseurl_api_mafil + 'api/' + this.apiVersion + '/MafilLogin'

        return this.http.post<any>(loginUrl, postData, { headers: headers })
        // .pipe(map(user => {
        //     if (user && user['token']) {
        //         user['productID']= 69;
        //         // localStorage.setItem('currentUser', JSON.stringify(user));
            
        //     }
        //     return user;
        // }));
    }

    logout() {

        // remove user from local storage and server to log user out
       // const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

          // if (environment.baseUrl == "https://uatvef.manappuram.com/") {

            const raw = sessionStorage.getItem('currentUser');
            let currentUser: any = null;
            if (raw) {
                try {
                    currentUser = JSON.parse(raw);
                } catch (e) {
                    console.warn("currentUser is not valid JSON:", raw);
                }
            }
      //  } else {
       //     const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
       // }
        /* if (currentUser.hasOwnProperty('empcode')) {
             const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
             return this.http.post<any>(this.baseUrl + 'employeeAPI/api/' + this.apiVersion + '/Logout',
                 {
                     employeeCode: currentUser.empcode
                     , token: currentUser.token
                 }
                 , { headers: headers }
             ).pipe(map(user => {
                 localStorage.removeItem('currentUser');
             }));
         }*/
             sessionStorage.removeItem('currentUser');
             sessionStorage.removeItem('branchuser');

             sessionStorage.clear();
    }
    logout1(){
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('branchuser');
      this.router.navigate(['/']);
  }

    getFunctionList(postData) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
        // let loginUrl = "https://unsecurepl.manappuram.com/tw/lms_api_public/" + 'api/' + this.apiVersion + '/LoginNew';
        let loginUrl = this.login_mafil2 + 'api/' + this.apiVersion + '/LoginNew';

        return this.http.post<any>(loginUrl, postData, { headers: headers })
        // .pipe(map(user => {
        //     debugger
        //     if (user && user['rolefunctionList'].length>0) {
        //         // user['productID']= 69;
        //         // localStorage.setItem('currentUser', JSON.stringify(user));
            
        //     }else{
        //         user['productID']= 69;
        //         // localStorage.setItem('branchuser', JSON.stringify(user));

        //     }
        //     return user;
        // }));

    }


}
