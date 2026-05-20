import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-commonalert',
  templateUrl: './commonalert.component.html',
  styleUrls: ['./commonalert.component.scss']
})
export class CommonalertComponent implements OnInit {
  mess: boolean = false;
  reasonconfirmation: boolean = false;
  normalmess: boolean = true;
  value: any;
  baddebit: boolean;
  concurrent:boolean =false
  datamsg:any;

  constructor(public dialogRef: MatDialogRef<CommonalertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommonalertComponent) { }

  ngOnInit(): void {
    if (this.data) {
      if (this.data['message'] == "true") {
        this.mess = true;
        this.reasonconfirmation = false;
        this.normalmess = false;
      }
      else if (this.data['message'] == "nonrepo") {
        this.reasonconfirmation = true;
        this.normalmess = false;
        this.value = this.data['value']
      }
      else if(this.data["message"]=="baddebit"){
        this.baddebit=true
        this.normalmess = false;
      }else if(this.data["message"]=="concurrent"){
        this.baddebit=false
        this.concurrent=true
        this.reasonconfirmation = false;
        this.normalmess = false;
        this.datamsg=this.data["datamsg"]
      }

      else {
        this.normalmess = true;
        this.reasonconfirmation = false;
      }
    }
  }
  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close(true);
  }
  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(false);
  }

}
