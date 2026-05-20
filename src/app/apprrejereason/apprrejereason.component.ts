import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { CommonService } from '../services/report/common.service';
import { AppSettings } from './../app.settings';
import { Settings } from './../app.settings.model';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
@Component({
  selector: 'app-apprrejereason',
  templateUrl: './apprrejereason.component.html',
  styleUrls: ['./apprrejereason.component.scss']
})
export class ApprrejereasonComponent implements OnInit {

  searchText: any;
  displayedColumns: any[] =
    [
      'Chargeid',
      'Description',
      'Chargerate',
      'Computedon',
      'Amount',
      'Total',
      'Tax',
      'Taxable',
    ];
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  waiverArray: any = [];
  userData: any;
  filter: string;
  sort: any;
  visible: boolean = false;
  nonvisible: boolean = true;
  public highlightedRows: Array<object> = [];
  totalAmt: number;
  item: number;
  isReadonly: boolean;
  Totalvalue: any;
  Taxable: any;
  Tax: any;
  TaxtotalAmt: number;
  TaxabletotalAmt: number;
  waiverArraygstTaxableAmount: any;
  waiverArraycessTaxableAmount: any;
  waiverArraygstTaxAmount: any;
  waiverArraycessTaxAmount: any;
  public settings: Settings;

  constructor(public appSettings: AppSettings,public dialogRef: MatDialogRef<ApprrejereasonComponent>, private commonService: CommonService, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ApprrejereasonComponent) {
      this.settings = this.appSettings.settings;
     }

