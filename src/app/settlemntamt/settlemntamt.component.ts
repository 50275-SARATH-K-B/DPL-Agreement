import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/report/common.service';
import { DatePipe } from '@angular/common';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
@Component({
  selector: 'app-settlemntamt',
  templateUrl: './settlemntamt.component.html',
  styleUrls: ['./settlemntamt.component.scss']
})
export class SettlemntamtComponent implements OnInit {

  totalAmt: any = 0;
  SendbackRemarks: any;
  visible: boolean = false;
  nonvisible: boolean = true;
  displayedColumns: any[] =
    [
      'ChargeName',
      'Amount',
      'Waiver',
    ];
  dataSource = new MatTableDataSource<any>();
  waiverArray: any[];
  userData: any;
  isReadonly: boolean = false;
  item: number;
  public settings: Settings;

  constructor(public dialogRef: MatDialogRef<SettlemntamtComponent>, public fb: FormBuilder, private commonService: CommonService,
    private datePipe: DatePipe, private dialog: MatDialog,
    public appSettings: AppSettings,

    @Inject(MAT_DIALOG_DATA) public data: SettlemntamtComponent) {
      this.settings = this.appSettings.settings;

     }

  ngOnInit(): void {
    console.log(this.data)
    this.waiverArray = [];
    this.userData = this.commonService.getCredentials();
    if (this.data['funid'] == 62 || this.data['funid'] == 63 || this.data['funid'] == 67 || this.data['funid'] == 35 || this.data['funid'] == 45 || this.data['funid'] == 59) {
      this.nonvisible = false;
      this.visible = false;
      this.isReadonly = true;
        let loanDetailsList = this.data["waiver"];
        var sizevalue = Object.keys(loanDetailsList).length;
        for (let i = 0; i < sizevalue; i++) {
          this.waiverArray.push({
            "ChargeId": loanDetailsList[i].ChargeId,
            "ChargeName": loanDetailsList[i].ChargeName,
            "ChargeAmount": loanDetailsList[i].ChargeAmount,
            "SendbackRemarks": loanDetailsList[i].ClosureChargeAmount,
          })
        }
        this.dataSource = new MatTableDataSource<any>( this.waiverArray);
    } 
    else if(this.data["waiverarrayValue"]){
      console.log(this.data["waiverarrayValue"])
      let loanDetailsList = this.data["waiverarrayValue"];
        var sizevalue = Object.keys(loanDetailsList).length;
        for (let i = 0; i < sizevalue; i++) {
          this.waiverArray.push({
            "ChargeId": loanDetailsList[i].ChargeId,
            "ChargeName": loanDetailsList[i].ChargeName,
            "ChargeAmount": loanDetailsList[i].ChargeAmount,
            "SendbackRemarks": loanDetailsList[i].SendbackRemarks,
          })
        }
        this.dataSource = new MatTableDataSource<any>(this.waiverArray);
    }
    else {
      this.nonvisible = true;
      this.visible = false;
      this.isReadonly = false;
      const params = {
        FIRM_ID: this.userData['firmID'],
        Product_ID: 69,
        LOAN_ID: this.data['loadId'],
        TYPE_ID: 1,
        valueDt: this.datePipe.transform(this.data['valueDate'], 'dd/MM/yyyy'),
      };
      this.settings.loadingSpinner = true;
      this.commonService.getSettlementwaiverDetails(params)
        .subscribe(res => {
          this.settings.loadingSpinner = false;
          if (res['status'].code == 1) {
            if (res['loanDataList']) {
              let loanDetailsList = res['loanDataList'];
              var sizevalue = Object.keys(loanDetailsList).length;
              for (let i = 0; i < sizevalue; i++) {
                this.waiverArray.push({
                  "ChargeId": loanDetailsList[i].ChargeId,
                  "ChargeName": loanDetailsList[i].ChargeName,
                  "ChargeAmount": loanDetailsList[i].ChargeAmount,
                  "ClosureChargeAmount": loanDetailsList[i].ClosureChargeAmount,
                  "SendbackRemarks": ""
                })
              }
              this.dataSource = new MatTableDataSource<any>(this.waiverArray);
            } else {
              this.DisplayMessage(res['status'].message, "Alert");
            }

          }
        }, error => {
        });
    }

  }

  keyPress(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
change(e,i){
  if(e.ChargeAmount < 0){
    this.DisplayMessage(e.ChargeName + " can't waive Off", "Alert");

  }

}
  Totalamounts(e, i) {
    if (e.ChargeAmount >= 0) {
      if (+e.SendbackRemarks >= 0 && +e.ChargeAmount >= +e.SendbackRemarks) {
        if (this.data['funid'] == 62 || this.data['funid'] == 63 || this.data['funid'] == 67 || this.data['funid'] == 35 || this.data['funid'] == 45 || this.data['funid'] == 59) {
          this.visible = false;
          this.nonvisible = false;
        } else {
          this.visible = false;
          this.nonvisible = true;
          this.totalAmt = +0;
          this.waiverArray[this.waiverArray.length - 1].SendbackRemarks = "";
        }

      } else {
        this.DisplayMessage(e.ChargeName + " Must be between 0 - " + +e.ChargeAmount, "Alert");
        e.SendbackRemarks = "";
      }

    }
    
   
  }

  Totalamount() {
    this.totalAmt = 0;
    this.waiverArray.forEach(e => {
      this.totalAmt = +this.totalAmt + +e.SendbackRemarks;
    })
    this.totalAmt = this.totalAmt.toFixed(2);
    this.waiverArray[this.waiverArray.length - 1].SendbackRemarks = this.totalAmt;
    this.visible = true;
    this.nonvisible = false;
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
      "amt": this.totalAmt,
      "waiverarray": this.waiverArray,
    });
  }



  onDismiss(): void {
    this.dialogRef.close(false);
  }

}
