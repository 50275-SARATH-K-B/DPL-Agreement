import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";


@Injectable({
  providedIn: 'root'
})
export class AutoprintService {
  customerName: any;
  amount: any;
  DateTime: any;
  loanNo: any;
  constructor(private httpClient: HttpClient) { }


}
