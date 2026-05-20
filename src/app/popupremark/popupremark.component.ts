import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-popupremark',
  templateUrl: './popupremark.component.html',
  styleUrls: ['./popupremark.component.scss']
})
export class PopupremarkComponent implements OnInit {
  remarks:any
  mandate: any;

  constructor( public dialogRef: MatDialogRef<PopupremarkComponent> ,@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    // debugger
if(this.data.message == null){
  this.mandate = ""
}else{
  this.mandate = "for MandateID "+this.data.message

}
  }
  getSelectedLoanDetails(){
    
    this.dialogRef.close({ remarks:this.remarks} );

  }


}
