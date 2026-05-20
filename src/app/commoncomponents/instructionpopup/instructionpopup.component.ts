import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";





@Component({
    selector: 'app-alertdialog',
    templateUrl: 'instructioncomponent.html',
  })
  export class InstructionMessageComponenent {
  
    constructor(
      public dialogRef: MatDialogRef<InstructionMessageComponenent>,
      @Inject(MAT_DIALOG_DATA) public data: any) { dialogRef.disableClose = true; }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }