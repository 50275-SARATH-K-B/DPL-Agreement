import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreDisbursementService {

    private readOnlyAlert = new BehaviorSubject<any>('');
    getReadOnly = this.readOnlyAlert.asObservable();
    baseURL: string = environment.baseUrl;
    base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
    base_url_los: string = environment.baseUrl + environment.los_api;
    apiVer: string = environment.apiVersion;
    applicationId: any;
    customerId: any;
    loanAmount: any;
    tenure: any;
    emi: any;
    address: any;
    downPayment: any;
    manufacture: any;
    model: any;
    assetCost: any;
    asset: any;
    dealer: any;

    constructor(private httpClient: HttpClient) { }

    makeReadonly(data: any) {
        this.readOnlyAlert.next(data);
    }


    public getCustomerPhoto(photoId: any) {
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers/CustomerPhoto/' + photoId);
    }

    public fetchDeviationSummary(applicationId: any) {
        const params = new HttpParams()
            .set('applicationId', applicationId);
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Deviations', { params });
    }

    public fetchKYCDetails(kycParams: any) {
        const params = new HttpParams()
            .set('optionId', kycParams.optionId)
            .set('searchValue', kycParams.searchValue);
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/KYC', { params });
    }

    public fetchFieldInvestigationDetails(applicationId: any) {
        const params = new HttpParams()
            .set('Application_ID', applicationId);
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/FIVList', { params });
    }

    public updateCreditApproval(creditApprovalParams) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/Applications/CreditApproval', creditApprovalParams, httpOptions);
    }

    public setCreditApprovalData(param) {
        this.applicationId = param.applicationId;
        this.customerId = param.customerId;
        this.address = param.Customeraddress;
        this.emi = param.emi;
        this.loanAmount = param.loanAmount;
        this.tenure = param.tenure;
        this.downPayment = param.downPayment;
        this.manufacture = param.manufacture;
        this.model = param.model;
        this.assetCost = param.assetCost;
        this.asset = param.asset;
        this.dealer = param.dealer
    }

    public getCreditApprovalData() {
        const param = {
            applicationId: this.applicationId,
            customerId: this.customerId,
            loanAmount: this.loanAmount,
            tenure: this.tenure,
            emi: this.emi,
            Customeraddress: this.address,
            downPayment: this.downPayment,
            manufacture: this.manufacture,
            model: this.model,
            assetCost: this.assetCost,
            asset: this.asset,
            dealer: this.dealer
        }
        return param;
    }

    /**
     * 
     * @param applicationId 
     */
    public fetchLoanParameters(applicationID: any) {
        const params = new HttpParams()
            .set('applicationId', applicationID);
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
    }


    public getCustomerDetails(params) {
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Customers', { params });
    }

    // public getDownpaymntData(applicationId) {
    //     return this.httpClient.get(this.base_url_los + 'api/v1/Applications/' + applicationId);
    // };


    /**
      * @member in downpayment-collection,
      * @param params
      */
    public getPendingChargeData(ApplicationID) {
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/InitialCharges/ChargesPending/' + ApplicationID);
    }

    /**
      * @member in downpayment-collection,
      * @param body
      */
    public saveDownpayment(body: any) {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/InitialCharges', body, httpOptions);
    }

    /**
    * @member in downpayment-collection,
    * @param params
    */
    public getPaymentModeList(params) {
        return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/PaymentMode/getPaymentModes', { params });
    }

    /**
    * @member in credit-approval,
    * @param params
    */
    // public getApplicationDetail(url) {
    //     return this.httpClient.get(this.base_url_los + url);
    // }

    ////////***Financial Summary *****///////////////
    /**
     * @param params
     */
    public getFinancialData(params) {
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/Financials', { params });
    };

    public getAssetDetail(params) {
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanAssets', { params })
    }

    /**
     * @param body
     */
    public calculate(body: any) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.httpClient.post(this.base_url_los + 'api/' + this.apiVer + '/Financials/summary', body, httpOptions);
    }



    ///////**** Repayment Schedule *****//////////

    public fetchInstSchedule(requestParams) {
        const params = new HttpParams()
            .set('LOAN_AMOUNT', requestParams.LOAN_AMOUNT)
            .set('TENURE', requestParams.TENURE)
            .set('DURATION', requestParams.DURATION)
            .set('ROI', requestParams.ROI)
            .set('INTTYPE', requestParams.INTTYPE)
            .set('LOANTYPE', requestParams.LOANTYPE)
            .set('COLLECTTYPE', requestParams.COLLECTTYPE)
        return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/Installment Schedule', { params });
    }

    public fetchIRRDetails(irrParams) {
        const params = new HttpParams()
            .set('LOAN_AMOUNT', irrParams.LOAN_AMOUNT)
            .set('TOT_INST', irrParams.TOT_INST)
            .set('HIRE_CHARGE', irrParams.HIRE_CHARGE)
            .set('INIT_PAY', irrParams.INIT_PAY)
            .set('INT_RATE', irrParams.INT_RATE)
            .set('ADV_INST', irrParams.ADV_INST)
            .set('INSURANCE', irrParams.INSURANCE)
            .set('INST_VAL1', irrParams.INST_VAL1)
            .set('INST_VAL2', irrParams.INST_VAL2)
            .set('INST_VAL3', irrParams.INST_VAL3)
            .set('INST_VAL4', irrParams.INST_VAL4)
            .set('INST_DUR1', irrParams.INST_DUR1)
            .set('INST_DUR2', irrParams.INST_DUR2)
            .set('INST_DUR3', irrParams.INST_DUR3)
            .set('INST_DUR4', irrParams.INST_DUR4)
            .set('INT_TYPE', irrParams.INT_TYPE)
        return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/IRRCalculator', { params });
    }


    public saveReferenceDetail(refernceDetailParams: any) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.httpClient.put(this.base_url_los + 'api/' + this.apiVer + '/References', { refernceDetailParams }, httpOptions);
    }

    public GetLoanParameters(ApplicationID: any) {
        const params = new HttpParams()
            .set('applicationId', ApplicationID)
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/LoanParameters', { params });
    }

    /**
     * @author Giridharan
     * @param applicationId 
     * @function TO check whether the Application needs to be done field verification or not
     */
    public isFieldInvestigationRequired(applicationId) {
        const params = new HttpParams()
            .set('Application_ID', applicationId)
        return this.httpClient.get(this.base_url_los + 'api/' + this.apiVer + '/FieldInvestigation/IsFIRequired', { params })
    }

    public getCreditStatusDetail(applicationID) {
        return this.httpClient.get(this.baseURL + environment.lms_los_api + "api/" + this.apiVer + "/CreditApproval/GetDetails?ApplicationID=" + applicationID);
    }

    public postCreditStatusDetail(param) {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.httpClient.put(this.baseURL + environment.lms_los_api + "api/" + this.apiVer + "/CreditApproval", param, httpOptions)
    }
}