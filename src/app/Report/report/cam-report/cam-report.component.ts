import { Component, OnInit, Inject } from '@angular/core';
import { LoanApplicationService } from '../../../services/LOS/loan-application.service';
import { VerificationService } from '../../../services/LOS/verification.service';
import html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { MAT_DIALOG_DATA } from '@angular/material';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-cam-report',
  templateUrl: './cam-report.component.html',
  styleUrls: ['./cam-report.component.scss']
})
export class CamReportComponent implements OnInit {

  public displayedColumns = ['headers'];
  constructor(private loanApplicationService: LoanApplicationService,
    private commonService: CommonService,
    private verificationService: VerificationService, @Inject(MAT_DIALOG_DATA) private data: any) { }
  public applicationData: any;
  public loanParameters: any;
  public applicationId: number;
  public userData: object;
  public insuranceList: Array<object> = [];
  public customerList: Array<object> = [];
  public employmentList: Array<object> = [];
  public bankAccountList: Array<object> = [];
  public verificationList: Array<object> = [];
  public loanAssetList: Array<object> = [];
  public loanVehicleList: Array<object> = [];
  public loanAssetBodyDataList: Array<object> = [];
  public deviationList: Array<object> = [];
  public currentDate = new Date();
  ngOnInit() {
    this.userData = this.commonService.getCredentials();
    if (!!this.data && !!this.data['ApplicationID'] && !!this.data['isCamReport']) {
      this.applicationId = this.data['ApplicationID'];
      this.getAppicationData();
      this.getLoanParameters();
      this.getEmploymentDetails();
      this.getBankDetails();
      this.getVerificationDetails();
      this.getAssets();
      this.getLoanVehicleDetails();
      // this.getBodyDetails();
      this.getDeviationList();
    }
  }
  public getAppicationData(): void {
    const param = {
      FirmID: +this.userData['firmID'],
      BranchID: +this.userData['branchID'],
      ProductID: +this.userData['productID'],
      ApplicationID: this.applicationId,
      EnterBy: this.userData['empCode'].toString(),
      FunctionID: 65
    }
    this.commonService.getApplicationByApplicationId(param).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['applicationData'] !== null) {
          this.applicationData = res['applicationData'];
          this.applicationData['pslStatus'] = (this.applicationData['pslStatus'] == null || this.applicationData['pslStatus'] == '' || !this.applicationData['pslStatus']) ? "N" : this.applicationData['pslStatus']
        }
        if (res['applicantsDataProperties'] !== null) {
          this.customerList = res['applicantsDataProperties'];
        }
      }
    })
  };
  public getAssets(): void {
    this.loanApplicationService.searchLoanAssets({ optionId: 2, searchValue: this.applicationId }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanAssetDataList'] !== null) {
          this.loanAssetList = res['loanAssetDataList'];
        }
      }
    })
  }
  public getDeviationList(): void {
    this.verificationService.getDeviationList(this.applicationId).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['deviationList'] !== null) {
          this.deviationList = res['deviationList'];
        }
      }
    })

  }
  public getLoanVehicleDetails(): void {
    this.loanApplicationService.loanAssetVehicleDataList({ optionId: 2, searchValue: this.applicationId }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanAssetVehicleDataList'] !== null) {
          this.loanVehicleList = res['loanAssetVehicleDataList'];
        }
      }
    })
  }
  public getBodyDetails(): void {
    this.loanApplicationService.fetchAssetBodyList({ optionId: 2, searchValue: this.applicationId }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanAssetBodyDataList'] !== null) {
          this.loanAssetBodyDataList = res['loanAssetBodyDataList'];
        }
      }
    })
  }
  public getVerificationDetails(): void {
    this.verificationService.getFieldInvestigationVerificationList({ Application_ID: this.applicationId }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['getappFIV'] !== null) {
          this.verificationList = res['getappFIV'];
        }
      }
    })
  }
  public getEmploymentDetails(): void {
    this.loanApplicationService.getEmployee({ Applicationid: this.applicationId }).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['employmentDataList'] !== null) {
          this.employmentList = res['employmentDataList'];
          this.employmentList.forEach(x => {
            if (x['employedTill'] == '01-01-0001') {
              x['employedTill'] = 'Current';
            }
          })
        }
      }

    })
  }
  public getBankDetails(): void {
    this.loanApplicationService.getBankDetails(2, this.applicationId).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['bankAccountDataList'] !== null) {
          this.bankAccountList = res['bankAccountDataList'];
        }
      }
    })
  }
  private _datePipe(DateValue) {
    var date = new Date(DateValue);
    return date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear();
  }
  private getLoanParameters(): void {
    this.loanApplicationService.getLoanParameters(this.applicationId).subscribe(res => {
      if (!!res && res['status'].code == 1) {
        if (res['loanParameters'] !== null) {
          this.loanParameters = res['loanParameters'];
        }
        if (res['loanInsuranceDetailsList'] !== null) {
          this.insuranceList = res['loanInsuranceDetailsList'];
        }
      }
    })
  }
  public captureScreen(): void {
    var data = document.getElementById('contentToConvert');
    html2canvas(data).then(canvas => {
      var pdf = new jspdf('p', 'pt', [canvas.width, canvas.height]);
      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
      pdf.save('cam-report');
    })
  };
  public convert(): void {
    var doc = new jspdf();
    jspdf.autoTableSetDefaults({
      columnStyles: { id: { fontStyle: 'bold' } },
      headStyles: { fillColor: 0 },
    });
    doc.setFontSize(9);
    doc.setFontStyle('bold');
    if (!!this.applicationData && this.applicationData !== null) {
      doc.text('Application Details', 14, 16);
      doc.autoTable({
        html: '#applicationDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: 20,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.applicationData && this.applicationData !== null && !!this.loanParameters && this.loanParameters !== null) {
      doc.text('Loan Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#loanDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (this.applicationData && this.applicationData !== null) {
      doc.text('Key Ability Indicator', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#keyability',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.insuranceList && this.insuranceList !== null && this.insuranceList.length > 0) {
      doc.text('Insurance Funding Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#insurancedetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.customerList && this.customerList !== null && this.customerList.length > 0) {
      doc.text('Applicant Personal Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#applicantDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.employmentList && this.employmentList !== null && this.employmentList.length > 0 && !!this.applicationData && !!this.applicationData !== null) {
      doc.text('Employment/Business Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#employmentDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.bankAccountList && this.bankAccountList.length > 0 && this.bankAccountList !== null && !!this.applicationData && !!this.applicationData !== null) {
      doc.text('Bank Statement', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#bankStatement',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (!!this.verificationList && this.verificationList !== null && this.verificationList.length > 0) {
      doc.text('Verification Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#verificationDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      });
    }
    if (this.loanAssetList.length > 0 && !!this.loanAssetList && this.loanAssetList !== null) {
      doc.text('New Asset Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#assetDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      })
    }
    if (this.loanVehicleList.length > 0 && !!this.loanVehicleList && this.loanVehicleList !== null) {
      doc.text('Loan Vehicle Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#loanVehicleDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      })
    }

    if (this.applicationData && this.applicationData !== null) {
      doc.text('PSL Category Details', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#categoryDetails',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      })
    }
    if (!!this.deviationList && this.deviationList !== null && this.deviationList.length > 0) {
      doc.text('Deviation', 14, doc.autoTable.previous.finalY + 10);
      doc.autoTable({
        html: '#deviation',
        tableWidth: '100%',
        styles: { cellPadding: 0.5, fontSize: 8 },
        startY: doc.autoTable.previous.finalY + 14,
        showHead: 'firstPage',
        theme: 'grid'
      })
    }

    // doc.output("dataurlnewwindow");
    doc.save('cam_report.pdf');
  }

}