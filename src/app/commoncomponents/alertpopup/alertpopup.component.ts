import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";





@Component({
    selector: 'app-alertdialog',
    templateUrl: 'alertcomponent.html',
  })
  export class AlertMessageComponenent {
  
    constructor(
      public dialogRef: MatDialogRef<AlertMessageComponenent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }


//   Save;
// Data submitted Successfully

// Alert;
//  ---- > from API message

// Update
// Data updated Sucessfully