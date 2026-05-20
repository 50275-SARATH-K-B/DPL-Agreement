import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AlertMessageComponenent } from '../../../commoncomponents/alertpopup/alertpopup.component';
import { RepaymentService } from '../../../services/report/repayment.service';

@Component({
  selector: 'app-customerremoval',
  templateUrl: './customerremoval.component.html',
  styleUrls: ['./customerremoval.component.scss']
})
export class CustomerremovalComponent implements OnInit {
  custrrmvl: string;

  constructor(public dialog: MatDialog,private repaymentService: RepaymentService) { }

  ngOnInit() {
  }
  remove(){
    if(!!this.custrrmvl){
      let params = {
        "CustomerID":this.custrrmvl
      }
      this.repaymentService.customerremove(params).subscribe(result=>{
        if (result['status'].flag == 1 && result['status'].code == 1) {
          this.displayMessage(result['status'].message,"Success");
          this.custrrmvl = ""

        } else{
          this.displayMessage(result['status'].message,"Alert");

        }
      })
    }


  }
  keyPress(event: any) {
    const pattern = /^\d*\.?\d{0,2}$/;
  

    let value = event.target.value;
     let current: string = value;
      const position = event.target.selectionStart;
      const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
      if (next && !String(next).match(pattern)) {
       event.preventDefault();
      }
  }
  clear(){
    this.custrrmvl = ""
  }
  displayMessage(message: string, type: string): any {
    const dialogRef = this.dialog.open(AlertMessageComponenent, {
      width: '30%',
      data: { message: message, type: type }
    });
  }
}
