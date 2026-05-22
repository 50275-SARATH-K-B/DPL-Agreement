import { Injectable } from '@angular/core';
import { environment, defaultValues } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, Observable, } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AlertMessageComponenent } from '../../commoncomponents/alertpopup/alertpopup.component';
let CryptoJS = require('crypto-js');


@Injectable({ providedIn: 'root' })
export class CommonService {

  private dataSource = new BehaviorSubject<any>('');
  private CustomerSource = new BehaviorSubject<any>('');
  selectedData = this.dataSource.asObservable();
  selectedCustomerData = this.CustomerSource.asObservable();
  base_url_lms: string = environment.baseUrl + environment.lms_per_gen_api;
  baseurltwnew: string = environment.baseUrltw + environment.lms_path_tw
  base_url_waiver: string = environment.baseUrl + environment.waiver_api
  base_url_session: string = environment.baseUrl + environment.session

  base_url_kyc: string = environment.baseURLKYC + environment.waiver_kyc;
  base_url_los: string = environment.baseUrl + environment.los_api;
  base_url_lms_los: string = environment.baseUrl + environment.lms_los_api;
  base_url_Adhaar: string = environment.baseUrl + environment.aadhaar_api;
  base_url: string = environment.baseUrl + environment.plgen_api;
  base_url_new: string = environment.baseUrl + environment.plgen_api_new;
  baseURL: string = environment.baseUrl;
  apiVer: string = environment.apiVersion;
  keydata: any
  dataforApproval: any;
  getUserData: any;
  userData: any;

  constructor(public dialog: MatDialog, private router: Router, private httpClient: HttpClient) { }
  public PostWaiverDetails(params) {
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/PostWaiverDetails', params);
  }

