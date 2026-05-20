import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-branchusermenu',
  templateUrl: './branchusermenu.component.html',
  styleUrls: ['./branchusermenu.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class BranchusermenuComponent implements OnInit {
  userData: any;
  public userImage = 'assets/img/profile/customer.png';
  constructor() { }

  ngOnInit() {
    this.userData = JSON.parse(sessionStorage.branchuser)

  }

}
