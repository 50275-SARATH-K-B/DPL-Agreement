import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Settings } from '../../app.settings.model';
import { AppSettings } from '../../app.settings';

@Injectable()
export class AuthorisationService {
    public settings: Settings;
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient
        , private router: Router
        , public appSettings: AppSettings) {
            this.settings = this.appSettings.settings;
         }


    checkAuthorisation(active_url) {
         this.settings.loadingSpinner = true;
         const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
         const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
         return this.http.post<any>(this.baseUrl + 'type=dashboard',
            { user_id: currentUser.user_id , active_url : active_url }
            , {headers: headers})
            .pipe(map(data => {
                if (data.status === 1) {
                    // this.settings.loadingSpinner = false;
                    return true;
                } else {
                    this.settings.loadingSpinner = false;
                    this.router.navigate(['/dashboard/notallowed']);
                    return false;
                }
            }));
    }
}