  approvaldata(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/getLoanSettleWaiverBifurication', { params });

  }
  getPayuDetailsappr(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/PayuUpdate/getPayuVerificationList', params, httpOptions);
  }
  claimapprove(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceUpdation/Approval_Confirm', params, httpOptions);
  }
  getclaimsettleappr() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceSettlement/Request_Appove_Search', httpOptions);
  }
  claimdropdown(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceSettlement/Request_DropDown', params, httpOptions);
  }
  getLoanDetailsclaimappr() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceUpdation/Approval_Search_Api', httpOptions);
  }
  getLoanDetailsclaim(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceUpdation/Request_Search_Api', params, httpOptions);
  }
  rejectpayu(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/PayuUpdate/reject', params, httpOptions);
  }
  claimupdationconfirm(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/InsuranceUpdation/Request_Confirm', params, httpOptions);
  }
  nocdownload(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/Noc/DownLoadNoc', params, httpOptions);

  }
  getpayuloan() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/PayuUpdate/getLoanIds', httpOptions);
  }
  excelbill(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/billingentry/excelbillingentry', params, httpOptions);
  }
  billmainreport(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/billingentry/billingentryExternalReport', params, httpOptions);
    // return this.httpClient.post("http://mafiltest.mactech.net.in/plapi/" + 'api/' + this.apiVer + '/GetPayuDetails', params, httpOptions);
  }
  billreport(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/billingentry/billingentryReport', params, httpOptions);
    // return this.httpClient.post("http://mafiltest.mactech.net.in/plapi/" + 'api/' + this.apiVer + '/GetPayuDetails', params, httpOptions);
  }


  getallloans(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetCommonReason', { params });

  }
  getloanids() {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetCommonReason');

  }
  totalbill(params) {
    // return this.httpClient.get(this.base_url_session + 'api/' + this.apiVer + '/billingentry/totalbillingentry', { params });
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/billingentry/totalbillingentry', params, httpOptions);
  }
  public getPayuDetails(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/PayuUpdate/postPayuVerification', params, httpOptions);
    // return this.httpClient.post("http://mafiltest.mactech.net.in/plapi/" + 'api/' + this.apiVer + '/GetPayuDetails', params, httpOptions);
  }

  public updatePayUDetails(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/PayuUpdate/postPayuVerification', params, httpOptions);
    //  return this.httpClient.post("http://mafiltest.mactech.net.in/plapi/" + 'api/' + this.apiVer + 'payu', params, httpOptions);
  }
  confirmbill(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/billingentry/confirmbillingentry", params, httpOptions)
  }

  aldata(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/Summary/GetSummary",params, httpOptions)
  }
  menu(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/RoleBasedAccess/GetRolePages1", params, httpOptions)
  }
  checksettle(params) {
    return this.httpClient.get(this.base_url_session + 'api/' + this.apiVer + '/Payment/PaymentEmi', { params });

  }
  session() {
    this.userData = this.getCredentials();
    sessionStorage.removeItem("schemeData")
    let params = {
      "user_Id": this.userData['empCode'],
      "token": this.userData['token']
    }
    this.sessionactive(params).subscribe(res => {
      if (res['message'] == 'Session is already active') {

      } else {
        this.dialog.closeAll()

        this.router.navigate(['/time-out']);

      }
    })
  }
  session2() {
    this.userData = this.getCredentials();

    sessionStorage.removeItem("schemeData")
    let params = {
      "user_Id": this.userData['empCode'],
      "token": this.userData['token']
    }
    this.sessionactive(params).subscribe(res => {
      if (res['message'] == 'Session is already active') {

      } else {
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
  sessionlogout(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/Logout/UserLogout", params, httpOptions)

  }
  schedulejob() {
    return this.httpClient.get(this.base_url_session + 'api/' + this.apiVer + '/Payment/CheckBilling');

  }
  empsession(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/UserLoginDetails/GetUserLoginDetails", params, httpOptions)

  }
  disbursement(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_waiver + "api/v1/Disbursement", params, httpOptions)

  }
  disburcustom(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_waiver + "api/v1/Disbursement/getCustomerDetails", params, httpOptions)

  }
  sessionactive(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post<any>(this.base_url_session + "api/v1/UserLoginDetails/GetUserLoginDetails", params, httpOptions)

  }
  getkycdetailsbycustid(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/KARZAAPI/GetUpdatedModiKycDetails', { params });

  }
  Camreport(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/CAMReport/getCAMReport', params, httpOptions);

  }
  rejectdeath(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/Reject', params, httpOptions);
  }
  deathreport(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/Report', params, httpOptions);
  }
  accntcloded(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/accountcloseddate', params, httpOptions);
  }
  applisubmit(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/applicationsubmitted', params, httpOptions);
  }

  claimamtsub(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/claimrecieved', params, httpOptions);
  }
  appliresubmittt(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/applicationresubmitted', params, httpOptions);
  }
  refreshapi(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/Datedetails', params, httpOptions);
  }
  intimationdate(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/intimationrecieved', params, httpOptions);
  }
  docrecieveddte(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/documentrecieved', params, httpOptions);
  }
  getdeathlist() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/Data', httpOptions);
  }
  deathreconfirm(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/Deathfile', params, httpOptions);
  }
  getdeathdata(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/UploadedData', params, httpOptions);

  }
  collectdocsve(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/CollectionReversal/getCollectionReversalAttachment', { params });

  }
  getesign2(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/AgreementDownload/GetAgreementDetails', { params });

  }
  docuploadinst(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/CollectionReversal/DocumentUpload', params, httpOptions);
  }
  downloaddoc(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/getsettlemtentdoc', { params });

  }

    downloaddoc1(param) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/newSettlement/getsettlemtentdoc_new',  param, httpOptions );

    }

  getloandatablock(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url_waiver + 'api/' + this.apiVer + "/getLoanData1/getLoanData1", params, httpOptions)
  }
  docupload(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/settlementApprovalRequest', params, httpOptions);

  }

  docupload1(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_session + 'api/' + this.apiVer + '/NewSettlement/settlementApprovalRequestNew', params, httpOptions);

  }
  deathdetails(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Deathfile/deathinfo', params, httpOptions);
  }
  public getSubAccountDetails(subAccountParams: any) {
    const params = new HttpParams()
      .set('Account_No', subAccountParams.Account_No)
      .set('Branch_ID', subAccountParams.Branch_ID)
      .set('Firm_ID', subAccountParams.Firm_ID);
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/InstallmentCollection/getSubAccountDetails', { params });

  }
  public saveSettlementApprovalDetails(params) {
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/SettlementDtlApprovalPost', params);
  }

  getSettlementwaiverDetails(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/getLoanSettleWaiverBifurication', { params });

  }
  gstcharge(params) {
    return this.httpClient.post(this.base_url_waiver + "api/" + this.apiVer + "/GSTCalculation/GSTCalculation", params);
  }
  charge(params) {
    return this.httpClient.get<any>(this.base_url_waiver + 'api/' + this.apiVer + "/Collection1/getLoanSettleAdditionalChargeDetails", { params })
  }
  getSettlementDetailsvalue(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Collection1/GetSettlementDtlForApproval', { params });

  }
  GetPaymentModeDetails(param) {
    const params = new HttpParams()
      .set('FIRM_ID', param.FIRM_ID)
      .set('PRODUCT_ID', param.PRODUCT_ID)
      .set('flag', param.flag);
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/PaymentMode/getPaymentModes', { params });
  }
  GetSchemeid(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/DueDateChange/GetSchemeID', { params });

  }
  getCommonItemListlms(FIRM_ID: any, COMMON_DATA_TYPE_ID: any, productid: any) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID)
      .set('PRODUCT_ID', productid);
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/GeneralController', { params });
  }
  CollReversalApproval(params) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/CollReversalApproval', params, httpOptions);
  }
  getCollRequestData(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/CollReversalApproval/getCollRequestData', { params });

  }
  agreementsched(params) {

    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/InstallmentSchedule/getInstallmentScheduleForAgreement', { params });

  }
  esigndownload(id, key) {
    const httpOptions = { headers: new HttpHeaders({ "Authorization": key, 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': "GET,POST,OPTIONS,DELETE,PUT", "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With" }) };

    return this.httpClient.get('https://api.digio.in/v2/client/document/download?document_id=' + id, httpOptions);

  }
  esigncode() {
    return this.httpClient.get('https://app.digio.in/sdk/v11/digio.js');

  }
  GetDuedateChange(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/DueDateChange/DueDateChangeGetApproval', { params });

  }
  insuranceamt(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url + "/api/v1/CalculateInsurance/getLoanDetails", params, httpOptions)

  }
  agrrementdetails(params) {
    return this.httpClient.get<any>(this.base_url + "/api/v1/InstallmentSchedule/getDetailsForAgreement", { params })

  }
  applicationdetails(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url + "/api/v1/Disbursement/getApplicationDetails", params, httpOptions)

  }
  getbankdetails(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url + "/api/v1/Disbursement/getBankDetails", params, httpOptions)

  }
  public getLoandata(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url_waiver + "/api/v1/Disbursement/getCustomerDetails", params, httpOptions)
  }
  getagreementdetails(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post<any>(this.base_url + "/api/v1/Disbursement/agreementDetails", params, httpOptions)
  }
  public WaiverApprovals(params) {
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/WaiverApproval', params);
  }
  digioesign(params, data, ten) {
    const httpOptions = { headers: new HttpHeaders({ "Authorization": data, 'Content-Type': 'application/json', 'Accept': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': "GET,POST,OPTIONS,DELETE,PUT", "Access-Control-Allow-Headers": "Content-Type, Accept, X-Requested-With" }) };

    return this.httpClient.post<any>(this.base_url_waiver + 'api/' + this.apiVer + '/DuedatechangeExternal/Templates?filename=PIPL_V15.0_' + ten + 'Months', params, httpOptions)

  }
  public GetCommonReason(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetCommonReason', { params });
  }
  public GetWaiverDetails(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetWaiverDetails', { params });
  }
  public accountdetail(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    // return this.httpClient.post('https://unsecurepl.manappuram.com/plapi_public/api/v1/Disbursement/getCustomerDetails',params,httpOptions);
    return this.httpClient.post(this.base_url_waiver + 'api/' + this.apiVer + '/Disbursement/getCustomerDetails', params, httpOptions);
  }
  kycphotos(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/UpdateKYC/KYCReportPhoto', { params });

  }
  public updateDuedateChange(params) {
    return this.httpClient.post(this.base_url_waiver + "api/" + this.apiVer + "/DueDateChange/DueDateChangePost", params);
  }
  public getEmiDay(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + "/DueDateChange/getEMIDay", { params });

  }
  esigndocsave(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post<any>("https://gen.mactech.net.in/esign_public/api/v1/EsignDocSave/EsignDocumentUploadSavew", param, httpOptions)
  }
  savedocumentdet(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post<any>(this.base_url_lms + "/api/v1/AgreementSavew", param, httpOptions)
  }
  public getCommonItems(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + "/GeneralController", { params });
  }
  public kycDetails(params) {
    return this.httpClient.get(this.base_url_kyc + 'api/' + this.apiVer + '/KARZAAPI/GetKycDetails', { params })
  }
  public kycImageDetails(params) {
    return this.httpClient.get(this.base_url_kyc + 'api/' + this.apiVer + '/KARZAAPI/GetKycImageDetails', { params })
  }



  public kycUpdatedVerification(params) {

    return this.httpClient.get(this.base_url_kyc + 'api/' + this.apiVer + '/KARZAAPI/GetUpdatedKycDetails', { params })
  }
  nocreports(params) {
    return this.httpClient.get(this.base_url_kyc + 'api/' + this.apiVer + '/ClosedLoan/ClosedLoan', { params })

  }

  public enachreports(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post<any>(this.base_url_lms + "/api/v1/EnachBulkUpload/EnachDuplicationReport", params, httpOptions)
  }
  public AddCustomerKycConfirm(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post<any>(this.base_url_kyc + "/api/v1/KARZAAPI/KycConfirm", params, httpOptions)
  }
  public getCommonItemList(FIRM_ID: any, COMMON_DATA_TYPE_ID: any, productid: any) {
    const params = new HttpParams()
      .set('FIRM_ID', FIRM_ID)
      .set('COMMON_DATA_TYPE_ID', COMMON_DATA_TYPE_ID)
      .set('PRODUCT_ID', productid);
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/GeneralController', { params })
  }

  getcommonmaster(params) {
    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/GeneralController', { params });
  }
  saveCollectionReversal(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/CollectionReversal', params, httpOptions);
  }

  GetCollectionReversal(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    return this.httpClient.get(this.base_url_lms + 'api/' + this.apiVer + '/CollectionReversal/getCollectionData', { params })
  }

  statedetails(params) {
    return this.httpClient.get(this.baseurltwnew + 'api/' + this.apiVer + '/States/getStates', { params });
  }

  Districtdetails(params) {
    return this.httpClient.get(this.baseurltwnew + 'api/' + this.apiVer + '/District', { params });
  }


  public SchemeAdd(params) {
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + "/Schema/AddSchema", params)
  }
  public GetSchemaDetalisdashboard(params) {
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + "/Schema/GetSchemaDetalis", params)
  }

  public GetSchemeById(params) {
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + "/Schema/GetSchemaDetalisByRequestedID", params)
  }

  public getcustdtalpho(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };

    // return this.httpClient.post('https://unsecurepl.manappuram.com/plapi_public/api/v1/Customer/GetCustomerPhotoDtlsForVerification',params,httpOptions);
    return this.httpClient.post('https://unsecurepl.manappuram.com/plapi_publiclive/api/v1/Customer/GetCustomerPhotoDtlsForVerification', params, httpOptions);
  }
  public agreementpl(params) {
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/AgreementSave/getLoanData', params);
  }
  public getcustdeta(params) {

    // return this.httpClient.get('https://unsecurepl.manappuram.com/plapi_public/api/v1/Customer/GetCustomerKycDtlsForVerification',{ params });
    return this.httpClient.get('https://unsecurepl.manappuram.com/plapi_publiclive/api/v1/Customer/GetCustomerKycDtlsForVerification', { params });
  }

  public getCustLists(params) {
    // let temp_url = this.base_url_lms+'api/'+this.apiVer+'Waiver/GetCustomer';
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetCustomer', { params });
  }

  public getBranchesList(params) {
    let temp_url = this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetBranch';
    return this.httpClient.get(temp_url, { params });
  }
  public reason(params): Observable<any> {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetCommonReason', { params })

  }
  public GetWaiverDetailsForEntry(params) {


    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/Waiver/GetWaiverDetailsForEntry', { params });
  }
  public getCredentials(): any {
    var userData = JSON.parse(sessionStorage.getItem("currentUser"));
    if (userData == null) {
      var userData = JSON.parse(sessionStorage.getItem("branchuser"));
    }
    return userData;
  }

  kycstatusreport(params) {
    return this.httpClient.get(this.base_url_waiver + 'api/' + this.apiVer + '/UpdateKYC/KYCReport', { params })

  }
  public getLoanDetails(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstallmentCollection/getLoanDetails', { params }, httpOptions);
  }
  kycupdate(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/UpdateKYC/UpdateCustomerKycDtls', params, httpOptions);
  }
  /**
 * 
 * @param searchType 
 * @summary get loan details for common component
 */

  public getLoanData(params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    let url = "https://mac.mactech.net.in/plgen/api/"

    if (environment.baseUrl == 'https://mac.mactech.net.in/') {
      return this.httpClient.post<any>(url + this.apiVer + '/InstCollection/getLoanData', params, httpOptions);

    }
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getLoanData', params, httpOptions);
  }
  public getLoanDatasettled(params: any) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    let url = "https://mac.mactech.net.in/plgen/api/"

    if (environment.baseUrl == 'https://mac.mactech.net.in/') {
      return this.httpClient.post<any>(url + this.apiVer + '/InstCollection/getallLoanDetails', params, httpOptions);

    }
    return this.httpClient.post<any>(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getallLoanDetails', params, httpOptions);
  }

    public getLoanDataBlock1(params: any) {
      const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
      // let url = "https://mac.mactech.net.in/plgen/api/"

      // if (environment.baseUrl == 'https://mac.mactech.net.in/') {
      //   return this.httpClient.post<any>(url + this.apiVer + '/NewSettlement/SettlementApprovalData', params, httpOptions);

      // }
      return this.httpClient.post<any>(this.base_url_session + 'api/' + this.apiVer + '/NewSettlement/SettlementApprovalData', params, httpOptions);
    }

  public getLoanDatatest(params: any, token: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + token
      })
    };

    let url = "https://mac.mactech.net.in/plgen/api/"

    return this.httpClient.post<any>(url + this.apiVer + '/InstCollection/getLoanData', params, httpOptions);

  }
  //After Modularization
  public getLiveLoanSearchData(firmID: any) {
    const params = {
      flag: 1
    }
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/InstCollection/getSearchData', params, httpOptions);
  }

  public getManualTypeList(param) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url_lms + 'api/' + this.apiVer + '/Adhoc/getData', param, httpOptions);
  }

  public loanAccntStatusReq(params) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url + 'api/' + this.apiVer + '/LoanAccountStatus', params, httpOptions);
  }

  public getLoanAccountUpdReq(params) {

    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url + 'api/' + this.apiVer + '/LoanAccountStatus/GetRequestData', params, httpOptions);

  }

  public loanAccountStatusApproval(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url + 'api/' + this.apiVer + '/LoanAccountStatus/APPROVAL', params, httpOptions);
  }

  public getloanAccountDashboard(params) {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }) };
    return this.httpClient.post(this.base_url + 'api/' + this.apiVer + '/LoanAccountStatus/GetDashBoardData', params, httpOptions);
  }

  private selectedRowSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public selectedRow$: Observable<any> = this.selectedRowSubject.asObservable();

  setSelectedRow(row: any): void {
    this.selectedRowSubject.next(row);
  }

  
  encrypt2(messageToencrypt: string,key) {

    let Key =  CryptoJS.enc.Utf8.parse(atob(key));
    let iv = CryptoJS.enc.Utf8.parse(atob(key));

    if(messageToencrypt!='' && messageToencrypt!=null && messageToencrypt!=undefined){
      var encryptedMessage = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(messageToencrypt), Key,
          {
              keySize: 128 / 8,
              iv: iv,
              mode: CryptoJS.mode.CBC,
             padding: CryptoJS.pad.Pkcs7
          });
          let val=encryptedMessage.toString()
          return val;
    }else {
     return null
    }
  }


  public getloanidagreement(params) {
    return this.httpClient.get(this.base_url_new + 'api/' + this.apiVer + '/AgreementDownload/GetLoansForAgreementDownload', {params});
  }
  public getcustdtlsagreement(params) {
    return this.httpClient.get(this.base_url_new + 'api/' + this.apiVer + '/AgreementDownload/GetDetailsForAgreementDownload', {params});
  }
  public loopingtable(params) {
    return this.httpClient.get(this.base_url_new + 'api/' + this.apiVer + '/InstallmentSchedule/getInstallmentScheduleNew', {params});
  }
  public getdetailsagreement(params) {
    return this.httpClient.get(this.base_url_new + 'api/' + this.apiVer + '/InstallmentSchedule/getDetailsForAgreementExistLoans', {params});
  }


}
