import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from '../../app.settings';
import { Settings } from '../../app.settings.model';
import { AuthenticationService } from '../../pages/login/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    public settings: Settings;

    constructor(
        private authenticationService: AuthenticationService,
        public appSettings: AppSettings,
        ) {
            this.settings = this.appSettings.settings;
        }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401||err.status === 403) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }
            if(err.status===400){
                this.settings.loadingSpinner = false;
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
