import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/report/common.service';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { AppSettings } from './../app.settings';
import { Settings } from './../app.settings.model';
import { AlertMessageComponenent } from '../commoncomponents/alertpopup/alertpopup.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ApprrejereasonComponent } from '../apprrejereason/apprrejereason.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-almdata',
  templateUrl: './almdata.component.html',
  styleUrls: ['./almdata.component.scss']
})
export class AlmdataComponent implements OnInit {
  public dataSource1 = new MatTableDataSource([])
  public displayedColumns1: string[] = ['slno', "bucket", "overdue", 'ot07', "8to14", "15to28", "onemonth2mpnth", "2month3month", "3monthto6month", "6monthto1yr", "1yearto3years", "3yearsto5years", "5years"];
  public dataSource2 = new MatTableDataSource([])
  public displayedColumns3: string[] = ['slno', "bucket", "overdue", 'ot07', "8to14", "15to28", "onemonth2mpnth", "2month3month", "3monthto6month", "6monthto1yr", "1yearto3years", "3yearsto5years", "5years"];
  public dataSource3 = new MatTableDataSource([])
  public displayedColumns2: string[] = ['slno', "bucket", "overdue", 'ot07', "8to14"];
  totalreportar: any[] = [];
  public settings: Settings;
  totalreportar2: any[] = [];
  totalreportar3: any[] = [];
  effective: any;
  maxDate: Date = new Date();

  constructor(public appSettings: AppSettings, private commonService: CommonService, public dialogRef: MatDialogRef<ApprrejereasonComponent>, private dialog: MatDialog, private datePipe: DatePipe,) {
    this.settings = this.appSettings.settings;

  }

