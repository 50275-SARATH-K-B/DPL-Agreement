import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-Content-Type-Options': 'nosniff',
                    'Content-Security-Policy': "default-src 'self'; font-src *; img-src * data:; script-src *; style-src *; frame-ancestors 'self';",
                    'X-Frame-Options': 'SAMEORIGIN',
                    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
                    'Referrer-Policy': 'no-referrer',
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                    'Authorization': `Bearer:${currentUser.token}`
                }
            });
        }else{
            request = request.clone({
                setHeaders: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'X-Content-Type-Options': 'nosniff',
                  'Content-Security-Policy': "default-src 'self'; font-src *; img-src * data:; script-src *; style-src *; frame-ancestors 'self'; ",
                  'X-Frame-Options': 'SAMEORIGIN',
                  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
                  'Referrer-Policy': 'no-referrer',
                  'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
                  'Pragma': 'no-cache',
                  'Expires': '0'
                }
            });
        }
        return next.handle(request);
    }
}
