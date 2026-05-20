import { Component, OnInit, Inject } from '@angular/core';
import { CommonService } from '../../services/common/common.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FileviewComponent } from '../../commoncomponents/fileview/fileview.component';
export interface documentDataElement {
  documentId: number;
  identityTypeDescr: string;
  identityNo: string;
  countryName: boolean;
  issueDate: string;
}
@Component({
  selector: 'app-applicant-details-modal',
  templateUrl: './applicant-details-modal.component.html',
  styleUrls: ['./applicant-details-modal.component.scss']
})
export class ApplicantDetailsModalComponent implements OnInit {
  private userData: object;
  public applicantData: object;
  public customerData: object;
  public customerAddressData: object;
  public loanAssetData: object;
  public loanData: object;
  public imageData: string = '';
  public documentList: documentDataElement[] = [];
  public displayedColumns: string[] = ["documentId", "identityTypeDescr", "identityNo", "countryName", "view"];
  public documentDataSource = new MatTableDataSource<documentDataElement>(this.documentList);
  constructor(private commonService: CommonService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    if (!!this.data && !!this.data['applicationId']) {
      this.getApplicationDetails();
      this.getLoanAssetDetails();
      this.getLoanParameters();
      // this.getDocumentsByApplicationId();
    }

  }
  private getApplicationDetails(): void {
    const params = {
      FirmID: this.userData['firmID'],
      BranchID: this.userData['branchID'],
      ProductID: this.userData['productID'],
      ApplicationID: this.data['applicationId'],
      EnterBy: this.userData['empCode'].toString(),
      FunctionID: 65
    }
    this.commonService.getApplicationByApplicationId(params).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['applicationData'] !== null) {
          this.applicantData = res['applicationData'];
          this.applicantData['traDate'] = this.datePipe.transform(this.applicantData['traDate'], 'dd/MM/yyyy');
          if (this.data['customerId'] !== null && !!this.data['customerId'] && this.data['customerId'] !== '') {
            this.getCustomerDetails({ optionId: 1, searchValue: this.data['customerId'] })
          } else {
            this.getCustomerDetails({ optionId: 1, searchValue: this.applicantData['custId'] })

          }
        }
      }
    })
  }
  private getLoanAssetDetails(): void {
    this.commonService.getLoanAssetDetails({ optionId: 2, searchValue: this.data['applicationId'], }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanAssetDataList'] !== null) {
          this.loanAssetData = res['loanAssetDataList'][0];
        }
      }
    })
  }
  private getDocumentsByApplicationId(): void {
    this.commonService.getDocumentDetail(1000349).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['applicationDocuments'] !== null && res['applicationDocuments'].length > 0) {
          this.documentList = res['applicationDocuments'];
          this.documentDataSource = new MatTableDataSource<documentDataElement>(this.documentList);
        }
      }
    })
  }
  public viewDocumentImage(data): void {
    if (data['documentId'] !== '' && data['documentId'] !== null && !!data['documentId']) {
      this.commonService.getDocumentImage(data['documentId']).subscribe(res => {
        if (!!res && res['status'].code == 1) {
          if (res['kycDocument'] !== null) {
            let data = {
              file: res['kycDocument']['data'],
              exte: res['kycDocument'].extension,
              isView: true
            };
            const dialogRef = this.dialog.open(FileviewComponent, {
              data: data,
              width: '50%',
              height: '95%',
            });
          }
        }
      })
    }
  }
  private getLoanParameters(): void {
    this.commonService.getLoanParameters({ applicationId: this.data['applicationId'] }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanParameters'] !== null) {
          this.loanData = res['loanParameters'];
        }
      }
    })
  }
  private getCustomerDetails(params): void {
    this.commonService.getCustomerDetails(params).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['customerDataList'] !== null) {
          this.customerData = res['customerDataList'][0];
          this.getCustomerPhoto(this.customerData['photoId']);
          if (this.customerData['gender'] == 'M') {
            this.customerData['gender'] = 'Male';
          } else if (this.customerData['gender'] == 'F') {
            this.customerData['gender'] = 'Female';
          } else {
            this.customerData['gender'] = 'Others';
          }
          this.customerData['middleName'] = (!this.customerData['middleName'] || this.customerData['middleName'] == '' || this.customerData['middleName'] == null) ? '' : this.customerData['middleName']
          this.customerData['firstName'] = this.customerData['firstName'] + ' ' + this.customerData['middleName'] + ' ' + this.customerData['lastName']
          this.customerData['dob'] = this.datePipe.transform(this.customerData['dob'], 'dd/MM/yyyy');
        }
        if (res['customerAddressList'] !== null) {
          this.customerAddressData = res['customerAddressList'].find(x => x['isPrimaryAddress'] == "Y");
        }
        if (res['customerIdentities'] !== null) {
          this.documentList = res['customerIdentities'];
          this.documentDataSource = new MatTableDataSource<documentDataElement>(this.documentList);
        }
      }
    })
  }
  private getCustomerPhoto(photoId): void {
    this.commonService.getCustomerPhoto(photoId).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['customerPhoto'] !== null) {
          this.imageData = res['customerPhoto']['data'] ? 'data:image/jpeg;base64,' + res['customerPhoto']['data'] : null;
        }
      }
    })
  }
}