  ngOnInit() {
    this.effective = new Date();
    this.getcustdaetails();
    

  }
  getcustdaetails() {
    this.settings.loadingSpinner = true;

    this.totalreportar =[];
    this.totalreportar3 =[];
    this.totalreportar2 =[];


    let params = {
      // "sysdate": this.effective.toLocaleDateString('en-GB').replace(/\//g, '-').toString(),
      // "sysdate": `${this.effective.getFullYear()}-${this.effective.getMonth() + 1}-${this.effective.getDate()}`,
         "sysdate": this.datePipe.transform(this.effective, 'dd-MM-yyy'),

      
    }
    console.log(params)
    this.commonService.aldata(params).subscribe(res1 => {
      debugger
      this.settings.loadingSpinner = false;
      if (res1['status'].flag == '1' && res1['status'].code == '1') {

        for (let i = 0; i < res1['interest Summary2'].length; i++) {
          this.totalreportar.push({
            "particulars": "Interest",
            "overdue": res1['interest Summary2'][0]['overdue'],
            "zerO_TO_7": res1['interest Summary2'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['interest Summary2'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['interest Summary2'][0]['fifteeN_TO_31'],
            "oveR_ONE_MONTH_TO_2_MONTHS": res1['interest Summary2'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
            "oveR_2_MONTHS_TO_3_MONTHS": res1['interest Summary2'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
            "oveR_3_MONTHS_UPTO_6_MONTHS": res1['interest Summary2'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
            "oveR_6_MONTHS_UPTO_1_YEAR": res1['interest Summary2'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
            "oveR_1_YEAR_UPTO_3_YEARS": res1['interest Summary2'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
            "oveR_3_YEARS_UPTO_5_YEARS": res1['interest Summary2'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
            "oveR_5_YEARS": res1['interest Summary2'][0]['oveR_5_YEARS']
          })

          // this.totalreportar3.push({
          //   "particulars":"Interest",
          //   "overdue": res1['interest Summary2'][0]['overdue'],
          //   "zerO_TO_7": res1['interest Summary2'][0]['zerO_TO_7'],
          //   "eighT_TO_14": res1['interest Summary2'][0]['eighT_TO_14'],
          //   "fifteeN_TO_31": res1['interest Summary2'][0]['fifteeN_TO_31'],
          //   "oveR_ONE_MONTH_TO_2_MONTHS": res1['interest Summary2'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
          //   "oveR_2_MONTHS_TO_3_MONTHS": res1['interest Summary2'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
          //   "oveR_3_MONTHS_UPTO_6_MONTHS": res1['interest Summary2'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
          //   "oveR_6_MONTHS_UPTO_1_YEAR": res1['interest Summary2'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
          //   "oveR_1_YEAR_UPTO_3_YEARS": res1['interest Summary2'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
          //   "oveR_3_YEARS_UPTO_5_YEARS": res1['interest Summary2'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
          //   "oveR_5_YEARS": res1['interest Summary2'][0]['oveR_5_YEARS']
          // })


        }

        for (let i = 0; i < res1['principal Summary1'].length; i++) {


          this.totalreportar.push({
            "particulars": "Principal",
            "overdue": res1['principal Summary1'][0]['overdue'],
            "zerO_TO_7": res1['principal Summary1'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['principal Summary1'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['principal Summary1'][0]['fifteeN_TO_31'],
            "oveR_ONE_MONTH_TO_2_MONTHS": res1['principal Summary1'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
            "oveR_2_MONTHS_TO_3_MONTHS": res1['principal Summary1'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
            "oveR_3_MONTHS_UPTO_6_MONTHS": res1['principal Summary1'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
            "oveR_6_MONTHS_UPTO_1_YEAR": res1['principal Summary1'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
            "oveR_1_YEAR_UPTO_3_YEARS": res1['principal Summary1'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
            "oveR_3_YEARS_UPTO_5_YEARS": res1['principal Summary1'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
            "oveR_5_YEARS": res1['principal Summary1'][0]['oveR_5_YEARS']
          })

          // this.totalreportar3.push({
          //   "particulars":"Principal",
          //   "overdue": res1['principal Summary1'][0]['overdue'],
          //   "zerO_TO_7": res1['principal Summary1'][0]['zerO_TO_7'],
          //   "eighT_TO_14": res1['principal Summary1'][0]['eighT_TO_14'],
          //   "fifteeN_TO_31": res1['principal Summary1'][0]['fifteeN_TO_31'],
          //   "oveR_ONE_MONTH_TO_2_MONTHS": res1['principal Summary1'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
          //   "oveR_2_MONTHS_TO_3_MONTHS": res1['principal Summary1'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
          //   "oveR_3_MONTHS_UPTO_6_MONTHS": res1['principal Summary1'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
          //   "oveR_6_MONTHS_UPTO_1_YEAR": res1['principal Summary1'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
          //   "oveR_1_YEAR_UPTO_3_YEARS": res1['principal Summary1'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
          //   "oveR_3_YEARS_UPTO_5_YEARS": res1['principal Summary1'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
          //   "oveR_5_YEARS": res1['principal Summary1'][0]['oveR_5_YEARS']
          // })
        }
        // for(let i = 0;i<=this.totalreportar.length;i++){
        //   this.totalreportar
        // }

        for (let i = 0; i < res1['interest Received Summary'].length; i++) {
          this.totalreportar2.push({
            "particulars": "Interest",
            "overdue": res1['interest Received Summary'][0]['overdue'],
            "zerO_TO_7": res1['interest Received Summary'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['interest Received Summary'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['interest Received Summary'][0]['fifteeN_TO_31'],

          })


        }

        for (let i = 0; i < res1['principal Received Summary'].length; i++) {


          this.totalreportar2.push({
            "particulars": "Principal",
            "overdue": res1['principal Received Summary'][0]['overdue'],
            "zerO_TO_7": res1['principal Received Summary'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['principal Received Summary'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['principal Received Summary'][0]['fifteeN_TO_31'],

          })
        }

        for (let i = 0; i < res1['Advance Summary'].length; i++) {


          this.totalreportar.push({
            "particulars": "Advance Recieved",
            "overdue": res1['Advance Summary'][0]['overdue'],
            "zerO_TO_7": res1['Advance Summary'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['Advance Summary'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['Advance Summary'][0]['fifteeN_TO_31'],
            "oveR_ONE_MONTH_TO_2_MONTHS": res1['Advance Summary'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
            "oveR_2_MONTHS_TO_3_MONTHS": res1['Advance Summary'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
            "oveR_3_MONTHS_UPTO_6_MONTHS": res1['Advance Summary'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
            "oveR_6_MONTHS_UPTO_1_YEAR": res1['Advance Summary'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
            "oveR_1_YEAR_UPTO_3_YEARS": res1['Advance Summary'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
            "oveR_3_YEARS_UPTO_5_YEARS": res1['Advance Summary'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
            "oveR_5_YEARS": res1['Advance Summary'][0]['oveR_5_YEARS']

          })


          //  this.totalreportar3.push({
          //   "particulars":"Advance Recieved",
          //   "overdue": res1['Advance Summary'][0]['overdue'],
          //    "zerO_TO_7": res1['Advance Summary'][0]['zerO_TO_7'],
          //    "eighT_TO_14": res1['Advance Summary'][0]['eighT_TO_14'],
          //    "fifteeN_TO_31": res1['Advance Summary'][0]['fifteeN_TO_31'],
          //    "oveR_ONE_MONTH_TO_2_MONTHS": res1['Advance Summary'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
          //    "oveR_2_MONTHS_TO_3_MONTHS": res1['Advance Summary'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
          //    "oveR_3_MONTHS_UPTO_6_MONTHS": res1['Advance Summary'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
          //    "oveR_6_MONTHS_UPTO_1_YEAR": res1['Advance Summary'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
          //    "oveR_1_YEAR_UPTO_3_YEARS": res1['Advance Summary'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
          //    "oveR_3_YEARS_UPTO_5_YEARS": res1['Advance Summary'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
          //    "oveR_5_YEARS": res1['Advance Summary'][0]['oveR_5_YEARS']

          // })
        }

        for (let i = 0; i < res1['principal Summary1 NPA'].length; i++) {


          this.totalreportar3.push({
            "particulars": "Principal Summery1 NPA",
            "overdue": res1['principal Summary1 NPA'][0]['overdue'],
            "zerO_TO_7": res1['principal Summary1 NPA'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['principal Summary1 NPA'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['principal Summary1 NPA'][0]['fifteeN_TO_31'],
            "oveR_ONE_MONTH_TO_2_MONTHS": res1['principal Summary1 NPA'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
            "oveR_2_MONTHS_TO_3_MONTHS": res1['principal Summary1 NPA'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
            "oveR_3_MONTHS_UPTO_6_MONTHS": res1['principal Summary1 NPA'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
            "oveR_6_MONTHS_UPTO_1_YEAR": res1['principal Summary1 NPA'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
            "oveR_1_YEAR_UPTO_3_YEARS": res1['principal Summary1 NPA'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
            "oveR_3_YEARS_UPTO_5_YEARS": res1['principal Summary1 NPA'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
            "oveR_5_YEARS": res1['principal Summary1 NPA'][0]['oveR_5_YEARS']

          })



        }

        for (let i = 0; i < res1['interest Summary2 NPA'].length; i++) {


          this.totalreportar3.push({
            "particulars": "Interest Summery2 NPA",
            "overdue": res1['interest Summary2 NPA'][0]['overdue'],
            "zerO_TO_7": res1['interest Summary2 NPA'][0]['zerO_TO_7'],
            "eighT_TO_14": res1['interest Summary2 NPA'][0]['eighT_TO_14'],
            "fifteeN_TO_31": res1['interest Summary2 NPA'][0]['fifteeN_TO_31'],
            "oveR_ONE_MONTH_TO_2_MONTHS": res1['interest Summary2 NPA'][0]['oveR_ONE_MONTH_TO_2_MONTHS'],
            "oveR_2_MONTHS_TO_3_MONTHS": res1['interest Summary2 NPA'][0]['oveR_2_MONTHS_TO_3_MONTHS'],
            "oveR_3_MONTHS_UPTO_6_MONTHS": res1['interest Summary2 NPA'][0]['oveR_3_MONTHS_UPTO_6_MONTHS'],
            "oveR_6_MONTHS_UPTO_1_YEAR": res1['interest Summary2 NPA'][0]['oveR_6_MONTHS_UPTO_1_YEAR'],
            "oveR_1_YEAR_UPTO_3_YEARS": res1['interest Summary2 NPA'][0]['oveR_1_YEAR_UPTO_3_YEARS'],
            "oveR_3_YEARS_UPTO_5_YEARS": res1['interest Summary2 NPA'][0]['oveR_3_YEARS_UPTO_5_YEARS'],
            "oveR_5_YEARS": res1['interest Summary2 NPA'][0]['oveR_5_YEARS']

          })



        }

        this.dataSource2 = new MatTableDataSource(this.totalreportar2);

        this.dataSource1 = new MatTableDataSource(this.totalreportar);
        this.dataSource3 = new MatTableDataSource(this.totalreportar3);


      }else {
        this.DisplayMessage('No Data Found', 'Alert');           //res1['status'].message
      }
    })
  }
  ExportExceldue(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "ALM_RBI-report" + new Date().toLocaleDateString() + ".xlsx");
  }
  ExportExceldue2(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "ALM_RBI-report" + new Date().toLocaleDateString() + ".xlsx");
  }

  ExportExceldue3(id) {
    /* table id is passed over here */
    let element = document.getElementById(id);
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, "ALM_RBI-report" + new Date().toLocaleDateString() + ".xlsx");
  }

   DisplayMessage(message: string, action: string) {
      const dialogRef = this.dialog.open(AlertMessageComponenent, {
        width: '30%',
        data: { message: message, type: action },
      });
      dialogRef.afterClosed().subscribe(result => {
      });
    }
}
