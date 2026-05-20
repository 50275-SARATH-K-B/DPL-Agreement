import { Component, OnInit,ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-commonusermenu',
  templateUrl: './commonusermenu.component.html',
  styleUrls: ['./commonusermenu.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CommonusermenuComponent implements OnInit {

  userData: any;
  public userImage = 'assets/img/profile/customer.png';
  userData1: any;
  constructor() { }

  ngOnInit() {
    if(!!sessionStorage.branchuser){
      this.userData1 = JSON.parse(sessionStorage.branchuser)

    }else if(!!sessionStorage.currentUser)
    this.userData1 = JSON.parse(sessionStorage.currentUser)

  }

}