  ngOnInit(): void {
    console.log(this.data)
    this.userData = this.commonService.getCredentials();
    if (this.data['funid'] == 62 || this.data['funid'] == 63 || this.data['funid'] == 67 || this.data['funid'] == 35 || this.data['funid'] == 45 || this.data['funid'] == 59) {
      this.nonvisible = false;
      this.visible = false;
      this.isReadonly = true;
      if (this.data["charge"]) {
        let loanDetailsList = this.data["charge"];
        var sizevalue = Object.keys(loanDetailsList).length;
        for (let i = 0; i < sizevalue; i++) {
          this.waiverArray.push({
            "ChargeId": loanDetailsList[i].ChargeId,
            "ChargeName": loanDetailsList[i].ChargeName,
            "ChargeRate": loanDetailsList[i].ChargeRate,
            "ComputedOn": loanDetailsList[i].ComputedOn,
            "Amount": loanDetailsList[i].Amount,
            "TaxAmount": loanDetailsList[i].TaxAmount,
            "TaxableAmount": loanDetailsList[i].TaxableAmount,
            "TotalChargedAmount": loanDetailsList[i].TotalChargedAmount,
            "gststatus": loanDetailsList[i].gststatus,
            "gstrate": loanDetailsList[i].gstrate,
            "cessstatus": loanDetailsList[i].cessstatus,
            "cessrate": loanDetailsList[i].cessrate
          })
        }
        this.Totalvalue = this.data['total']
        this.Tax = this.data['Taxtotal']
        this.Taxable = this.data['Taxabletotal']
        this.dataSource = new MatTableDataSource<any>(this.waiverArray);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 250);
      } else if (this.data["additional"]) {
        let loanDetailsList = this.data["additional"];
        var sizevalue = Object.keys(loanDetailsList).length;
        for (let i = 0; i < sizevalue; i++) {
          this.waiverArray.push({
            "ChargeId": loanDetailsList[i].ChargeId,
            "ChargeName": loanDetailsList[i].ChargeName,
            "ChargeRate": loanDetailsList[i].ChargeRate,
            "ComputedOn": loanDetailsList[i].ComputedOn,
            "Amount": loanDetailsList[i].Amount,
            "TaxAmount": loanDetailsList[i].TaxAmount,
            "TaxableAmount": loanDetailsList[i].TaxableAmount,
            "TotalChargedAmount": loanDetailsList[i].TotalChargedAmount,
            "gststatus": loanDetailsList[i].gststatus,
            "gstrate": loanDetailsList[i].gstrate,
            "cessstatus": loanDetailsList[i].cessstatus,
            "cessrate": loanDetailsList[i].cessrate
          })
        }
        this.Totalvalue = this.data['total']
        this.Tax = this.data['Taxtotal']
        this.Taxable = this.data['Taxabletotal']
        this.dataSource = new MatTableDataSource<any>(this.waiverArray);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        }, 250);
      }
    }
    else if (this.data['additionalarray']) {
      let loanDetailsList = this.data["additionalarray"];
      var sizevalue = Object.keys(loanDetailsList).length;
      for (let i = 0; i < sizevalue; i++) {
        this.waiverArray.push({
          "ChargeId": loanDetailsList[i].ChargeId,
          "ChargeName": loanDetailsList[i].ChargeName,
          "ChargeRate": loanDetailsList[i].ChargeRate,
          "ComputedOn": loanDetailsList[i].ComputedOn,
          "Amount": loanDetailsList[i].Amount,
          "TaxAmount": loanDetailsList[i].TaxAmount,
          "TaxableAmount": loanDetailsList[i].TaxableAmount,
          "TotalChargedAmount": loanDetailsList[i].TotalChargedAmount,
          "gststatus": loanDetailsList[i].gststatus,
          "gstrate": loanDetailsList[i].gstrate,
          "cessstatus": loanDetailsList[i].cessstatus,
          "cessrate": loanDetailsList[i].cessrate
        })
      }
      this.Totalvalue = this.data['total']
      this.Tax = this.data['Taxtotal']
      this.Taxable = this.data['Taxabletotal']
      this.dataSource = new MatTableDataSource<any>(this.waiverArray);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      }, 250);
    }
    else {
      this.nonvisible = true;
      this.visible = false;
      this.isReadonly = false;
      const param = {
        "FIRM_ID": this.userData['firmID'],
        "PRODUCT_ID": 69,
        "LOAN_ID": this.data['loadId'],
        "BranchID": this.userData['branchID'],
        "InputData": this.data['loadId'],
      }
      this.settings.loadingSpinner = true;
      this.commonService.charge(param).subscribe(appsearch => {
        this.settings.loadingSpinner = false;
        if (appsearch['status'].code == "1" && appsearch['status'].flag == "1") {
          if (appsearch['additionalChargeList']) {
            let loanDetailsList = appsearch['additionalChargeList'];
            var sizevalue = Object.keys(loanDetailsList).length;
            for (let i = 0; i < sizevalue; i++) {
              this.waiverArray.push({
                "ChargeId": loanDetailsList[i].ChargeId,
                "ChargeName": loanDetailsList[i].ChargeName,
                "ChargeRate": loanDetailsList[i].ChargeRate,
                "ComputedOn": loanDetailsList[i].ComputedOn,
                "Amount": loanDetailsList[i].Amount,
                "TaxAmount": loanDetailsList[i].TaxAmount,
                "TaxableAmount": loanDetailsList[i].TaxableAmount,
                "TotalChargedAmount": loanDetailsList[i].TotalChargedAmount,
                "gststatus": loanDetailsList[i].gststatus,
                "gstrate": loanDetailsList[i].gstrate,
                "cessstatus": loanDetailsList[i].cessstatus,
                "cessrate": loanDetailsList[i].cessrate
              })
            }
            console.log(this.waiverArray)
            this.dataSource = new MatTableDataSource<any>(this.waiverArray);
            setTimeout(() => {
              this.dataSource.paginator = this.paginator;
            }, 250);
          } else {
            this.DisplayMessage(appsearch['status'].message, "Alert");
          }
        }
      })
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  DisplayMessage(message: string, action: string) {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: action },
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  onConfirm(): void {
    this.dialogRef.close({
      "amt": this.Totalvalue,
      "Taxamt": this.Tax,
      "Taxableamt": this.Taxable,
      "additionalCharge": this.waiverArray,
    });
  }


  onDismiss(): void {
    this.dialogRef.close(false);
  }


  showNoApplicationIdFlag: boolean = false;
  search() {
    var component = this;
    this.showNoApplicationIdFlag = true;
    this.filterSource();
  }
  public filterSource(): void {
    this.dataSource.filterPredicate = (data, filter) =>
    (data.ChargeId.trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
      || data.ChargeName.toString().trim().toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1);
    this.dataSource.filter = this.filter.trim().toLowerCase();

    if (this.dataSource.filteredData.length == 0) {
      this.dataSource = new MatTableDataSource<any>([]);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (this.showNoApplicationIdFlag) {
        this.showNoApplicationIdFlag = false;
        this.filter = "";
        this.DisplayMessage("No Data Found", "Alert")
      }
    }
  }


  Totalamounts(e) {
    if (this.data['funid'] == 62 || this.data['funid'] == 63) {
      this.visible = false;
      this.nonvisible = false;
    } else {
      this.visible = false;
      this.nonvisible = true;
      var item = this.waiverArray.findIndex(s => s.ChargeId == e.ChargeId)
      // if (e.gststatus == 1) {
      //   var rate = 100 + +e.gstrate;
      //   var taxamt = (+this.waiverArray[item].TotalChargedAmount * e.gstrate) / rate;
      //   this.waiverArraygstTaxAmount = taxamt.toFixed(2)
      // }
      // else {
      //   this.waiverArraygstTaxAmount = 0
      // }
      // if (e.cessstatus == 1) {
      //   var rate = 100 + +e.cessrate;
      //   var taxamt = (+this.waiverArray[item].TotalChargedAmount * e.cessrate) / rate;
      //   this.waiverArraycessTaxAmount = taxamt.toFixed(2)
      // }
      // else {
      //   this.waiverArraycessTaxAmount = 0;
      // }
      // var ratevalue = +e.gstrate + +e.cessrate;
      // var rate = 100 + +ratevalue;
      // var taxamt = (+this.waiverArray[item].TotalChargedAmount * ratevalue) / rate;
      // var waiverArrayTaxAmount = taxamt;
      const param = {
        "chargeID":e.ChargeId,
        "loanID": this.data['loadId'],
        "type": 1,
        "amount": +this.waiverArray[item].TotalChargedAmount
      }
      this.settings.loadingSpinner = true;
      this.commonService.gstcharge(param).subscribe(appsearch => {
        this.settings.loadingSpinner = false;
        if (appsearch['status'].code == "1" && appsearch['status'].flag == "1") {
          var tax = +appsearch['gstAmount'] + +appsearch['cessAmount']
            var waiverArrayTaxAmount = tax.toFixed(2)
            this.waiverArray[item].TaxAmount = waiverArrayTaxAmount;
            var TaxableAmount = appsearch['taxableAmount'];
            this.waiverArray[item].TaxableAmount = TaxableAmount
        }
      })
    }
  }

  Totalamount() {
    this.totalAmt = 0;
    this.TaxtotalAmt = 0;
    this.TaxabletotalAmt = 0;
    this.waiverArray.forEach(e => {
      this.totalAmt = +this.totalAmt + +e.TotalChargedAmount;
      this.TaxtotalAmt = +this.TaxtotalAmt + +e.TaxAmount;
      this.TaxabletotalAmt = +this.TaxabletotalAmt + +e.TaxableAmount;
    })
    this.Totalvalue = this.totalAmt.toFixed(2);
    this.Tax = this.TaxtotalAmt.toFixed(2);
    this.Taxable = this.TaxabletotalAmt.toFixed(2);
    this.visible = true;
    this.nonvisible = false;
  }


  keyPress(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/;
    // let inputChar = String.fromCharCode(event.charCode);
    // if (event.keyCode != 8 && !pattern.test(inputChar)) {
    //   event.preventDefault();
    // }

    let value = event.target.value;
     let current: string = value;
      const position = event.target.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(pattern)) {
       event.preventDefault();
      }
  }


}
