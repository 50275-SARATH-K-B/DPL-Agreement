import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  AutoprintService } from '../../services/auto-print/autoprint.service';
import { NumberToWordsPipe } from '../../custome-pipes/numbertoword.pipe';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-cashreciept',
  templateUrl: './cashreciept.component.html',
  styleUrls: ['./cashreciept.component.scss'],
  providers: [ NumberToWordsPipe ]
})
export class CashrecieptComponent implements OnInit {
  customerName:any;
  amount:any;
  date:any;
  time:any;
  loanno:any;
  userData: any = JSON.parse(sessionStorage.getItem("currentUser"));
  constructor(public cashrecptService:AutoprintService, public router: Router,private NumberToWordsPipe:NumberToWordsPipe) { }

  ngOnInit() {
  this.customerName=this.cashrecptService.customerName;
  this.amount=this.cashrecptService.amount;
  let date=this.cashrecptService.DateTime;
 this.loanno=this.cashrecptService.loanNo;
  let array=date.split(" ");
  this.date=array[0];
  this.time=array[1];
  }

  print(printSectionId): void {
    var data = document.getElementById(printSectionId);
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 240;
      var pageHeight = 430;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 3;
      pdf.addImage(contentDataURL, 'PNG', -5, position, imgWidth, imgHeight)
      //pdf.autoPrint();
     
        pdf.autoPrint();
        let wnd = window.open(pdf.output('bloburl'), '_blank');
        setTimeout(function () {
          wnd.close();
        }, 1500);
      
      //pdf.save('MYPdf.pdf'); // Generated PDF  
      //this.onNoClick(); 

    });


  }

  ngAfterContentInit() {
    this.print('printSectionId');
      // this.router.navigate(['/repayment/installment-receipt']);
    

  }

}
